import axios from 'axios'
import qs from 'qs'

export default {
/*
 * Get Product list
 */
 getProductList(){

   return axios({
      method: 'GET',
      url: process.env.VUE_APP_M2E_API+"/products"
    })
    .then(response => {
      return response.data;
    })
 },

 /*
  * Update Stock
  */
 updateStockProduct(product){
   console.log(`API: updateStockProduct: ${product}`)
   return axios({
     headers: {
         "Content-Type": 'application/json'
       },
      method: 'PUT',
      url: process.env.VUE_APP_M2E_API+"/products/"+product.id,
      data: JSON.stringify(product)
    })
    .then(response => {
      return response.data;
    })
 }
}
