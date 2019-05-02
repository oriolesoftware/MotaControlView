<style scoped>
    * {
        font-family: "站酷小薇LOGO体";
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

    .card-button {
        margin: 20px;
    }
</style>
<template>
    <div class="layout">
        <Layout class="layout">
            <Content style="height: 100%;padding: 2%" :style="background">
                <Modal v-model="statement" width="1200" :styles="{top: '60px'}">
                    <p slot="header" style="color:#f60;text-align:center;font-size:18px;">
                        <Icon type="ios-ribbon"></Icon>
                        <span>内容审查与免责声明</span>
                    </p>
                    <div style="font-size:15px;text-indent:30px">
                        <p style="color:#f60;text-align:center">第一部分</p>
                        <p>墨拓会采取必要的技术措施，确保侵权内容或违规内容不能在墨拓设备上印刷或留存。
                            若墨拓发现您打印、复印、扫描的文件、资料、书籍（包括但不限于列举的材料）内容存在或可能存在侵犯任何第三方知识产权或其他合法权益的情形，
                            或被认定或可能被认定为违规内容（定义见下文），墨拓有权在不经事先通知的情况下随时终止该侵权或违规内容的打印操作，并对证据进行留存，同时保留移交司法机关处理的权利。
                        </p>
                        <br/>
                        <p>若墨拓发现您反复打印侵权内容或违规内容，则墨拓有权随时停止为您提供服务，并采取包括移交司法机关处理等各种措施。</p>
                        <br/>
                        <p>违法信息是指违背《中华人民共和国宪法》和《全国人大常委会关于维护互联网安全的决定》、《互联网信息服务管理办法》所明文严禁的信息以及其它法律法规明文禁止传播的各类信息。对于以下内容（统称“违规内容”），墨拓必须予以终止操作并做证据留存处理：</p><br/>

                        <p>a) 反对宪法所确定的基本原则的；b) 危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；c) 损害国家荣誉和利益的；d) 煽动民族仇恨、民族歧视，破坏民族团结的；e)
                            破坏国家宗教政策，宣扬邪教和封建迷信的；f) 散布谣言，扰乱社会秩序，破坏社会稳定的；g) 散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；h)
                            侮辱或者诽谤他人，侵害他人合法权益的；i) 含有法律、行政法规禁止的其它内容的。
                        </p>
                        <p style="color:#f60;text-align:center">第二部分</p>
                        <p>
                            用户承诺对其上传或者使用墨拓设备打印的所有信息、内容（即属于《中华人民共和国著作权法》规定的作品，包括但不限于文字、图片等）均享有完整的知识产权，或者已经得到相关权利人的合法授权。</p>
                        <br/>

                        <p>
                            当第三方认为用户通过墨拓印刷的印刷物或通过墨拓设备制作的电子书侵犯其权利时，用户同意墨拓提供相关打印历史记录供相关机构调查取证，给涉嫌侵权的用户带来的任何损失，墨拓网不承担任何法律责任。如用户在使用墨拓设备时违反上述任何规定，墨拓网有权采取一切必要的措施（包括但不限于终止用户使用墨拓设备的权利、提供相关用户信息等）以减轻用户不当行为而造成的影响。由此给该用户带来的任何损失，墨拓网不承担任何法律责任。

                        </p>
                        <p style="color:#f60;text-align:center">第三部分</p>
                        <p>任何由于黑客攻击、电脑病毒侵入或政府管制而造成的暂时性网络服务终止或设备关闭，除正在进行的付费打印任务将退还费用外，对免费打印与其他业务墨拓不承担任何法律责任。</p>

                        <p>对免责声明的解释、修改及更新权均属于墨拓所有。</p>
                    </div>
                    <div slot="footer">
                        <Button type="warning" size="large" long @click="allow">我完全理解上述内容并接受</Button>
                    </div>
                </Modal>
                <Row>
                    <img src="../images/logo.png" width="240">
                    <p style="text-align:center;font-size: 18px;">MOTA校园 · 免费自助打印设备</p>
                    <p style="text-align:center;font-size: 40px;">请亲选择要执行的任务</p>
                </Row>
                <Row style="margin-top: 5%">
                    <Col span="8">
                        <Card v-on:click.native="" class="card-button">
                            <div style="min-height: 200px;">
                                <div style="text-align:center">
                                    <img src="../images/scanner.svg" width="120" height="120">
                                    <h2>我 要 扫 描</h2>
                                    <h3>Scanning</h3>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col span="8">
                        <Card v-on:click.native="print()" class="card-button">
                            <div style="min-height: 200px;">
                                <div style="text-align:center">
                                    <img src="../images/printer.svg" width="120" height="120">
                                    <h2>我 要 打 印</h2>
                                    <h3>Printing</h3>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Col span="8">
                        <Card v-on:click.native="" class="card-button">
                            <div style="min-height: 200px;">
                                <div style="text-align:center">
                                    <img src="../images/copy-machine.svg" width="120" height="120">
                                    <h2>我 要 复 印</h2>
                                    <h3>Copy</h3>
                                </div>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </Content>
            <Footer><p class="layout-footer-center">2018-2019 &copy; Oriole Software MOTA</p></Footer>
        </Layout>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                background: {
                    backgroundImage: "url(" + require("../images/background.svg") + ")",
                    backgroundPosition: "center",
                    backgroundSize: "100%",
                },
                statement: false,
                routerPath:"",
            }
        },
        mounted() {
            this.$root.randomCode = this.randomWord(false, 15)
        },
        methods: {
            randomWord(randomFlag, min, max) {
                let str = "";
                let range = min;
                let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

                // 随机产生
                if (randomFlag) {
                    range = Math.round(Math.random() * (max - min)) + min;
                }
                for (let i = 0; i < range; i++) {
                    let pos = Math.round(Math.random() * (arr.length - 1));
                    str += arr[pos];
                }
                return str;
            },
            print() {
                this.statement = true;
                this.routerPath='/UploadFile';
            },
            allow(){
                this.$router.push({path: this.routerPath});
            }
        }
    }
</script>