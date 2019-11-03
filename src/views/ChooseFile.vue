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
            <Content style="height: 100%;padding: 2%" :style="this.$root.background">
                <v-exception ref="exceptionModel"></v-exception>
                <v-preProcessModel ref="preProcessModel"></v-preProcessModel>
                <Row>
                    <p style="text-align:center;font-size: 18px;color: #000000;">MOTA校园 · 免费自助打印设备</p>
                    <p style="text-align:center;font-size: 40px;margin-top:5px;color: #000000;">请选择需要打印的文件</p>
                </Row>
                <Row>
                    <Col span="2" style="text-align:center;">
                        <Row>
                            <Col span="24" v-for="root in roots" :key="root"
                                 style="text-align:center;white-space:nowrap;height: 100px;overflow:hidden;text-overflow:ellipsis;margin: 10px">
                                <a v-on:click="getFileList(root,'Directory','')">
                                    <img src="../images/usb.svg" width="50px"/>
                                    <p style="display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2; white-space: normal !important;">
                                        {{ root }}
                                    </p>
                                </a>
                            </Col>
                        </Row>
                    </Col>
                    <Col span="18">
                        <Row :style="contentHeight">
                            <CheckboxGroup v-model="checkedFile">
                                <Col span="3" v-for="file in files" :key="file.fileName"
                                     style="text-align:center;height: 100px;overflow:hidden;margin: 10px">
                                    <Checkbox v-if="file.fileType!='Directory'&&file.fileType!='Top-Level'"
                                              :label="file.fileName"
                                              @click.prevent.native="getFileList(file.filePath,file.fileType,file.fileName)"
                                              :disabled="chooseFileState=='initMode'?
                                                  false:(chooseFileState=='picChooseMode'&(file.fileType=='png'||file.fileType=='jpg')?false:true)">
                                        <img :src="file.fileIcon" width="50px"/>
                                    </Checkbox>
                                    <a v-on:click="getFileList(file.filePath,file.fileType,file.fileName)">
                                        <img :src="file.fileIcon" width="50px" style="margin-bottom: 5px"
                                             v-if="file.fileType=='Directory'||file.fileType=='Top-Level'"/>
                                        <p style="display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2; white-space: normal !important;">
                                            {{file.fileName }}
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
                loading: false,
                contentHeight: {
                    height: (`${document.documentElement.clientHeight}` - 300) + "px",
                    overflowY: "scroll",
                },
                path: this.$route.params.roots[0],
                roots: this.$route.params.roots,
                files: [],
                pathTemp: [],
                checkedFile: [],
                checkedFileType: null,
                checkedFilePath: [],
                chooseFileState: "initMode",
            }
        },
        mounted() {
            this.$refs.countdown.countDownStart(300);
            this.getFileList(this.path, "Directory");
        },
        methods: {
            countdownReset() {
                this.$refs.countdown.countdownReset(300);
            },
            getFileList(path, type, name) {
                if (type == "Directory") {
                    this.pathTemp.push(path);
                    this.files.splice(0, this.files.length);
                    axios({
                        method: 'get',
                        url: 'http://localhost:8999/getFiles',
                        params: {
                            path: path,
                        }
                    }).then((response) => {
                        let responseData = response.data;
                        if (responseData.state == "SUCCESS") {
                            if (path != this.rootPath) {
                                let fileInfo = {
                                    fileIcon: require('../images/folder.svg'),
                                    fileName: "...",
                                    filePath: "",
                                    fileType: "Top-Level",
                                };
                                this.files.push(fileInfo);
                            }

                            let fileList = JSON.parse(responseData.msg);
                            for (let i in fileList) {
                                let fileInfo = {
                                    fileIcon: this.getFileIcon(fileList[i]["fileType"]),
                                    fileName: fileList[i]["fileName"],
                                    filePath: fileList[i]["filePath"],
                                    fileType: fileList[i]["fileType"],
                                };
                                this.files.push(fileInfo);
                            }
                        }else {
                            this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, responseData.msg, responseData.code, responseData.state);
                        }
                    }).catch((reason) => {
                        this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode,reason.toString());
                    });
                } else if (type == "Top-Level") {
                    this.pathTemp.pop();
                    path = this.pathTemp.pop();
                    this.getFileList(path, "Directory");
                } else {
                    if (this.checkedFile.includes(name)) {
                        this.checkedFile.splice(this.checkedFile.indexOf(name), 1);
                        this.checkedFilePath.splice(this.checkedFilePath.indexOf(path), 1);
                        if (this.checkedFile.length == 0) {
                            this.checkedFileType = null;
                            this.chooseFileState = "initMode";
                        }
                    } else {
                        if ((this.checkedFileType == "jpg" | this.checkedFileType == "png" | this.checkedFileType == null)
                            && (type == "jpg" | type == "png")) {
                            this.chooseFileState = "picChooseMode";
                            this.checkedFile.push(name)
                            this.checkedFileType = type;
                            this.checkedFilePath.push(path);
                        } else {
                            if (this.checkedFile.length > 0) {
                                this.$Notice.error({
                                    title: '最多选择一个非图片的文档',
                                    desc: '除图片外，不可多选打印的文档，请逐份打印！',
                                });
                            } else {
                                this.chooseFileState = "normalChooseMode";
                                this.checkedFile.push(name)
                                this.checkedFileType = type;
                                this.checkedFilePath.push(path);
                            }
                        }
                    }
                }
            },
            chooseFile() {
                this.loading = true;
                this.$refs.preProcessModel.fileProcessing(this,this.checkedFilePath,this.checkedFileType);
            },
            getFileIcon(fileType) {
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