<style scoped>

    * {
        font-family: "PingFang SC Semibold";
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
                <Steps :current="0" v-if="type=='scan'">
                    <Step title="进行中" content="扫描文件"></Step>
                    <Step title="待进行" content="下载文件至设备或打印"></Step>
                </Steps>
                <Steps :current="0" v-else>
                    <Step title="进行中" content="扫描文件"></Step>
                    <Step title="待进行" content="调整打印设置"></Step>
                    <Step title="待进行" content="选择打印方式"></Step>
                    <Step title="待进行" content="设备打印"></Step>
                </Steps>
            </Header>
            <Content style="height: 100%;padding: 2%" :style="this.$root.background">
                <v-exception ref="exceptionModel"></v-exception>
                <v-preProcessModel ref="preProcessModel"></v-preProcessModel>
                <Modal v-model="scanFinalModel" width="800px" :closable="false" :mask-closable="false">
                    <p slot="header" style="color:#19be6b;text-align:center">
                        <Icon type="ios-information-circle"></Icon>
                        <span>成功</span>
                    </p>
                    <div style="text-align:center">
                        <p style="text-align:center;font-size: 18px;margin-bottom: 10px">{{finishRemark}}</p>
                        <p style="text-align:center;font-size: 14px;margin-bottom: 10px">请勿忘记您的U盘、背包或其他个人物品，感谢为您服务，下次再见！</p>
                        <img src="../images/scanner-success.png" width="200" style="margin: 30px">
                    </div>
                    <div slot="footer">
                        <p style="text-align:center;font-size: 14px;margin-bottom: 10px">我们将在 {{this.$root.countdownReturnTime}} s后返回开始页面</p>
                    </div>
                </Modal>
                <Modal v-model="usbCopyMode" width="800px" :closable="false" :mask-closable="false">
                    <p slot="header" style="color:#19be6b;text-align:center">
                        <Icon type="ios-information-circle"></Icon>
                        <span>USB设备传输</span>
                    </p>
                    <div style="text-align:center">
                        <img src="../images/U3.gif" height="150px">
                            <div>请插入您的U盘，设备将自动拷贝文件至您的USB设备</div>
                        <h3>{{usbCopyState}}</h3>
                    </div>
                    <div slot="footer">
                        <Button type="warning" style="font-size:16px;" v-on:click="cancelListenUSBInsertion()">
                            <Icon type="md-exit"/>
                            回退
                        </Button>
                        <v-countdownButton ref="countdown"></v-countdownButton>
                    </div>
                </Modal>
                <Modal v-model="qrCodeMode" width="800px" :closable="false" :mask-closable="false">
                    <p slot="header" style="color:#19be6b;text-align:center">
                        <Icon type="ios-information-circle"></Icon>
                        <span>扫描“码上”下</span>
                    </p>
                    <div style="text-align:center">
                        <img ref="QRCodeImg" height="150px">
                    <Spin fix v-if="loading_QR">
                        <Icon type="ios-loading" size=50 class="spin-icon-load"></Icon>
                        <div>上传扫描文件中</div>
                        <div>服务器在二维码生成后10分钟后将删除文件，请尽快取回。</div>
                    </Spin>
                        <h3>请扫描二维码下载您的扫描文件图片,服务器在二维码生成后10分钟后将删除文件，请尽快取回!</h3>
                    </div>
                    <div slot="footer">
                        <Button type="success" style="font-size:16px;" v-on:click="finalSuccess()">
                            <Icon type="md-exit"/>
                            完成
                        </Button>
                    </div>
                </Modal>
                <Modal v-model="scanFinishModel" width="800px" :closable="false" :mask-closable="false">
                    <p slot="header" style="color:#19be6b;text-align:center">
                        <Icon type="ios-information-circle"></Icon>
                        <span>扫描结束</span>
                    </p>
                    <div style="text-align:center">
                        <p style="text-align:center;font-size: 18px;margin-bottom: 10px">请选择扫描文件下载方式</p>
                        <Row style="margin-top: 3%">
                            <Col span="8">
                                <Card v-on:click.native="doUploadCopyFile()" style="margin-bottom:5px;">
                                    <div style="text-align:center">
                                        <img src="../images/scan_upload.png" height="90">
                                        <h3>“码”上下载</h3>
                                        <h4>QR Code Download</h4>
                                    </div>
                                </Card>
                            </Col>
                            <Col span="8">
                                <Card v-on:click.native="startUSBListening()" style="margin-bottom:5px;">
                                    <div style="text-align:center">
                                        <img src="../images/scan_usb.png" height="90">
                                        <h3>U盘拷贝</h3>
                                        <h4>USB Device Copy</h4>
                                    </div>
                                </Card>
                            </Col>
                            <Col span="8">
                                <Card v-on:click.native="finishScan('copy')" style="margin-bottom:5px;">
                                    <div style="text-align:center">
                                        <img src="../images/scan_copy.png" height="90">
                                        <h3>复印</h3>
                                        <h4>Copy</h4>
                                    </div>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                    <div slot="footer">
                        <v-countdownButton ref="countdown"></v-countdownButton>
                    </div>
                </Modal>
                <Modal v-model="scanSuccessModel" width="800px" :closable="false" :mask-closable="false">
                    <p slot="header" style="color:#19be6b;text-align:center">
                        <Icon type="ios-information-circle"></Icon>
                        <span>成功</span>
                    </p>
                    <div style="text-align:center">
                        <p style="text-align:center;font-size: 18px;margin-bottom: 10px">扫描任务已经顺利完成</p>
                        <p style="text-align:center;font-size: 14px;margin-bottom: 10px">
                            若您需要继续扫描，请装入文件并点击继续扫描，否则请点击我已完成扫描。</p>
                        <img src="../images/scanner-success.png" width="200" style="margin: 30px">
                    </div>
                    <div slot="footer">
                        <Button type="success" style="font-size:16px" v-on:click="doScan()" size="large">
                            <Icon type="ios-paper"/>
                            继续扫描
                        </Button>
                        <Button type="success" style="font-size:16px" v-on:click="finishScan()" size="large">
                            <Icon type="ios-paper"/>
                            我已完成扫描
                        </Button>
                        <v-countdownButton ref="countdown"></v-countdownButton>
                    </div>
                </Modal>
                <Modal v-model="scanStartModel" width="800px" :closable="false" :mask-closable="false"
                       v-on:click.native="countdownReset()">
                    <p slot="header" style="color:#2d8cf0;text-align:center">
                        <Icon type="ios-information-circle"></Icon>
                        <span>装入扫描文件并开始扫描</span>
                    </p>
                    <div style="text-align:center">
                        <p style="text-align:center;font-size: 18px;margin-bottom: 10px">请准备并装入需要扫描或复印的文件</p>
                        <p style="text-align:center;font-size: 14px;margin-bottom: 10px">
                            请将需扫描的文稿按图示放入ADF自动进稿器（左图）或平板扫描器（右图），并确认位置正确。<br/>
                            书本等已经装订的材料禁止使用ADF，请根据文档辅助线将原稿正面向下放在平板扫描器的左上角。</p>
                        <img src="../images/scanner.png" width="600" style="margin: 10px">
                    </div>
                    <div slot="footer">
                        <Button type="success" style="font-size:16px" v-on:click="doScan()" size="large">
                            <Icon type="ios-paper"/>
                            初始化设备并开始扫描
                        </Button>
                        <v-countdownButton ref="countdown"></v-countdownButton>
                    </div>
                </Modal>
                <Row>
                    <p style="text-align:center;font-size: 18px;color: #000000;">MOTA校园 · 免费自助打印设备</p>
                    <p style="text-align:center;font-size: 40px;margin-top:5px;color: #000000;">设备扫描中，请稍后……</p>
                </Row>
                <Row style="height:80%;" type="flex" justify="center">
                    <Col span="18" style="align-items:center;display:flex;flex-direction:column;justify-content:center">
                        <img src="../images/scanner-default.svg" width="100" style="margin: 30px">
                        <p style="font-size: 16px">海内存知己，天涯若比邻</p>
                        <p style="font-size: 32px">我们将很快完成</p>
                        <br/>
                        <Progress :percent="pseudoProgress" status="active"/>
                        <p style="font-size: 12px">(进度条指示为预估的扫描时间，可能与实际时间不符，以实际完成进度为准)</p>
                        <p style="font-size: 18px;margin-top:10px">{{state}}</p>
                    </Col>
                </Row>
            </Content>
            <Footer><p class="layout-footer-center">2018-2019 &copy; Oriole Software MOTA 长沙点墨文化传媒有限公司</p></Footer>
        </Layout>
    </div>
</template>
<script>
    import * as axios from "axios";
    import ExceptionModel from '../components/ExceptionModel.vue';
    import CountdownButton from '../components/CountdownButton.vue';
    import PreProcessModel from  '../components/PreProcessModel.vue';

    export default {
        components:{
            'v-exception':ExceptionModel,
            'v-countdownButton':CountdownButton,
            'v-preProcessModel':PreProcessModel,
        },
        data() {
            return {
                processCountdownClock:0,
                state: "正在初始化设备",
                scanStartModel: false,
                scanSuccessModel: false,
                type: this.$route.params.type,
                estimatedTime: 18,
                pseudoProgress: 0,
                serialNumber: 1,
                scanFinishModel: false,
                scanFinalModel:false,
                qrCodeUrl: null,
                qrCodeMode:false,
                loading_QR:false,
                usbCopyMode:false,
                finishRemark:"扫描任务已经全部完成",
                usbCopyState:"等待USB插入中……",
                usbListeningSource:{}
            }
        },
        mounted() {
            this.scanStartModel = true;
            this.$refs.countdown.countDownStart(300);
        },
        methods: {
            countdownReset() {
                this.$refs.countdown.countdownReset(300);
            },
            showScanSuccessPage() {
                this.scanSuccessModel = true;
                this.$refs.countdown.countDownStart(300);
            },
            finishScan(type = this.type) {
                if (type=="scan") {
                    this.$refs.countdown.countDownStart(300);
                    this.scanSuccessModel = false;
                    this.scanFinishModel = true;
                } else {
                    this.closeAllModel();
                    this.$refs.preProcessModel.copyFileProcessing(this,this.serialNumber - 1);
                }
            },
            doScan() {
                clearInterval(this.$root.countdownClock);
                this.scanStartModel = false;
                this.scanSuccessModel = false;
                this.state = "正在扫描";
                let i = 0;
                this.processCountdownClock = window.setInterval(() => {
                    i += 0.1;
                    this.pseudoProgress = Math.floor((-100 / Math.pow(this.estimatedTime, 2)) * Math.pow(i, 2) + (200 / this.estimatedTime) * i);
                    if (this.pseudoProgress < 100.0 & this.pseudoProgress > 95.0) {
                        clearInterval(this.processCountdownClock);
                    }
                }, 100);
                axios({
                    method: 'get',
                    url: 'http://localhost:8999/runningScanner',
                    params: {
                        randomCode: this.$root.randomCode,
                        serialNumber: this.serialNumber,
                    }
                }).then((response) => {
                    let responseData = response.data;
                    clearInterval(this.processCountdownClock);
                    if (responseData.state == "SUCCESS") {
                        this.state = "扫描已经结束";
                        this.serialNumber += 1;
                        this.pseudoProgress = 100;
                        this.showScanSuccessPage();
                    } else {
                        this.state = "扫描已经终止";
                        this.pseudoProgress = 0;
                        this.closeAllModel();
                        this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, responseData.msg, responseData.code, responseData.state);
                    }
                }).catch((reason) => {
                    this.closeAllModel();
                    this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode,reason.toString());
                });
            },
            doUploadCopyFile() {
                this.countdownReset();
                this.scanFinishModel = false;
                this.qrCodeMode = true;
                this.loading_QR=true;
                axios({
                    method: 'get',
                    url: 'http://localhost:8999/uploadCopyFileToServer',
                    params: {
                        totalPage: this.serialNumber - 1,
                        randomCode: this.$root.randomCode,
                    }
                }).then((response) => {
                    let responseData = response.data;
                    if (responseData.state == "SUCCESS") {
                        this.getQRCodePic(responseData.msg);
                    }else {
                        this.closeAllModel();
                        this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, responseData.msg, responseData.code, responseData.state);
                    }
                }).catch((reason) => {
                    this.closeAllModel();
                    this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode,reason.toString());
                });
            },
            startUSBListening(){
                this.countdownReset();
                this.scanFinishModel = false;
                this.usbCopyMode=true;
                this.usbListeningSource = this.axios.CancelToken.source();
                axios({
                    method: 'get',
                    url: 'http://localhost:8999/listenUSBInsertion',
                    cancelToken: this.usbListeningSource.token,
                }).then((response) => {
                    let responseData = response.data;
                    if (responseData.state == "SUCCESS") {
                        //USB设备成功接入
                        console.log("UBS Device Connection Successful");
                        this.usbCopyState="USB设备已识别，文件拷贝中……"
                        axios({
                            method: 'get',
                            url: 'http://localhost:8999/copyFileToUSB',
                            params: {
                                totalPage: this.serialNumber - 1,
                                randomCode: this.$root.randomCode,
                                fileCopyPath: JSON.parse(responseData.msg)[0]+"MotaScanFile/",
                            }
                        }).then((response) => {
                            let responseData = response.data;
                            if (responseData.state == "SUCCESS") {
                                this.finishRemark="文件已拷贝至USB设备/MotaScanFile文件夹中";
                                this.finalSuccess();
                            }else {
                                this.closeAllModel();
                                this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, responseData.msg, responseData.code, responseData.state);
                            }
                        }).catch((reason) => {
                            this.closeAllModel();
                            this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode,reason.toString());
                        });
                    }
                }).catch((reason) => {
                    if(reason.message!='Stop') {
                        this.closeAllModel();
                        this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, reason.toString());
                    }
                });
            },
            cancelListenUSBInsertion(){
                this.usbCopyMode=false;
                this.scanFinishModel=true;
                this.usbListeningSource.cancel('Stop');
            },
            getQRCodePic(qrCodeUrl) {
                console.log(qrCodeUrl);
                //[控制端指令]请求服务器端二维码
                axios({
                    method: 'get',
                    url: qrCodeUrl,
                    responseType: 'arraybuffer',
                }).then(response => {
                    //获得二维码后关闭二维码加载对话框（LOADING)
                    this.loading_QR=false;
                    //并对获得数据进行处理以显示
                    return 'data:image/png;base64,' +btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
                }).then(data=>{
                    //将图像数据加载到图片占位
                    this.$refs.QRCodeImg.src=data;
                }).catch((reason) => {
                    this.closeAllModel();
                    this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode,reason.toString());
                });
            },
            finalSuccess(){
                this.scanFinalModel=true;
                this.qrCodeMode=false;
                this.usbCopyMode=false;
                this.countdownReturnTime=20;
                this.$refs.countdown.countDownStart(10,"/",false);
            },
            closeAllModel(){
                this.scanStartModel=false;
                this.scanSuccessModel=false;
                this.scanFinishModel=false;
                this.scanFinalModel=false;
                this.qrCodeMode=false;
                this.usbCopyMode=false;
            },
        }
    }
</script>