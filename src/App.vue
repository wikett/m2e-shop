<template>
<v-app>
    <app-header></app-header>
    <v-content>
    <v-container fluid>
      <router-view></router-view>
    </v-container>
  </v-content>

</v-app>
</template>

<script>

import Header from './components/Header.vue'

export default {
    name: 'App',
    components: {
        appHeader: Header,
    },
    data() {
        return {

        }
    }
}

</script>
