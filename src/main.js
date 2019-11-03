import Vue from 'vue';
import iView from 'iview'
import VueRouter from 'vue-router';
import Routers from './router';
import Util from './libs/util';
import App from './app.vue';
import 'iview/dist/styles/iview.css';
import axios from 'axios'
import VueAxios from 'vue-axios'
import '../my-theme/index.less';

Vue.use(VueAxios,axios);
Vue.use(VueRouter);
Vue.use(iView);

// 路由配置
const RouterConfig = {
    base:'/controllerView/',
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    iView.LoadingBar.start();
    Util.title(to.meta.title);
    next();
});

router.afterEach((to, from, next) => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

new Vue({
    el: '#app',
    router: router,
    data: function(){
        return {
            /*设备ID*/
            deviceID: "",
            /*用户随机标识*/
            randomCode:"",
            /*设备服务器URL*/
            serverUrl:"",
            websocketUrl:"",
            /*默认倒计时时间*/
            countdownReturnTime: 0,
            /*倒计时ClockID*/
            countdownClock: 0,
            /*全局背景*/
            background: {
                backgroundImage: "url(" + require("./images/background.png") + ")",
                backgroundPosition: "center",
                backgroundSize: "cover"
            },
        }
    },
    render: h => h(App),
});

