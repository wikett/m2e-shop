
import m2eAPI from '../../../api/m2eAPI'
import _ from 'lodash'

const state = {
    cart:[],
    cartTotal: 0,
    cartTotalCost: 0,
    productList:[],
    productListFiltered:[],
    totalProducts: 0,
    loader: false
  }

// getters
const getters = {
   getCart: state => {
      return state.cart;
   },
   getCartTotal: state =>{
     return state.cartTotal;
   },
   getCartTotalCost: state =>{
     return parseFloat(state.cartTotalCost).toFixed(2);
   },
   getCartGroupedBy: state =>{
     return _.groupBy(state.cart, 'name');
   },
   getCartProducts: state =>{
     const productsCartList = [];
     _.each(_.groupBy(state.cart, 'name'), function(item){
          const productCartObject = {};
          productCartObject.name = item[0].name;
          productCartObject.quantity = item.length;
          productCartObject.price = item[0].price;
          productCartObject.photo = item[0].photo;
          productsCartList.push(productCartObject);
     });
     return productsCartList;

   },
   getProductList: state => {
      return state.productList;
   },
   getLoader: state => {
      return state.loader;
   },
   getTotalProducts: state =>{
     return state.totalProducts;
   }
}

// actions
const actions = {

   loadProducts(context){
     context.commit('startCall');
     return m2eAPI.getProductList()
      .then(products =>{

        context.commit('loadProductsHandler', products)
        context.commit('endCall');

      })
      .catch(error => {
          console.log(error);
          throw error;
      })

   },
   addProductToCart(context, payload) {

       context.commit('addProductToCartHandler', payload);

       if(payload.stock>0)
       {
         payload.stock = payload.stock-1;

         return m2eAPI.updateStockProduct(payload)
          .then(products =>{
            console.log(`Result: ${JSON.stringify(products)}`)
          })
          .catch(error => {
              console.log(error);
              throw error;
          })

       }

   },
   decreaseProductFromCart(context, payload) {
     let productListFound = _.find(state.productList, function(o){return o.name===payload});

     productListFound.stock = productListFound.stock+1;

     return m2eAPI.updateStockProduct(productListFound)
      .then(products =>{
        context.commit("decreaseProductFromCartHandler", payload);
        })
      .catch(error => {
          console.log(error);
          throw error;
      })
   },
   removeProductFromCart(context, payload){
     let productListFound = _.find(state.productList, function(o){return o.name===payload.name});

     productListFound.stock = productListFound.stock+payload.quantity;

     return m2eAPI.updateStockProduct(productListFound)
      .then(products =>{
        context.commit("removeProductFromCartHandler", payload);
        })
      .catch(error => {
          console.log(error);
          throw error;
      })

   },
   increaseQuantity(context, payload){

     let itemFound = _.find(state.cart, function(o){return o.name===payload});
     let productListFound = _.find(state.productList, function(o){return o.name===payload});



     if(productListFound.stock>0)
     {
       productListFound.stock = productListFound.stock-1;

       return m2eAPI.updateStockProduct(productListFound)
        .then(products =>{
          context.commit('increaseQuantityHandler', itemFound);
          })
        .catch(error => {
            console.log(error);
            throw error;
        })

     }
   },
   increaseStockByOne(context, payload) {
      let itemFound = _.find(state.cart, function(o){return o.name===payload});
      context.commit('increaseStockByOneHandler', itemFound);
   }

}

// mutations
const mutations = {
  startCall(state){
    state.loader = true;
  },
  endCall(state){
    state.loader = false;
  },
  loadProductsHandler(state, payload){

    state.productList = payload.rows;
    state.totalProducts = payload.count;
  },
   addProductToCartHandler(state, payload) {
     state.cartTotal += 1;
     let itemFound = _.find(state.cart, function(o){return o.name===payload.name});
     if(_.isUndefined(itemFound)){
       // Add to cart
       console.log(`add to cart: ${payload.name}`)
       let newProduct = {
           id: payload.id,
           photo: payload.photo,
           name: payload.name,
           price: payload.price,
           quantity: 1,
           total: payload.price
        }
        state.cart.push(newProduct);
        state.cartTotalCost += payload.price;
     }
     else {
       // increase quantity
       let indexProduct = _.findIndex(state.cart, {name: payload.name});
       state.cart[indexProduct].total += payload.price;
       state.cart[indexProduct].quantity += 1;
       state.cartTotalCost += payload.price;
     }
   },
   decreaseProductFromCartHandler(state, payload) {
     state.cartTotal -= 1;
     let itemFound = _.find(state.cart, function(o){return o.name===payload});
     let indexProduct = _.findIndex(state.cart, {name: payload});

     if(itemFound.quantity===1){
       // Remove from cart
       state.cart.splice(indexProduct, 1);
        state.cartTotalCost -= itemFound.price;
     }
     else {
       // decrease quantity
       state.cart[indexProduct].total -= itemFound.price;
       state.cart[indexProduct].quantity -= 1;
       state.cartTotalCost -= itemFound.price;
     }
   },
   removeProductFromCartHandler(state, payload){
     state.cartTotal -= payload.quantity;

     let itemFound = _.find(state.cart, function(o){return o.name===payload.name});
     let indexProduct = _.findIndex(state.cart, {name: payload.name});

     state.cart.splice(indexProduct, 1);
     state.cartTotalCost -= (itemFound.price*payload.quantity);

   },
   increaseQuantityHandler(state, payload) {
     state.cartTotal += 1;

     let indexProduct = _.findIndex(state.cart, {name: payload.name});

     state.cart[indexProduct].total += payload.price;
     state.cart[indexProduct].quantity += 1;
     state.cartTotalCost += payload.price;

   },
   increaseStockByOneHandler(state, payload)
   {
     let itemFound = _.find(state.productList, function(o){return o.name===payload});
     let indexProduct = _.findIndex(state.productList, {name: payload});

     state.productList[indexProduct].stock += 1;
   },
   decreaseStockByOneHandler(state, payload)
   {
     let indexProduct = _.findIndex(state.productList, {name: payload});
     state.productList[indexProduct].stock -= 1;
   }
}

export default {
   state,
   getters,
   actions,
   mutations
}
