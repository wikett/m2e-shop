<template>

<div>
    <v-hover>
        <v-card slot-scope="{ hover }" class="product-item mr-4 mb-4" color="grey lighten-4" max-width="400">
            <v-img :aspect-ratio="16/9" :src="'https://res.cloudinary.com/djhqderty/image/upload/c_fit/' + info.photo">
                <v-expand-transition>
                    <div v-if="hover" class="d-flex transition-fast-in-fast-out orange darken-2 v-card--reveal display-3 white--text" style="height: 100%;">
                        £{{info.price}}
                    </div>
                </v-expand-transition>
            </v-img>
            <v-card-text class="pt-4" style="position: relative;">
                <v-btn absolute color="orange" :disabled="info.stock===0" class="white--text" @click="addProductToCart(info)" fab medium right top>
                    <v-icon>shopping_cart</v-icon>
                </v-btn>
                <div class="font-weight-light grey--text title mb-2">Stock: <strong>{{info.stock}}</strong></div>
                <h4 class="font-weight-light orange--text mb-2">{{info.name}}</h4>
                <div class="font-weight-light title mb-2">
                    <span>£{{info.price}}</span>
                </div>
            </v-card-text>
        </v-card>
    </v-hover>
    <v-snackbar v-model="snackbar" :timeout="timeout" color="info" :top=top>
        {{ text }}
        <v-btn dark flat @click="snackbar = false">
            Close
        </v-btn>
    </v-snackbar>
</div>

</template>

<script>

export default {
    props: ['info'],
    data() {
        return {
            snackbar: false,
            timeout: 1000,
            top: true,
            text: ''
        }
    },
    methods: {
        addProductToCart(product) {

            this.$store.dispatch('addProductToCart', product)
            this.text = product.name + " added."
            this.snackbar = true;
        }
    }
}

</script>

<style scoped>

.v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    opacity: .5;
    position: absolute;
    width: 100%;
}

.flex-item {
    background: tomato;
    padding: 5px;
    width: 400px;
    height: 250px;
    margin-right: 10px;
    margin-bottom: 10px;
    line-height: 150px;
    color: white;
    font-weight: bold;
    font-size: 3em;
    text-align: center;
}

.product-item {
    width: 350px;
}

.product-item h4 {
    font-size: 2em;
}

@media (min-width: 1904px) {
    .flex-item {
        background: blue;
    }
}

@media (max-width: 1904px) and (min-width: 1264px) {
    .flex-item {
        background: green;
        width: 300px;
    }
}

@media (max-width: 1264px) and (min-width: 960px) {
    .flex-item {
        background: yellow;
        width: 200px;
    }
}

@media (max-width: 960px) and (min-width: 600px) {
    .flex-item {
        background: cyan;
        width: 200px;
    }
}

@media (max-width: 600px) {
    .flex-item {
        background: brown;
        width: 300px;
    }
}

</style>
