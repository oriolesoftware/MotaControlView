<style scoped>
    * {
        font-family: "PingFang SC Semibold";
        overflow: hidden;
    }

    .ivu-layout-header {
        background: #fff;
        height: auto;
    }

    .layout {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        border: 1px solid #d7dde4;
        border-radius: 4px;
        overflow: hidden;
        width: 100%;
        height: 100%;
    }

    .layout-footer-center {
        text-align: center;
        padding: 10px;
    }

    .spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }

</style>
<template>
    <div class="layout">
        <Layout class="layout">
            <Header style="padding: 20px">
                <Steps :current="4">
                    <Step title="已完成" content="上传文件或插入U盘"></Step>
                    <Step title="已完成" content="选择需要打印的文件"></Step>
                    <Step title="已完成" content="调整打印设置"></Step>
                    <Step title="已完成" content="选择打印方式"></Step>
                    <Step title="进行中" content="设备打印"></Step>
                </Steps>
            </Header>
            <Content style="height: 100%;padding: 2%" :style="this.$root.background">
                <v-exception ref="exceptionModel"></v-exception>
                <Modal v-model="printSuccessModel" width="800px" :closable="false" :mask-closable="false">
                    <p slot="header" style="color:#19be6b;text-align:center">
                        <Icon type="ios-information-circle"></Icon>
                        <span>成功</span>
                    </p>
                    <div style="text-align:center">
                        <p style="text-align:center;font-size: 18px;margin-bottom: 10px">打印任务已经顺利完成</p>
                        <p style="text-align:center;font-size: 14px;margin-bottom: 10px">请勿忘记您的U盘、背包或其他个人物品，感谢为您服务，下次再见</p>
                        <img src="../images/print-success.png" width="200" style="margin: 30px">
                    </div>
                    <div slot="footer">
                        <p style="text-align:center;font-size: 14px;margin-bottom: 10px">我们将在 {{this.$root.countdownReturnTime}} s后返回开始页面</p>
                    </div>
                </Modal>
                <Row>
                    <p style="text-align:center;font-size: 18px;color: #000000;">MOTA校园 · 免费自助打印设备</p>
                    <p style="text-align:center;font-size: 40px;margin-top:5px;color: #000000;">设备打印中，请稍后……</p>
                </Row>
                <Row style="height:80%;" type="flex" justify="center">
                    <Col span="18" style="align-items:center;display:flex;flex-direction:column;justify-content:center">
                        <img src="../images/printer-default.svg" width="100" style="margin: 30px">
                        <p style="font-size: 16px">海内存知己，天涯若比邻</p>
                        <p style="font-size: 32px">我们将很快完成</p>
                        <br/>
                        <Progress :percent="pseudoProgress" status="active"/>
                        <p style="font-size: 12px">(进度条指示为预估的打印时间，可能与实际时间不符，以实际打印进度为准)</p>
                        <p style="font-size: 18px;margin-top:10px">{{state}}</p>
                        <Button type="primary" @click="finishPrint">我已完成打印</Button>
                    </Col>
                </Row>

            </Content>
            <Footer><p class="layout-footer-center">2018-2019 &copy; Oriole Software MOTA</p>
                <v-countdownButton ref="countdown" style="position: absolute; right: 10px; bottom:10px;"></v-countdownButton>
            </Footer>
        </Layout>
    </div>
</template>
<script>
    import * as axios from "axios";
    import ExceptionModel from '../components/ExceptionModel.vue';
    import CountdownButton from '../components/CountdownButton.vue';

    export default {
        components:{
            'v-exception':ExceptionModel,
            'v-countdownButton':CountdownButton,
        },
        data() {
            return {
                state: "正在初始化设备",
                pseudoProgress: 0,
                processCountdownClock:0,
                printSuccessModel:false,
                stopCode:"40001",
                stopMsg:"未知错误",
            }
        },
        mounted() {
            this.doPrint();
        },
        methods: {
            doPrint() {
                this.printerStatusMonitor();
                axios({
                    method: 'get',
                    url: 'http://localhost:8999/printFile',
                    params: {
                        fileName: this.$root.randomCode,
                        randomCode: this.$root.randomCode,
                        printMode: this.$route.params.printMode,
                    }
                }).then((response) => {
                    let responseData = response.data;
                    if (responseData.state == "SUCCESS") {
                        let estimatedTime = parseInt(responseData.msg)
                        this.state = "正在打印";
                        let i = 0;
                        this.processCountdownClock = window.setInterval(() => {
                            i += 0.1;
                            this.pseudoProgress=Math.floor((-100/Math.pow(estimatedTime,2))*Math.pow(i,2)+(200/estimatedTime)*i);
                            if(this.pseudoProgress==100.0){
                                this.state = "打印已经结束";
                                this.finishPrint();
                            }
                        }, 100);
                    }else {
                        this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, responseData.msg, responseData.code, responseData.state);
                    }
                }).catch((reason) => {
                    this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, reason.toString());
                });
            },
            printerStatusMonitor() {
                axios({
                    method: 'get',
                    url: 'http://localhost:8999/PrinterStatusMonitor',
                    params: {
                        randomCode: this.$root.randomCode,
                    }
                }).then((response) => {
                    let responseData = response.data;
                    if (responseData.state == "SUCCESS") {
                        this.printSuccessModel=true;
                        this.$refs.countdown.countDownStart(10,"/",false);
                    } else {
                        this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, responseData.msg, responseData.code, responseData.state,true);
                        this.state = "打印异常终止";
                    }
                }).catch((reason) => {
                    this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, reason.toString());
                });
            },
            finishPrint() {
                clearInterval(this.processCountdownClock);
                axios({
                    method: 'get',
                    url: 'http://localhost:8999/finishPrint',
                }).then((response) => {
                    let responseData = response.data;
                    if (responseData.state == "SUCCESS") {

                    }else {
                        this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, responseData.msg, responseData.code, responseData.state,true);
                    }
                }).catch((reason) => {
                    this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, reason.toString());
                });
            }
        },
    }
</script>