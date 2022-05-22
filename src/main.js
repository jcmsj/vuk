import { createApp } from 'vue'
import App from './App.vue'
import VueSimpleContextMenu from 'vue-simple-context-menu';
import 'vue-simple-context-menu/dist/vue-simple-context-menu.css';

const app = createApp(App);

app.component('vue-simple-context-menu', VueSimpleContextMenu);
app.mount('#app')