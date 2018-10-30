import Vue from 'vue'
import Vuex from 'vuex'

// modules
import auth from './modules/auth';
import shop from './modules/shop';




Vue.use(Vuex);

export const store = new Vuex.Store({
    modules: {
        auth,
        shop
    }
})
