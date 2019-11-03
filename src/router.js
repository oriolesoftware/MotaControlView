const routers = [
    {
        path: '/Carousel',
        meta: {
            title: '轮播图'
        },
        component: (resolve) => require(['./views/Carousel.vue'], resolve)
    },
    {
        path: '/',
        meta: {
            title: '任务指示'
        },
        component: (resolve) => require(['./views/Index.vue'], resolve)
    },
    {
        path: '/UploadFile',
        name: 'UploadFile',
        meta: {
            title: '上传文件'
        },
        component: (resolve) => require(['./views/UploadFile.vue'], resolve)
    },
    {
        path: '/ChooseFile',
        name: 'ChooseFile',
        meta: {
            title: '选择文件'
        },
        component: (resolve) => require(['./views/ChooseFile.vue'], resolve)
    },
    {
        path: '/SetPrintParam',
        name: 'SetPrintParam',
        meta: {
            title: '设置参数'
        },
        component: (resolve) => require(['./views/SetPrintParam.vue'], resolve)
    },
    {
        path: '/ChooseServiceType',
        name: 'ChooseServiceType',
        meta: {
            title: '选择服务'
        },
        component: (resolve) => require(['./views/ChooseServiceType.vue'], resolve)
    },
    {
        path: '/Print',
        name: 'Print',
        meta: {
            title: '设备打印'
        },
        component: (resolve) => require(['./views/Print.vue'], resolve)
    },
    {
        path: '/Scan',
        name: 'Scan',
        meta: {
            title: '文件扫描'
        },
        component: (resolve) => require(['./views/Scan.vue'], resolve)
    },{
        path: '/StopServer',
        name: '',
        meta: {
            title: '服务终止'
        },
        component: (resolve) => require(['./views/StopServer.vue'], resolve)
    },
    {
        path: '/Loading',
        name: 'Loading',
        component: (resolve) => require(['./animation/loading.vue'], resolve)
    }
];
export default routers;