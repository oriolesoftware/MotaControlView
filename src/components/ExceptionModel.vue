<template>
    <Modal v-model="exceptionModel" width="700" :closable="false" :mask-closable="false">
        <p slot="header" style="color:#ed4014;text-align:center">
            <Icon type="ios-information-circle"></Icon>
            <span>系统发生错误或异常</span>
        </p>
        <div style="text-align:center">
            <img src="../images/system-fail.png" width="200" style="margin: 10px;">
            <p style="font-size: 16px;">由于设备发生致命错误，我们被迫终止本次打印服务，给您带来的不便我们深表歉意。</p>
            <p style="color: #999999">若您已经付费，请保留下方随机用户码进行退费，您将在1个工作日内获得全额退款与一次免费打印机会（限20张内）</p>
            <p style="margin: 5px">随机用户编码：<span style="font-size: 22px">{{randomCode}}-ET</span></p>
        </div>
        <div slot="footer">
            <Table :columns="title" :data="errorMsg"></Table>
            <v-countdownButton ref="countdown" style="font-size:16px;margin-top: 10px;"></v-countdownButton>
        </div>
    </Modal>
</template>

<script>
    import CountdownButton from '../components/CountdownButton.vue';
    export default {
        components:{
            'v-countdownButton':CountdownButton,
        },
        data() {
            return {
                title:[
                    {
                        title: '执行结果',
                        key: 'state',
                        width: 90
                    },
                    {
                        title: '代码',
                        key: 'code',
                        width: 90
                    },
                    {
                        title: '异常信息',
                        key: 'msg'
                    }
                ],
                errorMsg:[],
                exceptionModel:false,
                randomCode:null,
            };
        },
        props:{
        },
        methods:{
            openExceptionModel(randomCode,errorMsg,errorCode="-1",state="ERROR",isNeedStopServer){
                if(isNeedStopServer){
                    this.$refs.countdown.countDownStart(60,"/StopServer");
                }else {
                    this.$refs.countdown.countDownStart(60);
                }
                this.randomCode=randomCode;
                var errorInfo={};
                errorInfo.code=errorCode;
                errorInfo.state=state;
                errorInfo.msg=errorMsg;
                this.errorMsg.push(errorInfo);
                this.exceptionModel=true;
            },
        }
    }
</script>

<style scoped>

</style>