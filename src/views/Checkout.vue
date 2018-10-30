<template>

<div>
    <v-container fluid>

        <v-layout align-start justify-start row wrap>

            <v-flex xl9 lg9 md9 sm12 xs12>
                <v-data-table :headers="headers" :items="getCart" hide-actions class="elevation-1">
                    <template slot="items" slot-scope="props">
                        <td class="hidden-xs-only">
                            <v-img :src="'https://res.cloudinary.com/djhqderty/image/upload/c_fit/' + props.item.photo"></v-img>
                        </td>
                        <td>{{ props.item.name }}</td>
                        <td class="text-xs-right hidden-xs-only">{{getStockProduct(props.item.name)}}</td>
                        <td class="text-xs-right hidden-xs-only">£{{ props.item.price }}</td>
                        <td class="text-xs-center">
                            {{ props.item.quantity }}
                            <v-btn flat icon color="pink" @click="decreaseItem(props.item.name)" style="margin:0px">
                                <v-icon>remove_circle_outline</v-icon>
                            </v-btn>
                            <v-btn flat icon color="blue" @click="addItem(props.item.name)" :disabled="getStockProduct(props.item.name)===0" style="margin:0px">
                                <v-icon>add_circle_outline</v-icon>
                            </v-btn>
                        </td>
                        <td class="text-xs-right">
                            <v-btn flat icon color="red" @click="removeItem(props.item.name)" style="margin:0px">
                                <v-icon>delete_outline</v-icon>
                            </v-btn>
                        </td>
                        <td class="text-xs-right">£{{ parseFloat(props.item.total).toFixed(2) }}</td>

                    </template>
                    <template slot="footer">
                        <td colspan="100%" class="text-xs-right" v-show="getCart.length>0">
                            <p><strong>Total: £{{getCartTotalCost}}</strong></p>
                            <p v-if="applyvoucher"><strong class="green--text">Voucher disccount: -£5.00</strong></p>
                            <p v-if="applyvoucher"><strong>Total: £{{parseFloat(getCartTotalCost-5).toFixed(2) }}</strong></p>

                        </td>
                    </template>
                </v-data-table>
                <div class="text-xs-right  mt-3">
                    <v-btn dark color="blue" @click="dialog = true">Checkout</v-btn>
                    <v-dialog v-model="dialog" max-width="290">
                        <v-card>
                            <v-card-title class="headline">Have you finished to add products?</v-card-title>

                            <v-card-text>
                                We are going to proceed with your cart. Thank you to buy in M2E Shop.
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>

                                <v-btn color="green darken-1" flat="flat" @click="dialog = false">
                                    No
                                </v-btn>

                                <v-btn color="green darken-1" flat="flat" @click="checkout()">
                                    Yes
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </div>
            </v-flex>
            <v-flex xl3 lg3 md3 sm12 xs12>
                <v-container>
                    <v-layout align-start row wrap>
                        <v-card>


                            <v-card-title primary-title>
                                <div>
                                    <h3 class="headline mb-0">Take £5 off of your total cart</h3>
                                    <v-text-field v-model="voucher" label="Voucher Code" :error-messages="voucherError" :disabled="applyvoucher"></v-text-field>
                                </div>
                            </v-card-title>

                            <v-card-actions>
                                <v-btn flat color="orange" :disabled="voucher.length===0  || getCartProducts.length===0 || applyvoucher" @click="ApplyVoucherCode()">Apply</v-btn>
                            </v-card-actions>
                        </v-card>

                    </v-layout>
                </v-container>

            </v-flex>
        </v-layout>

    </v-container>
</div>

</template>

<script>

import {
    mapGetters
}
from 'vuex'
import _ from 'lodash'

export default {
    data() {
        return {
            productCart: [],
            dialog: false,
            headers: [{
                    text: '',
                    align: 'center',
                    value: 'photo',
                    sortable: false,
                    class: 'hidden-xs-only'
                }, {
                    text: 'Product',
                    align: 'left',
                    value: 'product',
                    sortable: false

                }, {
                    text: 'Stock',
                    align: 'right',
                    value: 'stock',
                    sortable: false,
                    class: 'hidden-xs-only'
                }, {
                    text: 'Price (£)',
                    align: 'right',
                    value: 'price',
                    sortable: false,
                    class: 'hidden-xs-only'
                }, {
                    text: 'Quantity',
                    align: 'center',
                    value: 'quantity',
                    sortable: false
                }, {
                    text: '',
                    align: 'right',
                    value: 'remove',
                    sortable: false,
                    class: 'hidden-xs-only'
                }, {
                    text: 'Total (£)',
                    align: 'right',
                    value: 'total',
                    sortable: false
                }

            ],
            voucher: "",
            voucherError: "",
            applyvoucher: false
        }
    },
    computed: {
        ...mapGetters({
            getProductList: 'getProductList',
            getTotalProducts: 'getTotalProducts',
            getLoader: 'getLoader',
            getCart: 'getCart',
            getCartGroupedBy: 'getCartGroupedBy',
            getCartProducts: 'getCartProducts',
            getCartTotalCost: 'getCartTotalCost'
        })
    },
    mounted() {

    },
    methods: {
        checkout() {
                location.assign("/");
            },
            ApplyVoucherCode() {
                if (this.getCartProducts.length === 0) {
                    this.voucherError = "Add something to your basket"
                } else {
                    if (this.voucher === process.env.VUE_APP_VOUCHER_CODE) {
                        this.applyvoucher = true;
                        this.voucherError = ""
                    } else {
                        this.voucherError = "Wrong voucher code."
                        this.voucher = "";
                    }
                }
            },
            removeItem(productName) {
                let itemFound = _.find(this.getCart, function(o) {
                    return o.name === productName
                });
                this.$store.dispatch('removeProductFromCart', itemFound);
            },
            getStockProduct(productName) {
                let itemFound = _.find(this.getProductList, function(o) {
                    return o.name === productName
                });
                return itemFound.stock;
            },
            decreaseItem(productName) {
                this.$store.dispatch('decreaseProductFromCart', productName);
            },
            addItem(productName) {
                this.$store.dispatch('increaseQuantity', productName);
            }
    }
}

</script>
