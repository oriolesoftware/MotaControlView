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
        <Layout class="layout">
            <Header style="padding: 20px">
                <Steps :current="4">
                    <Step title="已完成" content="上传文件或插入U盘"></Step>
                    <Step title="已完成" content="选择需要打印的文件"></Step>
                    <Step title="已完成" content="调整打印设置"></Step>
                    <Step title="已完成" content="选择打印方式"></Step>
                    <Step title="进行中" content="设备打印"></Step>
                </Steps>
            </Header>
            <Content style="height: 100%;padding: 2%" :style="background">
                <Row>
                    <p style="text-align:center;font-size: 18px;">MOTA校园 · 免费自助打印设备</p>
                    <p style="text-align:center;font-size: 40px;">设备打印中，请稍后……</p>
                </Row>
                <Row style="height:80%;" type="flex" justify="center">
                    <Col span="18" style="align-items:center;display:flex;flex-direction:column;justify-content:center">
                        <img src="../images/multifunction-printer.svg" width="100" style="margin: 30px">
                        <p style="font-size: 16px">海内存知己，天涯若比邻</p>
                        <p style="font-size: 32px">我们将很快完成</p>
                        <br/>
                        <Progress :percent="0" status="active" />
                        <p style="font-size: 16px">{{state}}</p>
                    </Col>
                </Row>

            </Content>
            <Footer><p class="layout-footer-center">2018-2019 &copy; Oriole Software MOTA</p></Footer>
        </Layout>
    </div>
</template>
<script>
    import * as axios from "axios";

    export default {
        data() {
            return {
                background: {
                    backgroundImage: "url(" + require("../images/background.svg") + ")",
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                },
                state:"正在初始化设备",
            }
        },
        mounted() {
            this.print();
        },
        methods: {
            print() {
                axios({
                    method: 'get',
                    url: 'http://localhost:8999/printFile',
                    params: {
                        fileName: this.$root.randomCode,
                    }
                }).then((response) => {
                    let responsedata = response.data;
                    if (responsedata.state == "SUCCESS") {
                        this.state = "打印任务已装入队列";

                    }
                }).catch(function (error) {
                    console.log(error);
                });
            }
        },
    }
</script>