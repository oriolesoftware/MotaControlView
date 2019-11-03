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
                <Steps :current="0">
                    <Step title="进行中" content="上传文件或插入U盘"></Step>
                    <Step title="待进行" content="选择需要打印的文件"></Step>
                    <Step title="待进行" content="调整打印设置"></Step>
                    <Step title="待进行" content="选择打印方式"></Step>
                    <Step title="待进行" content="设备打印"></Step>
                </Steps>
            </Header>
            <Content style="height: 100%;padding: 2%" :style="this.$root.background">
                <v-exception ref="exceptionModel"></v-exception>
                <v-preProcessModel ref="preProcessModel"></v-preProcessModel>
                <Modal v-model="downloading" width="360" :closable="false" :mask-closable="false">
                    <p slot="header" style="color:#f60;text-align:center">
                        <Icon type="md-checkmark-circle-outline"/>
                        <span>用户已上传文件</span>
                    </p>
                    <div style="text-align:center">
                        <Spin>
                            <Icon type="ios-loading" size=35 class="spin-icon-load" style="margin:10px"></Icon>
                            <div>正在等待终端接收文件</div>
                        </Spin>
                    </div>
                    <div slot="footer" style="text-align: left;">
                        <p>违反国家规定，出版、印刷、复制、发行非法出版物，所涉刑事与民事责任由内容提供者自行承担！为配合调查，墨拓将在公安机关介入时提供相关资料，请自重。</p>
                    </div>
                </Modal>
                <Row>
                    <p style="text-align:center;font-size: 18px;color: #000000;">MOTA校园 · 免费自助打印设备</p>
                    <p style="text-align:center;font-size: 40px;color: #000000;">请扫描二维码或插入USB存储设备</p>
                </Row>
                <Row style="height:80%;" type="flex" justify="center">
                    <Col span="3">
                    </Col>
                    <Col span="9"
                         style="height:100%;align-items:center;display:flex;flex-direction:column;justify-content:center">
                        <Card dis-hover style="text-align: center;width: 80%;margin: 5%">
                            <p slot="title">文件“码上”传</p>
                            <p>用户识别ID {{this.$root.randomCode}}</p>
                            <div style="text-align:center">
                                <img ref="QRCodeImg" height="150px">
                                <h3>请使用 微信 或 QQ 扫描二维码上传文件</h3>
                            </div>
                            <p>您上传的文件将直接发送至终端，服务器不会保留您的文件</p>
                            <Spin fix v-if="loading_QR">
                                <Icon type="ios-loading" size=50 class="spin-icon-load"></Icon>
                                <div>加载二维码中</div>
                                <div>网络可能存在延迟，请稍等</div>
                            </Spin>
                            <Spin fix v-if="scanned_QR">
                                <Icon type="ios-loading" size=50 class="spin-icon-load"></Icon>
                                <div>已扫描二维码</div>
                                <div>请尽快上传您的文件</div>
                            </Spin>
                        </Card>
                    </Col>
                    <Col span="9"
                         style="height:100%;align-items:center;display:flex;flex-direction:column;justify-content:center">
                        <div style="text-align: center;width: 80%;margin: 5%">
                            <img src="../images/U3.gif" width="200px" style="margin: 5px"/>
                            <Spin style="margin: 10px" v-if="!scanned_QR">
                                <Icon type="ios-loading" size=35 class="spin-icon-load"></Icon>
                            </Spin>
                            <h2 v-if="scanned_QR" style="color: #2b85e4">已扫描二维码，不可再插入USB设备</h2>
                            <h2 v-else>请插入USB移动存储设备</h2>
                            <p style="font-size: 14px;">插入后系统将自动识别处理您的设备<br/><span style="color: #2b85e4">（手机、随身听、录音笔等移动存储设备不可识别，若USB设备已插入，请重新插拔设备！）</span></p>
                        </div>
                    </Col>
                    <Col span="3">
                    </Col>
                </Row>
            </Content>
            <Footer><p class="layout-footer-center">&copy; Copyright 2018-2019 Oriole(MOTA). All Rights Reserved.</p>
            <v-countdownButton ref="countdown" style="position: absolute; right: 10px; bottom:10px;"></v-countdownButton>
            </Footer>
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
                downloading: false,
                scanned_QR: false,
                loading_QR: true,
                defeatNum:0,
                uploadedFilePath: [],
                uploadedFileType: null,
                usbListeningSource:{},
            }
        },
        mounted() {
            this.$refs.countdown.countDownStart(60);
            this.initWebSocket();
            this.initListenUSBInsertion();
            this.getQRCodePic();
        },
        methods: {
            countdownReset(time="120"){
                this.$refs.countdown.countdownReset(time);
            },
            getQRCodePic() {
                //[控制端指令]请求服务器端二维码
                axios({
                    method: 'get',
                    url: this.$root.serverUrl+'file/getPrintFileUploadQRCode',
                    responseType: 'arraybuffer',
                    params: {
                        deviceID: this.$root.deviceID,
                        randomCode: this.$root.randomCode,
                    }
                }).then(response => {
                    //获得二维码后关闭二维码加载对话框（LOADING)
                    this.loading_QR=false;
                    //并对获得数据进行处理以显示
                    return 'data:image/png;base64,' +btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
                }).then(data=>{
                    //将图像数据加载到图片占位
                    this.$refs.QRCodeImg.src=data;
                }).catch((reason) => {
                    this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode,reason.toString());
                });
            },
            initListenUSBInsertion() {
                //[控制端指令]执行端开始监听USB设备接入
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
                        this.$router.push({
                            name: 'ChooseFile',
                            params: {
                                //转跳并传递参数设备路径参数
                                roots: JSON.parse(responseData.msg),
                            }
                        });
                    }
                }).catch((reason) => {
                    if(reason.message!='Stop') {
                        this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, reason.toString());
                    }else{

                    }
                });
            },
            cancelListenUSBInsertion(){
                this.usbListeningSource.cancel('Stop');
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
                if(this.defeatNum<6) {
                    var that=this;
                    if(e.type=="error") {
                        this.$Notice.error({
                            title: '与服务器建立WEBSOCKET通讯失败',
                            desc: '服务器未能响应请求，正在尝试重新连接 (第 '+this.defeatNum+' 次 / 共 5 次)，若依然失败，请联系MOTA官方 133-0535-6699 尝试解决此问题！',
                        });
                    }
                    setTimeout( function(){that.initWebSocket()}, 5 * 1000 );
                }else{
                    this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode,"Error: WebSocket连接没有正确建立");
                }
            },
            websocketOnMessage(sendback) {//接收到服务器消息后
                var responseData = JSON.parse(sendback.data);
                if (responseData.state == 'SUCCESS') {
                    if (responseData.code == "1"){
                        console.log("Successful Scanning QR Code");
                        //开启扫描二维码成功对话框（LOADING)，防止重复扫码
                        this.scanned_QR = true;
                        //关闭USB设备监听，防止用户同时插入USB
                        this.cancelListenUSBInsertion();
                        this.countdownReset(300);
                    } else if (responseData.code == "2") {
                        this.downloadFile(responseData);
                    }
                } else {
                    this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, responseData.msg, responseData.code, responseData.state);
                }
            },
            websocketSend(data) {//数据发送
                this.websock.send(data)
            },
            websocketClose(e) {  //关闭
                this.websock.close()
                console.log('WebSocket Connection Disconnected', e)
            },
            downloadFile(data){
                console.log("Successful Uploading File");
                //开启下载对话框（MODEL)
                this.downloading = true;
                //[控制端指令]执行端通过获得msg内文件名与RandomCode从服务器下载文件
                axios({
                    method: 'get',
                    url: 'http://localhost:8999/download',
                    params: {
                        fileName: data.msg,
                        randomCode: this.$root.randomCode,
                    }
                }).then((response) => {
                    let responseData = response.data;
                    if (responseData.state == "SUCCESS") {
                        //解析执行端返回JSON串以获取下载的文件路径与类型
                        let file = JSON.parse(responseData.msg);
                        //关闭下载对话框（MODEL)
                        this.downloading = false;
                        this.uploadedFilePath.push(file["filePath"]);
                        this.uploadedFileType=file["fileType"];
                        console.log("Successful Downloading File");
                        this.$refs.preProcessModel.fileProcessing(this,this.uploadedFilePath,this.uploadedFileType);
                    }else {
                        this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, responseData.msg, responseData.code, responseData.state);
                    }
                }).catch((reason) => {
                    this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode,reason.toString());
                });
            }
        }
    }
</script>