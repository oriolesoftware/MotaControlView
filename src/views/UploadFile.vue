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
                <Steps :current="0">
                    <Step title="进行中" content="上传文件或插入U盘"></Step>
                    <Step title="待进行" content="选择需要打印的文件"></Step>
                    <Step title="待进行" content="调整打印设置"></Step>
                    <Step title="待进行" content="选择打印方式"></Step>
                    <Step title="待进行" content="设备打印"></Step>
                </Steps>
            </Header>
            <Content style="height: 100%;padding: 2%" :style="background">
                <Modal v-model="downloading" width="360" :closable="false" :mask-closable="false">
                    <p slot="header" style="color:#f60;text-align:center">
                        <Icon type="md-checkmark-circle-outline"/>
                        <span>用户已上传文件</span>
                    </p>
                    <div style="text-align:center">
                        <Spin>
                            <Icon type="ios-loading" size=35 class="spin-icon-load"></Icon>
                            <div>正在等待终端接收文件</div>
                        </Spin>
                    </div>
                    <div slot="footer" style="text-align: left;">
                        <p>违反国家规定，出版、印刷、复制、发行非法出版物，所涉刑事与民事责任由内容提供者自行承担！为配合调查，墨拓将在公安机关介入时提供相关资料，请自重。</p>
                    </div>
                </Modal>
                <Modal v-model="fileProcessing" width="700" :closable="false" :mask-closable="false">
                    <p slot="header" style="color:#f60;text-align:center;font-size: 16px">
                        <Icon type="ios-information-circle"></Icon>
                        <span>正在处理中，请稍后</span>
                    </p>
                    <div style="text-align:center">
                        <iframe frameborder="0" scrolling="no" src="Loading" width="100%" height="150"></iframe>
                        <p style="font-size: 16px">海内存知己，天涯若比邻</p>
                        <p style="font-size: 32px">我们将很快完成</p>
                        <p style="font-size: 16px">为了确保文档格式与打印一致，小墨正在调用WPS Office2019处理相关文件</p>
                    </div>
                    <div slot="footer">
                        <img src="../images/WPS.svg" width="70px"/>
                        <p>金山办公软件提供技术支持</p>

                    </div>
                </Modal>
                <Row>
                    <p style="text-align:center;font-size: 18px;">MOTA校园 · 免费自助打印设备</p>
                    <p style="text-align:center;font-size: 40px;">请扫描二维码或插入USB存储设备</p>
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
                            <Spin style="margin: 10px">
                                <Icon type="ios-loading" size=35 class="spin-icon-load"></Icon>
                            </Spin>
                            <h2>请插入USB移动存储设备</h2>
                            <p style="font-size: 14px;">插入后系统将自动识别处理您的设备</p>
                        </div>
                    </Col>
                    <Col span="3">
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
                countdownReturnTime:60,
                /*倒计时ClockID*/
                countdownClock:0,
                downloading: false,
                scanned_QR: false,
                loading_QR: true,
                background: {
                    backgroundImage: "url(" + require("../images/background.svg") + ")",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                },
                fileProcessing:false,
            }
        },
        mounted() {
            this.countDownStart();
            this.initWebSocket();
            this.initListenUSBInsertion();
            this.getQRCodePic();
        },
        methods: {
            //定时器与它的三个固定函数
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
                this.countdownReturnTime=60;
            },
            getQRCodePic() {
                //[控制端指令]请求服务器端二维码
                axios({
                    method: 'get',
                    url: 'http://feigestudio.vicp.cc/File/GetPrintFileUploadQRCode',
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
                }).catch(error=> {
                    if(error.response.status==500) {
                        this.$Notice.error({
                            title: '与服务器通信失败',
                            desc: '服务器未能响应请求，请联系MOTA官方 133-0535-6699 尝试解决此问题！',
                            duration:0,
                        });
                    }
                });
            },
            initListenUSBInsertion() {
                //[控制端指令]执行端开始监听USB设备接入
                axios({
                    method: 'get',
                    url: 'http://localhost:8999/listenUSBInsertion',
                }).then((response) => {
                    let responsedata = response.data;
                    if (responsedata.state == "SUCCESS") {
                        //USB设备成功接入
                        console.log("UBS Device Connection Successful");
                        clearInterval(this.countdownClock);
                        this.$router.push({
                            name: 'ChooseFile',
                            params: {
                                //转跳并传递参数设备路径参数
                                path: responsedata.msg,
                            }
                        });
                    }
                }).catch(function (error) {
                    console.log(error);
                });
            },
            initWebSocket() { //初始化weosocket
                const url = 'ws://feigestudio.vicp.cc/FileUpload/' + this.$root.randomCode;
                this.websock = new WebSocket(url);
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },
            websocketonopen() {
                console.log("Successful establishment of WebSocket connection");
            },
            websocketonerror(e) {//连接建立失败重连并返回
                console.log("Failure to establish WebSocket connection,The reasons for the error are as follows:");
                console.log(e);
                if(e.type=="error") {
                    this.$Notice.error({
                        title: '与服务器建立WEBSOCKET通讯失败',
                        desc: '服务器未能响应请求，请联系MOTA官方 133-0535-6699 尝试解决此问题！',
                    });
                }
                this.initWebSocket();
            },
            websocketonmessage(sendback) {//接收到服务器消息后
                var data = JSON.parse(sendback.data);
                if (data.state == 'SUCCESS') {
                    if (data.code == "1"){
                        console.log("Successful Scanning QR Code");
                        //开启扫描二维码成功对话框（LOADING)，防止重复扫码
                        this.scanned_QR = true;
                        this.countdownReturnTime=300;
                    } else if (data.code == "2") {
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
                            let responsedata = response.data;
                            if (responsedata.state == "SUCCESS") {
                                console.log("Successful Downloading File");
                                //解析执行端返回JSON串以获取下载的文件路径与类型
                                let file = JSON.parse(responsedata.msg);
                                //关闭下载对话框（MODEL)
                                this.downloading = false;
                                //开启文件预处理对话框（MODEL)
                                this.fileProcessing=true;
                                //[控制端指令]执行端对获得的文件进行预处理
                                axios({
                                    method: 'get',
                                    url: 'http://localhost:8999/preProcessing',
                                    params: {
                                        fileAbsolutePath: file["filePath"],
                                        fileType: file["fileType"],
                                        randomCode: this.$root.randomCode,
                                    }
                                }).then((response) => {
                                    let responsedata = response.data;
                                    if (responsedata.state == "SUCCESS") {
                                        console.log("Successful File Preprocessing");
                                        clearInterval(this.countdownClock);
                                        this.$router.push({
                                            name:"SetPrintParam",
                                        });
                                    }
                                }).catch(function (error) {
                                    console.log(error);
                                });
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
                    }
                } else {
                    this.$Message.error({
                        content: data.msg,
                        duration: 60,
                    });
                }
            },
            websocketsend(data) {//数据发送
                this.websock.send(data)
            },
            websocketclose(e) {  //关闭
                console.log('WebSocket Connection Disconnected', e)
            },
        }
    }
</script>