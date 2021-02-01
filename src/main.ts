import Vue from 'vue';
import App from './App.vue';
import router from './router';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import ApolloClient from 'apollo-boost';
import VueApollo from 'vue-apollo';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

Vue.config.productionTip = false;

Vue.use(VueApollo);

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);

const apolloClient = new ApolloClient({
  uri: 'http://localhost:4080/graphql',
});

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

new Vue({
  router,
  apolloProvider,
  render: h => h(App),
}).$mount('#app');
