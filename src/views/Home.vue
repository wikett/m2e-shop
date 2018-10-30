<template>

<div>
    <v-container fluid>

        <v-layout align-start justify-start row wrap>

            <v-flex xl12 lg12 md12 sm12 xs12>
                <v-container>
                    <v-layout v-show="!getLoader" justify-start row wrap>
                        <product v-for="item in getProductList" :key="item.id" v-bind:info="item"></product>
                    </v-layout>
                    <v-layout v-show="getLoader" align-center justify-center>
                        <breeding-rhombus-spinner :animation-duration="2000" :size="65" color="#ff1d5e" />

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
import Product from '../components/Product'
import m2eAPI from '../api/m2eAPI'
import {
    BreedingRhombusSpinner
}
from 'epic-spinners'

export default {
    components: {
        Product,
        BreedingRhombusSpinner
    },
    data() {
        return {
            productList: [],
            loader: false
        }
    },
    computed: {
        ...mapGetters({
            getProductList: 'getProductList',
            getTotalProducts: 'getTotalProducts',
            getLoader: 'getLoader',
            getCart: 'getCart',
            getCartGroupedBy: 'getCartGroupedBy',
            getCartTotal: 'getCartTotal'
        })
    },
    mounted() {
        this.$store.dispatch('loadProducts');

    },
    methods: {

    }
}

</script>
