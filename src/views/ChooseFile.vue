<style scoped>

    * {
        font-family: "站酷小薇LOGO体";
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
                <Steps :current="1">
                    <Step title="已完成" content="上传文件或插入U盘"></Step>
                    <Step title="进行中" content="选择需要打印的文件"></Step>
                    <Step title="待进行" content="调整打印设置"></Step>
                    <Step title="待进行" content="选择打印方式"></Step>
                    <Step title="待进行" content="设备打印"></Step>
                </Steps>
            </Header>
            <Content style="height: 100%;padding: 2%" :style="background">
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
                    <p style="text-align:center;font-size: 40px;">请选择需要打印的文件</p>
                </Row>
                <Row>
                    <Col span="2" style="text-align:center;">
                            <img src="../images/usb.svg" width="50px"/>
                            <p>{{path}}</p>
                    </Col>
                    <Col span="18">
                        <Row :style="contentHeight">
                            <CheckboxGroup v-model="checkedFile">
                            <Col span="2" v-for="file in files" style="text-align:center;white-space:nowrap;height: 80px;overflow:hidden;text-overflow:ellipsis;margin: 10px">
                                <a v-on:click="getFileList(file.filePath,file.fileType,file.fileName)">
                                    <img :src="file.fileIcon" width="50px"/>
                                    <p>
                                        <Checkbox v-if="file.fileType!='Directory'&&file.fileType!='Top-Level'"
                                                  :label="file.fileName">
                                            {{ file.fileName }}
                                        </Checkbox>
                                        <span v-if="file.fileType=='Directory'||file.fileType=='Top-Level'">{{ file.fileName }}</span>
                                    </p>
                                </a>
                            </Col>
                            </CheckboxGroup>
                        </Row>
                    </Col>
                    <Col span="4" style="text-align:center;">
                        <Button type="primary" :loading="loading" icon="md-print" @click="chooseFile">
                            <span v-if="!loading">确认打印文件</span>
                            <span v-else>预处理中...</span>
                        </Button>
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
                loading:false,
                contentHeight: {
                    height: (`${document.documentElement.clientHeight}`-300)+"px",
                    overflowY : "scroll",
                },
                path: this.$route.params.path,
                rootPath: this.$route.params.path,
                background: {
                    backgroundImage: "url(" + require("../images/background.svg") + ")",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                },
                files: [
                ],
                pathTemp:[
                ],
                checkedFile:[
                ],
                checkedFileType:[
                ],
                checkedFilePath:[
                ],
                fileProcessing:false,
            }
        },
        mounted() {
            this.countDownStart();
            this.getFileList(this.path,"Directory");
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
            getFileList(path,type,name){
                if(type=="Directory") {
                    this.pathTemp.push(path);
                    this.files.splice(0, this.files.length);
                    axios({
                        method: 'get',
                        url: 'http://localhost:8999/getFiles',
                        params: {
                            path: path,
                        }
                    }).then((response) => {
                        let responsedata = response.data;
                        if (responsedata.state == "SUCCESS") {

                            if(path!=this.rootPath){
                                let fileInfo = {
                                    fileIcon: require('../images/folder.svg'),
                                    fileName: "...",
                                    filePath: "",
                                    fileType: "Top-Level",
                                };
                                this.files.push(fileInfo);
                            }

                            let fileList = JSON.parse(responsedata.msg);
                            for (let i in fileList) {
                                let fileInfo = {
                                    fileIcon: this.getFileIcon(fileList[i]["fileType"]),
                                    fileName: fileList[i]["fileName"],
                                    filePath: fileList[i]["filePath"],
                                    fileType: fileList[i]["fileType"],
                                };
                                this.files.push(fileInfo);
                            }
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
                }else if(type=="Top-Level"){
                    this.pathTemp.pop();
                    path=this.pathTemp.pop();
                    this.getFileList(path,"Directory");
                }else {
                    this.checkedFile=[name];
                    this.checkedFileType=[type];
                    this.checkedFilePath=[path];
                }
            },
            chooseFile(){
                this.fileProcessing=true;
                this.loading=true;
                axios({
                        method: 'get',
                        url: 'http://localhost:8999/preProcessing',
                        params: {
                            fileAbsolutePath: this.checkedFilePath[0],
                            fileType: this.checkedFileType[0],
                            randomCode: this.$root.randomCode,
                        }
                    }).then((response) => {
                    let responsedata = response.data;
                        if (responsedata.state == "SUCCESS") {
                            console.log("文件预处理成功");
                            this.fileProcessing=false;
                            clearInterval(this.countdownClock);
                            this.$router.push({
                                name: 'SetPrintParam',
                            });
                        }
                    }).catch(function (error) {
                        console.log(error);
                    });
            },
            getFileIcon(fileType){
                switch (fileType) {
                    case "doc":
                        return require('../images/doc.svg');
                    case "docx":
                        return require('../images/doc.svg');
                    case "ppt":
                        return require('../images/ppt.svg');
                    case "pptx":
                        return require('../images/ppt.svg');
                    case "xls":
                        return require('../images/xls.svg');
                    case "xlsx":
                        return require('../images/xls.svg');
                    case "jpg":
                        return require('../images/jpg.svg');
                    case "png":
                        return require('../images/png.svg');
                    case "pdf":
                        return require('../images/pdf.svg');
                    case "Directory":
                        return require('../images/folder.svg');
                }

            }
        }
    }
</script>