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
                <Steps :current="2">
                    <Step title="已完成" content="上传文件或插入U盘"></Step>
                    <Step title="已完成" content="选择需要打印的文件"></Step>
                    <Step title="进行中" content="调整打印设置"></Step>
                    <Step title="待进行" content="选择打印方式"></Step>
                    <Step title="待进行" content="设备打印"></Step>
                </Steps>
            </Header>
            <Content style="height: 100%;padding-top: 2%;padding-left: 2%;padding-right: 2%" :style="background">
                <Row>
                    <p style="text-align:center;font-size: 18px;">MOTA校园 · 免费自助打印设备</p>
                    <p style="text-align:center;font-size: 40px;">请设置打印参数</p>
                </Row>
                <Row style="height:80%;">
                    <Col span="8"
                         style="height:100%;align-items:center;display:flex;flex-direction:column;justify-content:center">
                        <Alert type="warning" show-icon v-if="loading">
                            由于页面较多，因此页面预览加载尚未完成
                            <template slot="desc">
                                加载完成前，一张多页设置预览将无法使用，请稍后……<br>
                                当前加载第 {{filePageSize}} 页，共{{finalFilePageSize}} 页
                            </template>
                        </Alert>
                        <img ref="PreviewPic" style="margin: 10px;max-height: 350px;max-width: 450px">
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
                                    <RadioGroup v-model="pageCount" type="button" slot="extra"
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
                                            :disabled="pageCount!='Custom'||!multiPage"></Button>
                                    <Input v-model="row_num" readonly slot="extra"
                                           :disabled="pageCount!='Custom'||!multiPage"
                                           style="width: 40px; margin-right: 10px;margin-left:10px;"/>
                                    <Button icon="md-remove" type="primary" shape="circle" slot="extra" size="small"
                                            v-on:click="setRow('remove')"
                                            :disabled="pageCount!='Custom'||!multiPage"></Button>
                                    <span slot="extra"> 行 </span>
                                    <Button icon="md-add" type="primary" shape="circle" slot="extra" size="small"
                                            v-on:click="setCol('add')"
                                            :disabled="pageCount!='Custom'||!multiPage"></Button>
                                    <Input v-model="col_num" readonly slot="extra"
                                           :disabled="pageCount!='Custom'||!multiPage"
                                           style="width: 40px; margin-right: 10px;margin-left:10px;"/>
                                    <Button icon="md-remove" type="primary" shape="circle" slot="extra" size="small"
                                            v-on:click="setCol('remove')"
                                            :disabled="pageCount!='Custom'||!multiPage"></Button>
                                    <span slot="extra"> 列 </span>
                                </Cell>
                                <Cell title="页面顺序" label="Page Order" style="height: 60px" :disabled="!multiPage">
                                    <RadioGroup v-model="pageOrder" type="button" slot="extra"
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
                                    <RadioGroup v-model="pageOrientation" type="button" slot="extra"
                                                :disabled="!multiPage" @on-change="multiPagePreviewRefresh=true;">
                                        <Radio label="transverse" :disabled="!multiPage" v-on:click.native="turningMode='TUMBLE'">横向</Radio>
                                        <Radio label="lengthwise" :disabled="!multiPage" v-on:click.native="turningMode='DUPLEX'">纵向</Radio>
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
                <Button type="error" style="font-size:16px;position: absolute; right: 10px; bottom:10px;"
                        v-on:click="countdownDo()">
                    <Icon type="md-exit"/>
                    退出
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
                countdownReturnTime: 240,
                /*倒计时ClockID*/
                countdownClock: 0,

                /*
                * 固定数据
                */
                /*背景*/
                background: {
                    backgroundImage: "url(" + require("../images/background.svg") + ")",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                },

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
                fileType:"",
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
                row_num: 2,
                /*一张多页打印 列*/
                col_num: 1,
                /*一张多页打印 页面前进顺序（Z,anti_Z,N,anti_N）*/
                pageOrder: "Z",
                /*一张多页打印 方向（transverse‘横向’,lengthwise‘纵向’）*/
                pageOrientation: "lengthwise",
                /*一张多页打印 行列模式（2‘二行一列’,4‘二行二列’,6‘二行三列’,9‘三行三列’,16‘四行四列’,Custom‘自定义’）*/
                pageCount: "2",
                autoAdjustmentFlag: "",
            }
        },
        mounted() {
            this.countDownStart();
            this.initWebSocket();
        },
        methods: {
            countDownStart() {
                this.countdownClock = window.setInterval(() => {
                    this.countdownReturnTime--;
                    if (this.countdownReturnTime < 0) {
                        this.countdownDo();
                    }
                }, 1000)
            },
            countdownDo() {
                clearInterval(this.countdownClock);
                this.$router.push("/");
            },
            countdownReset() {
                this.countdownReturnTime = 240;
            },
            initWebSocket() { //初始化weosocket
                const url = 'ws://localhost:8999/PreviewLoading/' + this.pdfFileName;
                this.websock = new WebSocket(url);
                this.websock.onmessage = this.websocketonmessage;
                this.websock.onopen = this.websocketonopen;
                this.websock.onerror = this.websocketonerror;
                this.websock.onclose = this.websocketclose;
            },
            websocketonopen() { //连接建立之后执行send方法发送数据
                console.log("连接建立");
            },
            websocketonerror(e) {//连接建立失败重连
                console.log(e);
                this.initWebSocket();
            },
            websocketonmessage(sendback) {
                console.log("回传数据");
                var data = JSON.parse(sendback.data);
                if (data.state == 'SUCCESS') {
                    if (data.code == "01") {
                        this.finalFilePageSize = parseInt(data.msg);
                    } else {
                        this.filePageSize = parseInt(data.msg);
                        this.endPage = parseInt(data.msg);
                        if (this.filePageSize == this.finalFilePageSize) {
                            this.loading = false;
                        }
                    }
                    if (parseInt(data.msg) == 1) {
                        this.selectPage(1);
                    }
                }
            },
            websocketsend(Data) {//数据发送
                this.websock.send(Data)
            },
            websocketclose(e) {  //关闭
                console.log('断开连接', e)
            },
            selectPage(Page) {
                if (this.multiPage) {
                    this.multiPagePreviewRefreshLoading = true;
                    axios({
                        method: 'get',
                        url: 'http://localhost:8999/getSplicingPageThumbnail',
                        responseType: 'arraybuffer',
                        params: {
                            fileName: this.pdfFileName,
                            page: parseInt(Page) - 1,
                        }
                    }).then(response => {
                        return 'data:image/png;base64,' + btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
                    }).then(data => {
                        this.multiPagePreviewRefreshLoading = false;
                        this.$refs.PreviewPic.src = data;
                    });
                } else {
                    axios({
                        method: 'get',
                        url: 'http://localhost:8999/getSinglePageThumbnail',
                        responseType: 'arraybuffer',
                        params: {
                            fileName: this.pdfFileName,
                            page: parseInt(Page) - 1,
                        }
                    }).then(response => {
                        return 'data:image/png;base64,' + btoa(new Uint8Array(response.data).reduce((data, byte) => data + String.fromCharCode(byte), ''));
                    }).then(data => {
                        this.multiPagePreviewRefresh=false;
                        this.multiPagePreviewRefreshLoading = false;
                        this.$refs.PreviewPic.src = data;
                    });
                }
            },
            setAutoAdjustment() {
                if(this.multiPage==false) {
                    axios({
                        method: 'get',
                        url: 'http://localhost:8999/documentTypePrediction',
                        params: {
                            fileName: this.pdfFileName,
                        }
                    }).then((response) => {
                        let responsedata = response.data;
                        if (responsedata.state == "SUCCESS") {
                            this.fileType = responsedata.msg;
                            if (this.fileType == "Unknow_Lengthwise") {
                                this.autoAdjustmentFlag = "FIX_L_Model";
                                this.autoAdjustmentConfirm();
                            } else if (this.fileType == "A4_lengthwise" || this.FileType == "A4_transverse") {
                                this.sendParam();
                            } else if (this.fileType == "Unknow_Transverse") {
                                this.autoAdjustmentFlag = "FIX_T_Model";
                                this.autoAdjustmentConfirm();
                            } else if (this.fileType == "PPT"){
                                this.autoAdjustmentFlag = "FIX_T_Model";
                                this.$Modal.confirm({
                                    title: '检测到通用PowerPoint文件',
                                    content: '<p>通常情况下PowerPoint打印时将根据纸张调整大小。</p>' +
                                        '<br/><p>您可以手动关闭这一调整选项。但若您<span style="color:#f60;">拒绝</span>根据纸张调整大小选项，<span style="color:#f60;">可能导致页面印刷不全、位置偏移等意外情况</span>，宜悉知！</p>',
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
                            }
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }else{
                    this.sendParam();
                }
            },
            autoAdjustmentConfirm(){
                this.$Modal.confirm({
                    title: '未知纸张适应类型',
                    content: '<p>在通常情况下这一意外不会发生，除非您使用了意外的文档编辑器或文档页面大小确实超过A4纸大小。</p>' +
                        '<br/><p>为保证良好的印刷效果，墨拓将自动调整您的页面边距，并对页面进行缩放以确保可以完美印刷</p>' +
                        '<br/><p>您可以手动关闭这一调整选项。但若您<span style="color:#f60;">拒绝</span>自动调整文档尺寸，<span style="color:#f60;">可能导致页面印刷不全、位置偏移等意外情况</span>，宜悉知！</p>',
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
            autoAdjustment(){
                this.multiPagePreviewRefresh = true;
                if(this.autoAdjustmentFlag == "FIX_L_Model"){
                    this.multiPage=true;
                    this.row_num=1;
                    this.col_num=1;
                    this.pageOrder="Z";
                    this.pageOrientation="lengthwise";
                    this.pageCount="Custom";
                }
                if(this.autoAdjustmentFlag == "FIX_T_Model"){
                    this.multiPage=true;
                    this.row_num=1;
                    this.col_num=1;
                    this.pageOrder="Z";
                    this.pageOrientation="transverse";
                    this.pageCount="Custom";
                    this.turningMode="TUMBLE";
                }
                if(!this.loading) {
                    axios({
                        method: 'get',
                        url: 'http://localhost:8999/splicingPage',
                        params: {
                            fileName: this.pdfFileName,
                            pageCount: this.finalFilePageSize,
                            col: this.col_num,
                            row: this.row_num,
                            direction: this.pageOrientation,
                            pageOrder: this.pageOrder,
                        }
                    }).then((response) => {
                        let responsedata = response.data;
                        if (responsedata.state == "SUCCESS") {
                            this.multiPagePreviewRefresh = false;
                            this.sendParam();
                            this.$Modal.remove();
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }else{
                    this.$Modal.remove();
                    this.$Message.error('在页面全部加载完毕前，不能自动调整页面，请等待加载完毕后重试');
                }
            },
            sendParam() {
                if(!this.multiPagePreviewRefresh && !this.multiPagePreviewRefreshLoading) {
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
                            row_num: this.row_num,
                            rol_num: this.col_num,
                            pageOrder: this.pageOrder,
                            pageOrientation: this.pageOrientation,
                            pageCount: this.pageCount,

                            duplex: this.duplex,
                            turningMode: this.turningMode,
                        }
                    }).then((response) => {
                        let responsedata = response.data;
                        if (responsedata.state == "SUCCESS") {
                            clearInterval(this.countdownClock);
                            this.$router.push({
                                name: 'ChooseServiceType',
                                params: {
                                    direction: this.pageOrientation,
                                }
                            });
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }else {
                    this.$Message.error('在一张多页预览加载完毕前，不能提交打印任务，请等待加载完毕后重试');
                }
            },
            setPageCount() {
                this.multiPagePreviewRefresh = true;
                switch (this.pageCount) {
                    case "2":
                        this.col_num = 1;
                        this.row_num = 2;
                        break;
                    case "4":
                        this.col_num = 2;
                        this.row_num = 2;
                        break;
                    case "6":
                        this.col_num = 3;
                        this.row_num = 2;
                        break;
                    case "9":
                        this.col_num = 3;
                        this.row_num = 3;
                        break;
                    case "16":
                        this.col_num = 4;
                        this.row_num = 4;
                        break;
                    case "Custom":
                        this.col_num = 2;
                        this.row_num = 2;
                        break;
                }
            },
            splicingPage() {
                if (!this.multiPage) {
                    this.filePageSize = this.finalFilePageSize;
                    this.nowPage = 1;
                    this.selectPage(1);
                } else {
                    if(!this.loading) {
                        this.multiPagePreviewRefresh = false;
                        this.multiPagePreviewRefreshLoading = true;
                        axios({
                            method: 'get',
                            url: 'http://localhost:8999/splicingPage',
                            params: {
                                fileName: this.pdfFileName,
                                pageCount: this.finalFilePageSize,
                                col: this.col_num,
                                row: this.row_num,
                                direction: this.pageOrientation,
                                pageOrder: this.pageOrder,
                            }
                        }).then((response) => {
                            let responsedata = response.data;
                            if (responsedata.state == "SUCCESS") {
                                this.filePageSize = parseInt(responsedata.msg);
                                this.endPage = parseInt(responsedata.msg);
                                this.selectPage(1);
                                this.nowPage = 1;
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
                    }else{
                        this.$Message.error('在页面全部加载完毕前，一张多页无法预览');
                    }
                }
            },
            setCopies(action) {
                switch (action) {
                    case "add":
                        this.copies = this.copies + 1;
                        break;
                    case "remove":
                        if (this.copies > 1) {
                            this.copies = this.copies - 1;
                        } else {
                            this.$Message.error('至少需要印刷一份呢亲亲~');
                        }
                }
            },
            setStartPage(action) {
                switch (action) {
                    case "add":
                        if (this.startPage < this.endPage) {
                            this.startPage = this.startPage + 1;
                        } else {
                            this.$Message.error('起始页不得在终结页之后呢！');
                        }
                        break;
                    case "remove":
                        if (this.startPage > 1) {
                            this.startPage = this.startPage - 1;
                        } else {
                            this.$Message.error('已经到达首页了呢');
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
                            this.$Message.error('已经到达末尾了呢');
                        }
                        break;
                    case "remove":
                        if (this.endPage > this.startPage) {
                            this.endPage = this.endPage - 1;
                        } else {
                            this.$Message.error('终结页不得在起始页之后呢！');
                        }
                        break;
                }
            },
            setRow(action) {
                switch (action) {
                    case "add":
                        this.row_num = this.row_num + 1;
                        break;
                    case "remove":
                        if (this.row_num > 1) {
                            this.row_num = this.row_num - 1;
                        } else {
                            this.$Message.error('最低不能小于1行呢');
                        }
                        break;
                }
                this.multiPagePreviewRefresh = true;
            },
            setCol(action) {
                switch (action) {
                    case "add":
                        this.col_num = this.col_num + 1;
                        break;
                    case "remove":
                        if (this.col_num > 1) {
                            this.col_num = this.col_num - 1;
                        } else {
                            this.$Message.error('最低不能小于1行呢');
                        }
                        break;
                }
                this.multiPagePreviewRefresh = true;
            },
        }
    }
</script>