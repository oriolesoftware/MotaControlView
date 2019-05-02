<style scoped>
    * {
        font-family: "站酷小薇LOGO体";
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
        <Layout class="layout" v-on:click.native="countdownReset()">
            <Header style="padding: 20px">
                <Steps :current="3">
                    <Step title="已完成" content="上传文件或插入U盘"></Step>
                    <Step title="已完成" content="选择需要打印的文件"></Step>
                    <Step title="已完成" content="调整打印设置"></Step>
                    <Step title="进行中" content="选择打印方式"></Step>
                    <Step title="待进行" content="设备打印"></Step>
                </Steps>
            </Header>
            <Content style="height: 100%;padding: 2%" :style="background">
                <Modal v-model="freePrintModel" width="800px">
                    <p slot="header" style="color:#f60;text-align:center">
                        <Icon type="ios-information-circle"></Icon>
                        <span>模式选择确认</span>
                    </p>
                    <div style="text-align:center">
                        <p style="text-align:center;font-size: 18px;margin-bottom: 10px">页边距广告免费打印模式 · AD Free Mode</p>
                        <Row style="height:80%;" type="flex" justify="center">
                            <Col span="8"
                                 style="align-items:center;display:flex;flex-direction:column;justify-content:center">
                                <img src="../images/ADPrinting.png" height="150" padding="10px">
                            </Col>
                            <Col span="16"
                                 style="display:flex;flex-direction:column;justify-content:center;font-size: 14px">
                                <p style="text-align:left;color:#f60;">助力环保 公益打印</p>
                                <p style="text-align:left">
                                    您选择的模式为
                                    <span style="color:#2b85e4">免费打印</span>
                                    ，此模式下墨拓将采用
                                    <span style="color:#2b85e4">墨水环保模式[中等质量]</span>
                                    为您进行资料打印。注意，墨拓将仅在
                                    <span style="color:#2b85e4">不覆盖页面内容的页边距位置</span>
                                    处进行广告\宣传物料投放。墨拓承诺，每笔打印业务所产生效益，将向公益组织捐献
                                    <span style="color:#2b85e4">15%</span>
                                    用于留守儿童关爱、乡村知识扶贫、重症儿童救助等方面。同时，墨拓将以不低于
                                    <span style="color:#2b85e4">30%</span>
                                    的比例投放免费纯公益性广告、宣传视频等内容。
                                </p>
                                <p style="text-align: left;font-size: 10px ;margin-top: 10px">
                                    墨拓对通过自助设备投放广告的商家已尽到包括资质审查、广告真实性核验在内的必要保真义务，但对于任何包含于、经由或从任何与墨拓有关服务所获得的信息、内容或广告，不声明或保证其正确性或可靠性。您于此接受并承认信赖任何信息、内容或广告所发生的风险都应自行承担，对于因此所生的任何直接、间接、附带的或因此而导致的衍生性损失概不负责。
                                </p>
                            </Col>
                        </Row>
                    </div>
                    <div slot="footer">
                        <Button type="success" size="large" :loading="printLoading" @click="freePrintConfirm">确认
                        </Button>
                        <Button type="warning" size="large">取消</Button>
                    </div>
                </Modal>
                <Row>
                    <p style="text-align:center;font-size: 18px;">MOTA校园 · 免费自助打印设备</p>
                    <p style="text-align:center;font-size: 40px;">请选择所需打印服务类型</p>
                </Row>
                <Row style="height:80%;" type="flex" justify="center">
                    <Col span="10" v-on:click.native="freePrint()"
                         style="align-items:center;display:flex;flex-direction:column;justify-content:center">
                        <img src="../images/ADPrinting.png" height="300">
                        <h1>免费打印</h1>
                        <h2>中等质量</h2>
                        <h4>（页边距含不遮挡页面内容的广告）</h4>
                    </Col>
                    <Col span="10" style="align-items:center;display:flex;flex-direction:column;justify-content:center">
                        <img src="../images/HQPrinting.png" height="300">
                        <h1>0.1 元/张</h1>
                        <h2>最高质量</h2>
                        <h4>（不含任何类型广告）</h4>
                    </Col>
                </Row>
            </Content>
            <Footer><p class="layout-footer-center">&copy; Copyright 2018-2019 Oriole(MOTA). All Rights Reserved.</p>
                <Button type="error" style="font-size:16px;position: absolute; right: 10px; bottom:10px;" v-on:click="countdownDo()">
                    <Icon type="md-exit" /> 退出
                    <span style="color: #FA8072">[{{countdownReturnTime}} 秒]</span>
                </Button>
            </Footer>
        </Layout>
    </div>
</template>
<script>
    import * as axios from "axios";

    export default {
        data() {
            return {
                /*
                * 倒计时相关
                */
                /*默认倒计时时间*/
                countdownReturnTime:300,
                /*倒计时ClockID*/
                countdownClock:0,
                freePrintModel: false,
                printLoading: false,
                background: {
                    backgroundImage: "url(" + require("../images/background.svg") + ")",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                },
            }
        },
        methods: {
            countDownStart() {
                this.countdownClock = window.setInterval(() => {
                    this.countdownReturnTime--;
                    if(this.countdownReturnTime<0){
                        this.countdownDo();
                    }
                },1000)
            },
            countdownDo(){
                clearInterval(this.countdownClock);
                this.$router.push("/");
            },
            countdownReset(){
                this.countdownReturnTime=300;
            },
            freePrint() {
                this.freePrintModel = true;
            },
            freePrintConfirm() {
                this.printLoading = true;
                axios({
                    method: 'get',
                    url: 'http://localhost:8999/adAdd',
                    params: {
                        fileName: this.$root.randomCode,
                        direction: this.$route.params.direction,
                    }
                }).then((response) => {
                    let responsedata = response.data;
                    if (responsedata.state == "SUCCESS") {
                        this.printLoading = false;
                        this.freePrintModel = false;
                        this.$Message.success('开始打印');
                        clearInterval(this.countdownClock);
                        this.$router.push({
                            name: 'Print',
                        });
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            }
        },
    }
</script>