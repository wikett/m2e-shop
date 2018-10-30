<template>
<div>
    <v-toolbar app>
        <v-toolbar-title @click="toHome()" class="headline text-uppercase" style="cursor: pointer;">
            <span to="/checkout">M2E</span>
            <span class="font-weight-light">Shop</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-spacer></v-spacer>
        <v-toolbar-items>

            <v-badge class="mt-3 mr-5" color="#8e23a6" :disabled="getCartTotal===0">
                <span slot="badge">{{this.getCartTotal}}</span>

                <v-btn flat icon to="/checkout" :disabled="getCartTotal===0" color="#8e23a6">
                    <v-icon large>shopping_cart</v-icon>
                </v-btn>
            </v-badge>

            <v-btn flat>Login</v-btn>
        </v-toolbar-items>
    </v-toolbar>
</div>

</template>

<script>

import {
    mapGetters
}
from 'vuex'

export default {
    data() {
            return {}
        },
        computed: {
            ...mapGetters({
                getCartTotal: 'getCartTotal'
            })
        },
        mounted() {

        },
        methods: {
            toHome() {
                this.$router.push("/");
            }
        }
}

</script>
