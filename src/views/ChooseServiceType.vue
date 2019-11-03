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
            <Content style="height: 100%;padding: 2%" :style="this.$root.background">
                <v-exception ref="exceptionModel"></v-exception>
                <Modal v-model="freePrintModel" width="800px">
                    <p slot="header" style="color:#2b85e4;text-align:center">
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
                        <Button type="warning" size="large" @click="closeAllModel">取消</Button>
                    </div>
                </Modal>
                <Modal v-model="payPrintModel" width="800px">
                    <p slot="header" style="color:#2b85e4;text-align:center">
                        <Icon type="ios-information-circle"></Icon>
                        <span>模式选择确认</span>
                    </p>
                    <div style="text-align:center">
                        <p style="text-align:center;font-size: 18px;margin-bottom: 10px">高质量付费打印模式 · High Quality
                            Mode</p>
                        <Row style="height:80%;" type="flex" justify="center">
                            <Col span="8"
                                 style="align-items:center;display:flex;flex-direction:column;justify-content:center">
                                <img ref="QRCodeImg" height="150px">
                                <img src="../images/pay.png" width="150" padding="10px">
                                <p style="color:#2b85e4">请使用微信扫描左上方维码进行支付</p>
                            </Col>
                            <Col span="16"
                                 style="display:flex;flex-direction:column;justify-content:center;font-size: 14px">
                                <p style="text-align:left;color:#f60;">超低价格 助力好成绩</p>
                                <p style="text-align:left">
                                    您选择的模式为
                                    <span style="color:#2b85e4">高质量付费打印</span>
                                    ，此模式下墨拓将采用
                                    <span style="color:#2b85e4">高质量模式[高等质量]</span>
                                    为您进行资料打印。
                                </p>
                                <p style="text-align: center;font-size: 40px ;margin-top: 25px">
                                    <span style="color:#2b85e4;font-size: 15px">您应支付</span>
                                    {{count}} x 0.10￥ = {{(count*0.1).toFixed(2)}}￥
                                    <span style="color:#2b85e4;font-size: 15px">打印费用</span>
                                </p>
                            </Col>
                            <Spin fix v-if="loading_QR">
                                <Icon type="ios-loading" size=50 class="spin-icon-load"></Icon>
                                <div>正在计算打印费用中</div>
                                <div>网络可能存在延迟，请稍等</div>
                            </Spin>
                        </Row>
                    </div>
                    <div slot="footer">
                        <Button type="success" size="large" @click="cardPrint()" icon="md-card">
                            兑换码/月卡支付
                        </Button>
                        <Button type="success" size="large" :loading="printLoading" @click="payPrintConfirm">我已完成支付
                        </Button>
                        <Button type="warning" size="large" @click="closeAllModel">取消</Button>
                    </div>
                </Modal>
                <Modal v-model="redeemCodePayModel" width="720px">
                    <p slot="header" style="color:#2b85e4;text-align:center">
                        <Icon type="ios-information-circle"></Icon>
                        <span>打印卡 免费高质量打印</span>
                    </p>
                    <div style="display: flex;align-items:center;flex-direction:column">
                        <img src="../images/discount_coupon.png" width="80">
                        <p style="text-align:center;font-size: 18px;margin-top: 10px">请输入您卡片的兑换CDKEY</p>
                        <p style="margin-bottom: 10px">本卡为计页付费类型卡，剩余张数不足时不可打印，请在输入兑换码后点击核对按钮进行查询核对。</p>
                        <Input v-model="redeemCode" size="large" placeholder="请输入十位兑换码"
                               style="width: 300px;">
                            <Button slot="append" icon="ios-search" @click="checkCardVaild">核对</Button>
                        </Input>
                        <p style="margin: 10px;color: #2b85e4">{{cardInfo}}</p>
                        <v-keyboard v-on:updatekey="getRedeemCode"></v-keyboard>
                    </div>
                    <div slot="footer">
                        <Button type="success" size="large" :loading="printLoading" @click="cardPrintConfirm">确认
                        </Button>
                        <Button type="warning" size="large" @click="closeAllModel">取消</Button>
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
                    <Col span="10" v-on:click.native="payPrint()"
                         style="align-items:center;display:flex;flex-direction:column;justify-content:center">
                        <img src="../images/HQPrinting.png" height="300">
                        <h1>0.1 元/张</h1>
                        <h2>最高质量</h2>
                        <h4>（不含任何类型广告）</h4>
                    </Col>
                </Row>
            </Content>
            <Footer><p class="layout-footer-center">&copy; Copyright 2018-2019 Oriole(MOTA). All Rights Reserved.</p>
                <v-countdownButton ref="countdown"
                                   style="position: absolute; right: 10px; bottom:10px;"></v-countdownButton>
            </Footer>
        </Layout>
    </div>
</template>
<script>
    import * as axios from "axios";
    import ExceptionModel from '../components/ExceptionModel.vue';
    import CountdownButton from '../components/CountdownButton.vue';
    import Keyboard from '../components/Keyboard.vue'

    export default {
        components: {
            'v-exception': ExceptionModel,
            'v-countdownButton': CountdownButton,
            'v-keyboard': Keyboard,
        },
        data() {
            return {
                freePrintModel: false,
                payPrintModel: false,
                redeemCodePayModel: false,
                printLoading: false,
                loading_QR: false,
                defeatNum: 0,
                count: 0,
                initPayInfo: true,
                redeemCode: "",
                cardInfo:"",
            }
        },
        methods: {
            countdownReset() {
                this.$refs.countdown.countdownReset(300);
            },
            freePrint() {
                this.freePrintModel = true;
            },
            cardPrint(){
                this.redeemCodePayModel=true;
            },
            payPrint() {
                this.payPrintModel = true;
                if (this.initPayInfo) {
                    console.log("initQRCode");
                    this.initPayInfo = false;
                    this.getCount();
                    this.initWebSocket();
                }
            },
            closeAllModel(){
                this.freePrintModel=false;
                this.payPrintModel= false;
                this.redeemCodePayModel= false;
            },
            freePrintConfirm() {
                this.printLoading = true;
                axios({
                    method: 'get',
                    url: 'http://localhost:8999/adAdd',
                    params: {
                        fileName: this.$root.randomCode,
                        multiPageOrientation: this.$route.params.direction,
                        randomCode: this.$root.randomCode,
                    }
                }).then((response) => {
                    let responseData = response.data;
                    if (responseData.state == "SUCCESS") {
                        this.printLoading = false;
                        this.freePrintModel = false;
                        this.$Message.success('开始打印');
                        this.$router.push({
                            name: 'Print',
                            params: {
                                printMode: 1,
                            }
                        });
                    } else {
                        this.closeAllModel();
                        this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, responseData.msg, responseData.code, responseData.state);
                    }
                }).catch((reason) => {
                    this.closeAllModel();
                    this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, reason.toString());
                });
            },
            cardPrintConfirm() {
                axios({
                    method: 'get',
                    url: this.$root.serverUrl+'pay/setCardResidueDegree',
                    params: {
                        cdkey: this.redeemCode,
                        count: this.count,
                    }
                }).then((response) => {
                    let responseData = response.data;
                    if (responseData.state == "SUCCESS") {
                        this.printLoading = false;
                        this.freePrintModel = false;
                        this.$Message.success('开始打印');
                        this.$router.push({
                            name: 'Print',
                            params: {
                                printMode: 3,
                            }
                        });
                    } else {
                        this.$Modal.confirm({
                            title: '支付未成功',
                            content: '您的卡片已经失效或余额不足，如有疑问请联系墨拓官方处理。',
                            okText: '确认',
                            onOk: () => {
                                this.$Modal.remove();
                            },
                        });
                    }
                }).catch((reason) => {
                    this.closeAllModel();
                    this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, reason.toString());
                });
            },
            payPrintConfirm() {
                this.printLoading = true;
                axios({
                    method: 'get',
                    url: this.$root.serverUrl+'pay/checkPrinterOrderState',
                    params: {
                        deviceID: this.$root.deviceID,
                        randomCode: this.$root.randomCode,
                    }
                }).then((response) => {
                    let responseData = response.data;
                    if (responseData.state == "SUCCESS") {
                        this.printLoading = false;
                        this.freePrintModel = false;
                        this.$Message.success('开始打印');
                        this.$router.push({
                            name: 'Print',
                            params: {
                                printMode: 2,
                            }
                        });
                    } else {
                        this.$Modal.confirm({
                            title: '支付未成功',
                            content: '若您确认已经完成支付，请拍摄用户唯一编码' + this.$root.randomCode + '至微信公众号办理自助退款手续，给您带来不便我们深表歉意。',
                            okText: '确认',
                            onOk: () => {
                                this.$Modal.remove();
                            },
                        });
                        this.printLoading = false;
                    }
                }).catch((reason) => {
                    this.closeAllModel();
                    this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, reason.toString());
                });
            },
            getCount() {
                this.loading_QR = true;
                axios({
                    method: 'get',
                    url: 'http://localhost:8999/getPaperConsumedNum',
                    params: {
                        fileName: this.$root.randomCode,
                    }
                }).then(response => {
                    let responseData = response.data;
                    if (responseData.state == "SUCCESS") {
                        this.count = responseData.msg
                        this.getQRCodePic();
                    } else {
                        this.closeAllModel();
                        this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, responseData.msg, responseData.code, responseData.state);
                    }
                }).catch((reason) => {
                    this.closeAllModel();
                    this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, reason.toString());
                });
            },
            getQRCodePic() {
                //[控制端指令]请求服务器端二维码
                axios({
                    method: 'get',
                    url: this.$root.serverUrl+'pay/newPrinterOrder',
                    responseType: 'arraybuffer',
                    params: {
                        count: this.count,
                        deviceID: this.$root.deviceID,
                        randomCode: this.$root.randomCode,
                    }
                }).then(response => {
                    //获得二维码后关闭二维码加载对话框（LOADING)
                    this.loading_QR = false;
                    //并对获得数据进行处理以显示
                    return 'data:image/png;base64,' + btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
                }).then(data => {
                    //将图像数据加载到图片占位
                    this.$refs.QRCodeImg.src = data;
                    this.loading_QR = false;
                }).catch((reason) => {
                    this.closeAllModel();
                    this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, reason.toString());
                });
            },
            checkCardVaild(){
                axios({
                    method: 'get',
                    url: this.$root.serverUrl+'pay/getCardInfoByCDKey',
                    params: {
                        cdkey: this.redeemCode,
                    }
                }).then(response => {
                    let responseData = response.data;
                    if (responseData.state == "SUCCESS") {
                        let isValid=(responseData.msg.isValid==1)?"有效":"失效"
                        this.cardInfo = "券类型：计次消费 剩余打印数量："+responseData.msg.residueDegree+" 有效期至："+responseData.msg.failureTime+" 当前状态："+isValid;

                    } else {
                        this.cardInfo = "CDKEY不存在，请检查您的输入";
                    }
                }).catch((reason) => {
                    this.closeAllModel();
                    this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, reason.toString());
                });
            },
            getRedeemCode(val) {
                this.redeemCode = val;
            },
            initWebSocket() { //初始化weosocket
                const url = this.$root.websocketUrl+'webSocket/' + this.$root.randomCode;
                this.websock = new WebSocket(url);
                this.websock.onmessage = this.websocketOnMessage;
                this.websock.onopen = this.websocketOnOpen;
                this.websock.onerror = this.websocketOnError;
                this.websock.onclose = this.websocketClose;
            },
            websocketOnOpen() {
                console.log("Successful establishment of WebSocket connection");
            },
            websocketOnError(e) {//连接建立失败重连并返回
                this.defeatNum++;
                console.log("Failure to establish WebSocket connection,The reasons for the error are as follows:");
                console.log(e);
                if (this.defeatNum < 6) {
                    var that = this;
                    if (e.type == "error") {
                        this.$Notice.error({
                            title: '与服务器建立WEBSOCKET通讯失败',
                            desc: '服务器未能响应请求，正在尝试重新连接 (第 ' + this.defeatNum + ' 次 / 共 5 次)，若依然失败，请联系MOTA官方 133-0535-6699 尝试解决此问题！',
                        });
                    }
                    setTimeout(function () {
                        that.initWebSocket()
                    }, 5 * 1000);
                } else {
                    this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, "Error: WebSocket连接没有正确建立");
                }
            },
            websocketOnMessage(sendback) {//接收到服务器消息后
                var data = JSON.parse(sendback.data);
                if (data.state == 'SUCCESS'&&data.code=='1') {
                    this.printLoading = false;
                    this.freePrintModel = false;
                    this.$Message.success('开始打印');
                    this.$router.push({
                        name: 'Print',
                        params: {
                            printMode: 2,
                        }
                    });
                }
            },
            websocketSend(data) {//数据发送
                this.websock.send(data)
            },
            websocketClose(e) {  //关闭
                this.websock.close()
                console.log('WebSocket Connection Disconnected', e)
            },
        },
    }
</script>