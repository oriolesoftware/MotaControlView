<template>
        <Modal v-model="fileProcessingModel" width="700" :closable="false" :mask-closable="false">
            <p slot="header" style="color:#2b85e4;text-align:center;font-size: 16px">
                <Icon type="ios-information-circle"></Icon>
                <span>正在处理中，请稍后</span>
            </p>
            <div style="text-align:center">
                <iframe frameborder="0" scrolling="no" src="Loading" width="100%" height="150"></iframe>
                <p style="font-size: 16px">{{promptMessage}}</p>
                <p style="font-size: 32px">我们将很快完成</p>
                <p style="font-size: 16px">为了确保文档格式与打印一致，小墨正在调用WPS Office2019处理相关文件</p>
            </div>
            <div slot="footer">
                <img src="../images/WPS.svg" width="70px"/>
                <p>金山办公软件提供技术支持</p>
            </div>
        </Modal>
</template>

<script>
    import * as axios from "axios";

    export default {
        data() {
            return {
                promptMessage: "海内存知己，天涯若比邻",
                promptMessageArray: [
                    "欢迎使用墨拓自助打印设备",
                    "来自中南大学计算机学院、商学院的8名同学",
                    "以梦为马，践行公益传媒",
                    "凡心所向，素履所往；生如逆旅，一苇以航",
                ],
                fileProcessingModel: false,
                processClock:0,
            }
        },

        methods: {
            doAnimation(){
                let i=0;
                this.processClock = window.setInterval(() => {
                    i++;
                    this.promptMessage=this.promptMessageArray[i%this.promptMessageArray.length];
                }, 2000);
            },
            fileProcessing(that,filePath,fileType) {
                //开启文件预处理对话框（MODEL)
                this.doAnimation();
                this.fileProcessingModel = true;
                //[控制端指令]执行端对获得的文件进行预处理
                axios({
                    method: 'get',
                    url: 'http://localhost:8999/preProcessing',
                    params: {
                        fileAbsolutePath: encodeURI(JSON.stringify(filePath)),
                        fileType: fileType,
                        randomCode: this.$root.randomCode,
                    }
                }).then((response) => {
                    let responseData = response.data;
                    if (responseData.state == "SUCCESS") {
                        console.log("Successful File Preprocessing");
                        clearInterval(this.processClock);
                        this.$router.push({
                            name: "SetPrintParam",
                        });
                    } else {
                        this.fileProcessingModel = false;
                        that.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, responseData.msg, responseData.code, responseData.state);
                    }
                }).catch((reason) => {
                    this.fileProcessingModel = false;
                    that.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, reason.toString());
                });
            },
            copyFileProcessing(that,totalPage){
                //开启文件预处理对话框（MODEL)
                this.doAnimation();
                this.fileProcessingModel = true;
                //[控制端指令]执行端对获得的文件进行预处理
                axios({
                    method: 'get',
                    url: 'http://localhost:8999/copyPreProcessing',
                    params: {
                        totalPage: totalPage,
                        randomCode: this.$root.randomCode,
                    }
                }).then((response) => {
                    let responseData = response.data;
                    if (responseData.state == "SUCCESS") {
                        console.log("Successful File Preprocessing");
                        clearInterval(this.processClock);
                        this.$router.push({
                            name: 'SetPrintParam',
                        });
                    } else {
                        this.fileProcessingModel = false;
                        that.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, responseData.msg, responseData.code, responseData.state);
                    }
                }).catch((reason) => {
                    this.fileProcessingModel = false;
                    that.$refs.exceptionModel.openExceptionModel(this.$root.randomCode, reason.toString());
                });
            }
        }
    }
</script>

<style scoped>

</style>