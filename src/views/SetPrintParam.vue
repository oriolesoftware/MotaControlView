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
                <Steps :current="2">
                    <Step title="已完成" content="上传文件或插入U盘"></Step>
                    <Step title="已完成" content="选择需要打印的文件"></Step>
                    <Step title="进行中" content="调整打印设置"></Step>
                    <Step title="待进行" content="选择打印方式"></Step>
                    <Step title="待进行" content="设备打印"></Step>
                </Steps>
            </Header>
            <Content style="height: 100%;padding-top: 2%;padding-left: 2%;padding-right: 2%"
                     :style="this.$root.background">
                <v-exception ref="exceptionModel"></v-exception>
                <Row>
                    <p style="text-align:center;font-size: 18px;">MOTA校园 · 免费自助打印设备</p>
                    <p style="text-align:center;font-size: 40px;">请设置打印参数</p>
                </Row>
                <Row style="height:80%;">
                    <Col span="8"
                         style="height:100%;align-items:center;display:flex;flex-direction:column;">
                        <Alert type="warning" show-icon v-if="loading">
                            由于页面较多，因此页面预览加载尚未完成
                            <template slot="desc">
                                加载完成前，一张多页设置预览将无法使用，请稍后……<br>
                                当前加载第 {{filePageSize}} 页，共{{finalFilePageSize}} 页
                            </template>
                        </Alert>
                        <img ref="PreviewPic" style="margin: 10px;max-height: 360px;max-width: 460px">
                        <Page :total="filePageSize" :page-size="1" prev-text="Previous" next-text="Next"
                              @on-change="selectPage"/>
                        <Spin fix v-if="multiPagePreviewRefresh" v-on:click.native="splicingPage()">
                            <Icon type="md-refresh-circle" size=48 />
                            <br/>
                            <div style="font-size: 16px">当你设置完成<br/>请点击此处刷新多页预览</div>
                        </Spin>
                        <Spin fix v-if="multiPagePreviewRefreshLoading">
                            <Icon type="ios-loading" size=48 class="spin-icon-load"></Icon>
                            <br/>
                            <div style="font-size: 16px">正在刷新多页预览</div>
                        </Spin>
                    </Col>
                    <Col span="8" style="height:100%;align-items:center;display:flex;flex-direction:column;">
                        <Card title="打印机选项" icon="ios-options" :padding="0" shadow style="width: 400px; margin: 10px">
                            <CellGroup>
                                <Cell title="打印份数" label="Copies">
                                    <Button icon="md-add" type="primary" shape="circle" slot="extra" size="small"
                                            v-on:click="setCopies('add')"></Button>
                                    <Input v-model="copies" readonly slot="extra"
                                           style="width: 40px; margin-right: 10px;margin-left:10px;"/>
                                    <Button icon="md-remove" type="primary" shape="circle" slot="extra" size="small"
                                            v-on:click="setCopies('remove')"></Button>
                                </Cell>
                                <Cell title="逐份打印" label="Collate">
                                    <Switch v-model="collate" size="large" slot="extra">
                                        <span slot="open">ON</span>
                                        <span slot="close">OFF</span>
                                    </Switch>
                                </Cell>
                            </CellGroup>
                        </Card>

                        <Card title="页面内容和范围选择" icon="ios-options" :padding="0" shadow
                              style="width: 400px; margin: 10px">
                            <CellGroup>
                                <Cell title="打印范围" label="Page Range">
                                    <RadioGroup v-model="pageRange" type="button" slot="extra">
                                        <Radio label="AllPage">所有页面</Radio>
                                        <Radio label="CurrentPage">当前页面</Radio>
                                        <Radio label="SelectPage">页面选择</Radio>
                                    </RadioGroup>
                                </Cell>
                                <Cell title="页面选择" label="Page Selection">
                                    <Button icon="md-add" type="primary" shape="circle" slot="extra" size="small"
                                            :disabled="pageRange!='SelectPage'"
                                            v-on:click="setStartPage('add')"></Button>
                                    <Input v-model="startPage" readonly slot="extra" :disabled="pageRange!='SelectPage'"
                                           style="width: 40px; margin-right: 10px;margin-left:10px;"/>
                                    <Button icon="md-remove" type="primary" shape="circle" slot="extra" size="small"
                                            :disabled="pageRange!='SelectPage'"
                                            v-on:click="setStartPage('remove')"></Button>
                                    <span slot="extra"> ~ </span>
                                    <Button icon="md-add" type="primary" shape="circle" slot="extra" size="small"
                                            :disabled="pageRange!='SelectPage'"
                                            v-on:click="setEndPage('add')"></Button>
                                    <Input v-model="endPage" readonly slot="extra" :disabled="pageRange!='SelectPage'"
                                           style="width: 40px; margin-right: 10px;margin-left:10px;"/>
                                    <Button icon="md-remove" type="primary" shape="circle" slot="extra" size="small"
                                            :disabled="pageRange!='SelectPage'"
                                            v-on:click="setEndPage('remove')"></Button>
                                </Cell>
                                <Cell title="奇偶页面" label="Page Parity">
                                    <RadioGroup v-model="pageParity" type="button" slot="extra">
                                        <Radio label="None">全部页面</Radio>
                                        <Radio label="OddPage">仅奇数页</Radio>
                                        <Radio label="EvenPage">仅偶数页</Radio>
                                    </RadioGroup>
                                </Cell>
                            </CellGroup>
                        </Card>
                        <Button size="large" icon="md-print" type="primary" style="margin: 10px"
                                v-on:click="setAutoAdjustment()">提交打印作业
                        </Button>
                    </Col>
                    <Col span="8" style="height:100%;align-items:center;display:flex;flex-direction:column;">
                        <Card title="打印方式" icon="ios-options" :padding="0" shadow style="width: 400px; margin: 10px">
                            <CellGroup>
                                <Cell title="一张多页" label="Multi Page">
                                    <Switch v-model="multiPage" size="large" slot="extra"
                                            @on-change="multiPagePreviewRefresh=multiPage">
                                        <span slot="open">ON</span>
                                        <span slot="close">OFF</span>
                                    </Switch>
                                </Cell>
                                <Cell title="页面张数" label="Page Count" :disabled="!multiPage">
                                    <RadioGroup v-model="multiPageCount" type="button" slot="extra"
                                                @on-change="setPageCount()">
                                        <Radio label="2" :disabled="!multiPage">2</Radio>
                                        <Radio label="4" :disabled="!multiPage">4</Radio>
                                        <Radio label="6" :disabled="!multiPage">6</Radio>
                                        <Radio label="9" :disabled="!multiPage">9</Radio>
                                        <Radio label="16" :disabled="!multiPage">16</Radio>
                                        <Radio label="Custom" :disabled="!multiPage">自定义</Radio>
                                    </RadioGroup>
                                </Cell>
                                <Cell title="自定义页面张数" label="Custom Page Count" :disabled="!multiPage">
                                    <Button icon="md-add" type="primary" shape="circle" slot="extra" size="small"
                                            v-on:click="setRow('add')"
                                            :disabled="multiPageCount!='Custom'||!multiPage"></Button>
                                    <Input v-model="multiPageRowNum" readonly slot="extra"
                                           :disabled="multiPageCount!='Custom'||!multiPage"
                                           style="width: 40px; margin-right: 10px;margin-left:10px;"/>
                                    <Button icon="md-remove" type="primary" shape="circle" slot="extra" size="small"
                                            v-on:click="setRow('remove')"
                                            :disabled="multiPageCount!='Custom'||!multiPage"></Button>
                                    <span slot="extra"> 行 </span>
                                    <Button icon="md-add" type="primary" shape="circle" slot="extra" size="small"
                                            v-on:click="setCol('add')"
                                            :disabled="multiPageCount!='Custom'||!multiPage"></Button>
                                    <Input v-model="multiPageColNum" readonly slot="extra"
                                           :disabled="multiPageCount!='Custom'||!multiPage"
                                           style="width: 40px; margin-right: 10px;margin-left:10px;"/>
                                    <Button icon="md-remove" type="primary" shape="circle" slot="extra" size="small"
                                            v-on:click="setCol('remove')"
                                            :disabled="multiPageCount!='Custom'||!multiPage"></Button>
                                    <span slot="extra"> 列 </span>
                                </Cell>
                                <Cell title="页面顺序" label="Page Order" style="height: 60px" :disabled="!multiPage">
                                    <RadioGroup v-model="multiPageOrder" type="button" slot="extra"
                                                @on-change="multiPagePreviewRefresh=true">
                                        <Radio style="height: 50px;padding: 5px;text-align: center;" label="Z"
                                               :disabled="!multiPage"><img src="../images/Z.png" height="40"/></Radio>
                                        <Radio style="height: 50px;padding: 5px;text-align: center;" label="anti_Z"
                                               :disabled="!multiPage"><img src="../images/Anti-Z.png" height="40"/>
                                        </Radio>
                                        <Radio style="height: 50px;padding: 5px;text-align: center;" label="N"
                                               :disabled="!multiPage"><img src="../images/N.png" height="40"/></Radio>
                                        <Radio style="height: 50px;padding: 5px;text-align: center;" label="anti_N"
                                               :disabled="!multiPage"><img src="../images/Anti-N.png" height="40"/>
                                        </Radio>
                                    </RadioGroup>
                                </Cell>
                                <Cell title="页面方向" label="Page Orientation" :disabled="!multiPage">
                                    <RadioGroup v-model="multiPageOrientation" type="button" slot="extra"
                                                :disabled="!multiPage" @on-change="multiPagePreviewRefresh=true;">
                                        <Radio label="transverse" :disabled="!multiPage"
                                               v-on:click.native="turningMode='TUMBLE'">横向
                                        </Radio>
                                        <Radio label="lengthwise" :disabled="!multiPage"
                                               v-on:click.native="turningMode='DUPLEX'">纵向
                                        </Radio>
                                    </RadioGroup>
                                </Cell>
                                <Cell title="双面打印" label="Duplex">
                                    <Switch v-model="duplex" size="large" slot="extra">
                                        <span slot="open">ON</span>
                                        <span slot="close">OFF</span>
                                    </Switch>
                                </Cell>
                                <Cell title="翻页方式" label="TurningMode">
                                    <RadioGroup v-model="turningMode" type="button" slot="extra">
                                        <Radio label="DUPLEX" :disabled="!duplex">双面长边翻页</Radio>
                                        <Radio label="TUMBLE" :disabled="!duplex">双面短边翻页</Radio>
                                    </RadioGroup>
                                </Cell>
                            </CellGroup>
                        </Card>
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

    export default {
        components: {
            'v-exception': ExceptionModel,
            'v-countdownButton': CountdownButton,
        },
        data() {
            return {
                /*
                * 临时数据
                */
                /*当前文档状态包含的页数（一张多页时会导致当前页数比固定页数少）*/
                filePageSize: 0,
                /*文档固定页数*/
                finalFilePageSize: 0,
                /*用户预览的当前页*/
                nowPage: 1,
                /*PDF文件名*/
                pdfFileName: this.$root.randomCode,
                /*加载状态*/
                loading: true,
                multiPagePreviewRefresh: false,
                multiPagePreviewRefreshLoading: false,
                /*原始文件类型*/
                fileType: "",
                /*
                * 打印配置数据
                */
                /*文档打印起始页*/
                startPage: 1,
                /*文档打印终结页*/
                endPage: 0,
                /*文档打印份数（1-N）*/
                copies: 1,
                /*文档打印范围（AllPage‘全部打印’、CurrentPage‘当前页面’、SelectPage‘选定页面’）*/
                pageRange: "AllPage",
                /*双面打印（T/F)*/
                duplex: true,
                /*双面打印翻页方式（DUPLEX‘双面长边’、TUMBLE‘双面短边’）*/
                turningMode: "DUPLEX",
                /*页面奇偶性（NONE‘默认，全部打印’、OddPage‘仅奇数页’、EvenPage‘仅偶数页’）*/
                pageParity: "None",
                /*逐份打印（T/F）*/
                collate: false,
                /*一张多页拼合打印（T/F）*/
                multiPage: false,
                /*一张多页打印 行*/
                multiPageRowNum: 2,
                /*一张多页打印 列*/
                multiPageColNum: 1,
                /*一张多页打印 页面前进顺序（Z,anti_Z,N,anti_N）*/
                multiPageOrder: "Z",
                /*一张多页打印 方向（transverse‘横向’,lengthwise‘纵向’）*/
                multiPageOrientation: "lengthwise",
                /*一张多页打印 行列模式（2‘二行一列’,4‘二行二列’,6‘二行三列’,9‘三行三列’,16‘四行四列’,Custom‘自定义’）*/
                multiPageCount: "2",
                autoAdjustmentFlag: "",
            }
        },
        mounted() {
            this.$refs.countdown.countDownStart(240);
            this.initWebSocket();
        },
        methods: {
            countdownReset() {
                this.$refs.countdown.countdownReset(240);
            },
            initWebSocket() { //初始化weosocket
                const url = 'ws://localhost:8999/PreviewLoading/' + this.pdfFileName;
                this.websock = new WebSocket(url);
                this.websock.onmessage = this.websocketOnMessage;
                this.websock.onopen = this.websocketOnOpen;
                this.websock.onerror = this.websocketOnError;
                this.websock.onclose = this.websocketClose;
            },
            websocketOnOpen() { //连接建立之后执行send方法发送数据
                console.log("Successful establishment of WebSocket connection");
            },
            websocketOnError(e) {//连接建立失败重连
                console.log(e);
                this.initWebSocket();
            },
            websocketOnMessage(sendback) {
                var responseData = JSON.parse(sendback.data);
                if (responseData.state == 'SUCCESS') {
                    if (responseData.code == "01") {
                        this.finalFilePageSize = parseInt(responseData.msg);
                    } else {
                        this.filePageSize = parseInt(responseData.msg);
                        this.endPage = parseInt(responseData.msg);
                        if (this.filePageSize == this.finalFilePageSize) {
                            this.loading = false;
                        }
                    }
                    if (parseInt(responseData.msg) == 1) {
                        this.selectPage(1);
                    }
                } else {
                    this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, responseData.msg, responseData.code, responseData.state);
                }
            },
            websocketSend(Data) {//数据发送
                this.websock.send(Data)
            },
            websocketClose(e) {  //关闭
                console.log('断开连接', e)
            },
            selectPage(Page) {
                var requestParam = {
                    method: 'get',
                    url: null,
                    responseType: 'arraybuffer',
                    params: {
                        fileName: this.pdfFileName,
                        page: parseInt(Page) - 1,
                    }
                };
                if (this.multiPage) {
                    requestParam.url = 'http://localhost:8999/getSplicingPageThumbnail';
                } else {
                    requestParam.url = 'http://localhost:8999/getSinglePageThumbnail';
                }
                this.multiPagePreviewRefreshLoading = true;
                axios(requestParam).then(response => {
                    return 'data:image/png;base64,' + btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
                }).then(data => {
                    this.multiPagePreviewRefreshLoading = false;
                    this.$refs.PreviewPic.src = data;
                }).catch((reason) => {
                    this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, reason.toString());
                });
            },
            setAutoAdjustment() {
                if (this.multiPage == false) {
                    axios({
                        method: 'get',
                        url: 'http://localhost:8999/documentTypePrediction',
                        params: {
                            fileName: this.pdfFileName,
                        }
                    }).then((response) => {
                        let responseData = response.data;
                        if (responseData.state == "SUCCESS") {
                            this.fileType = responseData.msg;
                            switch (this.fileType) {
                                case "Unknow_Transverse":
                                    this.autoAdjustmentFlag = "FIX_T_Model";
                                    this.autoAdjustmentConfirm("Unknown");
                                    break;
                                case "Unknow_Lengthwise":
                                    this.autoAdjustmentFlag = "FIX_L_Model";
                                    this.autoAdjustmentConfirm("Unknown");
                                    break;
                                case "A4_lengthwise":
                                case "A4_transverse":
                                    this.sendParam();
                                    break;
                                case "PPT":
                                    this.autoAdjustmentFlag = "FIX_T_Model";
                                    this.autoAdjustmentConfirm("PPT");
                                    break;
                            }
                        } else {
                            this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, responseData.msg, responseData.code, responseData.state);
                        }
                    }).catch((reason) => {
                        this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode,reason.toString());
                    });
                } else {
                    this.sendParam();
                }
            },
            autoAdjustmentConfirm(type) {
                let title, content;
                switch (type) {
                    case "PPT":
                        title = '检测到通用PowerPoint文件';
                        content = '<p>通常情况下PowerPoint打印时将根据纸张调整大小。</p>' +
                            '<br/><p>您可以手动关闭这一调整选项。但若您<span style="color:#f60;">拒绝</span>根据纸张调整大小选项，<span style="color:#f60;">可能导致页面印刷不全、位置偏移等意外情况</span>，宜悉知！</p>';
                        break;
                    default:
                        title = '未知纸张适应类型';
                        content = '<p>在通常情况下这一意外不会发生，除非您使用了意外的文档编辑器或文档页面大小确实超过A4纸大小。</p>' +
                            '<br/><p>为保证良好的印刷效果，墨拓将自动调整您的页面边距，并对页面进行缩放以确保可以完美印刷</p>' +
                            '<br/><p>您可以手动关闭这一调整选项。但若您<span style="color:#f60;">拒绝</span>自动调整文档尺寸，<span style="color:#f60;">可能导致页面印刷不全、位置偏移等意外情况</span>，宜悉知！</p>';
                        break;
                }
                this.$Modal.confirm({
                    title: title,
                    content: content,
                    loading: true,
                    okText: '没问题，请自动调整',
                    cancelText: '不，不要自动调整文档',
                    onOk: () => {
                        this.autoAdjustment();
                    },
                    onCancel: () => {
                        this.sendParam();
                        this.$Modal.remove();
                    }
                });
            },
            autoAdjustment() {
                this.multiPagePreviewRefresh = true;
                this.multiPage = true;
                this.multiPageRowNum = 1;
                this.multiPageColNum = 1;
                this.multiPageOrder = "Z";
                this.multiPageOrientation = (this.autoAdjustmentFlag === "FIX_L_Model") ? "lengthwise" : "transverse";
                this.turningMode = (this.autoAdjustmentFlag === "FIX_L_Model") ? "DUPLEX" : "TUMBLE";
                this.multiPageCount = "Custom";
                if (!this.loading) {
                    axios({
                        method: 'get',
                        url: 'http://localhost:8999/splicingPage',
                        params: {
                            fileName: this.pdfFileName,
                            pageCount: this.finalFilePageSize,
                            multiPageColNum: this.multiPageColNum,
                            multiPageRowNum: this.multiPageRowNum,
                            multiPageOrientation: this.multiPageOrientation,
                            multiPageOrder: this.multiPageOrder,
                        }
                    }).then((response) => {
                        let responseData = response.data;
                        if (responseData.state == "SUCCESS") {
                            this.multiPagePreviewRefresh = false;
                            this.sendParam();
                            this.$Modal.remove();
                        } else {
                            this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, responseData.msg, responseData.code, responseData.state);
                        }
                    }).catch((reason) => {
                        this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode,reason.toString());
                    });
                } else {
                    this.$Modal.remove();
                    this.$Notice.warning({
                        title: '注意',desc:'在页面全部加载完毕前，不能自动调整页面，请等待加载完毕后重试'
                    });
                }
            },
            sendParam() {
                if (!this.multiPagePreviewRefresh && !this.multiPagePreviewRefreshLoading) {
                    axios({
                        method: 'get',
                        url: 'http://localhost:8999/setPrintingParam',
                        params: {
                            randomCode: this.pdfFileName,

                            pageRange: this.pageRange,
                            nowPage: this.nowPage,
                            startPage: this.startPage,
                            endPage: this.endPage,
                            pageParity: this.pageParity,

                            copies: this.copies,
                            collate: this.collate,

                            multiPage: this.multiPage,
                            multiPageRowNum: this.multiPageRowNum,
                            multiPageColNum: this.multiPageColNum,
                            multiPageOrder: this.multiPageOrder,
                            multiPageOrientation: this.multiPageOrientation,
                            multiPageCount: this.multiPageCount,

                            duplex: this.duplex,
                            turningMode: this.turningMode,
                        }
                    }).then((response) => {
                        let responseData = response.data;
                        if (responseData.state == "SUCCESS") {
                            clearInterval(this.countdownClock);
                            this.$router.push({
                                name: 'ChooseServiceType',
                                params: {
                                    direction: this.multiPageOrientation,
                                }
                            });
                        } else {
                            this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, responseData.msg, responseData.code, responseData.state);
                        }
                    }).catch((reason) => {
                        this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode,reason.toString());
                    });
                } else {
                    this.$Notice.warning({
                        title: '注意',desc:'在一张多页预览加载完毕前，不能提交打印任务，请等待加载完毕后重试'
                    });
                }
            },
            setPageCount() {
                this.multiPagePreviewRefresh = true;
                switch (this.multiPageCount) {
                    case "2":
                        this.multiPageColNum = 1;
                        this.multiPageRowNum = 2;
                        break;
                    case "4":
                        this.multiPageColNum = 2;
                        this.multiPageRowNum = 2;
                        break;
                    case "6":
                        this.multiPageColNum = 3;
                        this.multiPageRowNum = 2;
                        break;
                    case "9":
                        this.multiPageColNum = 3;
                        this.multiPageRowNum = 3;
                        break;
                    case "16":
                        this.multiPageColNum = 4;
                        this.multiPageRowNum = 4;
                        break;
                    case "Custom":
                        this.multiPageColNum = 2;
                        this.multiPageRowNum = 2;
                        break;
                }
            },
            splicingPage() {
                if (!this.multiPage) {
                    this.filePageSize = this.finalFilePageSize;
                    this.nowPage = 1;
                    this.selectPage(1);
                } else {
                    if (!this.loading) {
                        this.multiPagePreviewRefresh = false;
                        this.multiPagePreviewRefreshLoading = true;
                        axios({
                            method: 'get',
                            url: 'http://localhost:8999/splicingPage',
                            params: {
                                fileName: this.pdfFileName,
                                pageCount: this.finalFilePageSize,
                                multiPageColNum: this.multiPageColNum,
                                multiPageRowNum: this.multiPageRowNum,
                                multiPageOrientation: this.multiPageOrientation,
                                multiPageOrder: this.multiPageOrder,
                            }
                        }).then((response) => {
                            let responseData = response.data;
                            if (responseData.state == "SUCCESS") {
                                this.filePageSize = parseInt(responseData.msg);
                                this.endPage = parseInt(responseData.msg);
                                this.selectPage(1);
                                this.nowPage = 1;
                            } else {
                                this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, responseData.msg, responseData.code, responseData.state);
                            }
                        }).catch((reason) => {
                            this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode,reason.toString());
                        });
                    } else {
                        this.$Notice.warning({
                            title: '注意',desc:'在页面全部加载完毕前，一张多页无法预览'
                        });
                    }
                }
            },
            setCopies(action) {
                switch (action) {
                    case "add":
                        if ((this.duplex&&this.copies*this.finalFilePageSize > 100)
                            ||(!this.duplex&&this.copies*this.finalFilePageSize > 50)) {
                            this.$Notice.warning({
                                title: '注意',desc:'单次打印的总页数不能超过50页哦，超大文件若需多份请分开打印哦'
                            });
                        }else{
                            this.copies = this.copies + 1;
                        }
                        break;
                    case "remove":
                        if (this.copies > 1) {
                            this.copies = this.copies - 1;
                        } else {
                            this.$Notice.warning({
                                title: '注意',desc:'至少需要印刷一份呢亲亲~'
                            });
                        }
                }
            },
            setStartPage(action) {
                switch (action) {
                    case "add":
                        if (this.startPage < this.endPage) {
                            this.startPage = this.startPage + 1;
                        } else {
                            this.$Notice.warning({
                                title: '注意',desc:'起始页不得在终结页之后呢！'
                            });
                        }
                        break;
                    case "remove":
                        if (this.startPage > 1) {
                            this.startPage = this.startPage - 1;
                        } else {
                            this.$Notice.warning({
                                title: '注意',desc:'已经到达首页了呢'
                            });
                        }
                        break;
                }
            },
            setEndPage(action) {
                switch (action) {
                    case "add":
                        if (this.endPage < this.filePageSize) {
                            this.endPage = this.endPage + 1;
                        } else {
                            this.$Notice.warning({
                                title: '注意',desc: '已经到达末尾了呢'
                            });
                        }
                        break;
                    case "remove":
                        if (this.endPage > this.startPage) {
                            this.endPage = this.endPage - 1;
                        } else {
                            this.$Notice.warning({
                                title: '注意',desc: '终结页不得在起始页之后呢！'
                            });
                        }
                        break;
                }
            },
            setRow(action) {
                switch (action) {
                    case "add":
                        if (this.multiPageRowNum <= 16) {
                            this.multiPageRowNum = this.multiPageRowNum + 1;
                        } else {
                            this.$Notice.warning({
                                title: '注意',desc: '最多不建议超过16行呢'
                            });
                        }
                        break;
                    case "remove":
                        if (this.multiPageRowNum > 1) {
                            this.multiPageRowNum = this.multiPageRowNum - 1;
                        } else {
                            this.$Notice.warning({
                                title: '注意',desc: '最低不能小于1行呢'
                            });
                        }
                        break;
                }
                this.multiPagePreviewRefresh = true;
            },
            setCol(action) {
                switch (action) {
                    case "add":
                        if (this.multiPageColNum <= 16) {
                            this.multiPageColNum = this.multiPageColNum + 1;
                        }else {
                            this.$Notice.warning({
                                title: '注意',desc: '最多不建议超过16行呢'
                            });
                        }
                        break;
                    case "remove":
                        if (this.multiPageColNum > 1) {
                            this.multiPageColNum = this.multiPageColNum - 1;
                        } else {
                            this.$Notice.warning({
                                title: '注意',desc: '最低不能小于1行呢'
                            });
                        }
                        break;
                }
                this.multiPagePreviewRefresh = true;
            },
        }
    }
</script>