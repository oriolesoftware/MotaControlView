<style scoped>
    * {
        font-family: "PingFang SC Semibold";
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
        <Layout class="layout" @click.native="countdownReset()" @mousedown.native="touchstart">
            <Content style="height: 100%;padding: 2%" :style="this.$root.background">
                <v-exception ref="exceptionModel"></v-exception>
                <Modal v-model="adminModel" width="720px">
                    <p slot="header" style="color:#2b85e4;text-align:center">
                        <Icon type="ios-information-circle"></Icon>
                        <span>管理员模式</span>
                    </p>
                    <div style="display: flex;align-items:center;flex-direction:column">
                        <img src="../images/admin.png" width="120">
                        <p style="text-align:center;font-size: 18px;margin: 10px">请选择需要执行的操作（设备ID:{{this.$root.deviceID}}）</p>
                        <div style="flex-direction:row">
                            <Button type="warning" size="large"  @click="exitAndShutdown" style="margin: 10px">立刻关闭设备电源(60s倒计时)</Button>
                            <Button type="warning" size="large"  @click="exitAndRebooting" style="margin: 10px">立刻重启设备(60s倒计时)</Button>
                            <Button type="warning" size="large"  @click="exit" style="margin: 10px">立刻退出MOTA控制系统</Button>
                            <Button type="warning" size="large"  @click="stopServer" style="margin: 10px">立刻停用设备</Button>
                        </div>
                    </div>
                </Modal>
                <Modal v-model="aboutModel" fullscreen>
                    <p slot="header" style="color:#2b85e4;text-align:center">
                        <Icon type="ios-information-circle"></Icon>
                        <span>关于本系统</span>
                    </p>
                    <div style="display: flex;align-items:center;flex-direction:column">
                        <img src="../images/about.png" width="720">
                    </div>
                    <div slot="footer">
                        <p class="layout-footer-center">2018-2019 &copy; Oriole Software MOTA 长沙点墨文化传媒有限公司</p>
                    </div>
                </Modal>
                <Modal v-model="adminLoginModel" width="720px">
                    <p slot="header" style="color:#2b85e4;text-align:center">
                        <Icon type="ios-information-circle"></Icon>
                        <span>管理员模式</span>
                    </p>
                    <div style="display: flex;align-items:center;flex-direction:column">
                        <img src="../images/admin.png" width="120">
                        <p style="text-align:center;font-size: 18px;margin-top: 10px">请输入管理员密码（设备ID:{{this.$root.deviceID}}）</p>
                        <p style="margin-bottom: 10px">若您非墨拓设备管理员请立刻退出本页面</p>
                        <Input v-model="password" size="large" placeholder="请输入本机密码"
                               style="width: 300px;margin-bottom: 20px;" />
                        <v-keyboard v-on:updatekey="getPassword"></v-keyboard>
                    </div>
                    <div slot="footer">
                        <Button type="success" size="large" @click="checkPassword()">确认
                        </Button>
                    </div>
                </Modal>
                <Modal v-model="statement" width="800" :styles="{top: '40px'}">
                    <p slot="header" style="color:#f60;text-align:center;font-size:16px;">
                        <Icon type="ios-ribbon"></Icon>
                        <span>内容审查与免责声明</span>
                    </p>
                    <div style="font-size:12px;text-indent:20px">
                        <p style="color:#f60;text-align:center">第一部分</p>
                        <p>墨拓会采取必要的技术措施，确保侵权内容或违规内容不能在墨拓设备上印刷或留存。
                            若墨拓发现您打印、复印、扫描的文件、资料、书籍（包括但不限于列举的材料）内容存在或可能存在侵犯任何第三方知识产权或其他合法权益的情形，
                            或被认定或可能被认定为违规内容（定义见下文），墨拓有权在不经事先通知的情况下随时终止该侵权或违规内容的打印操作，并对证据进行留存，同时保留移交司法机关处理的权利。
                        </p>
                        <br/>
                        <p>若墨拓发现您反复打印侵权内容或违规内容，则墨拓有权随时停止为您提供服务，并采取包括移交司法机关处理等各种措施。</p>
                        <br/>
                        <p>
                            违法信息是指违背《中华人民共和国宪法》和《全国人大常委会关于维护互联网安全的决定》、《互联网信息服务管理办法》所明文严禁的信息以及其它法律法规明文禁止传播的各类信息。对于以下内容（统称“违规内容”），墨拓必须予以终止操作并做证据留存处理：</p>
                        <br/>

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
                    <p style="text-align:right;font-size: 14px;color: #000000;">墨拓自助控制终端 V2.1.3 Bate (20191031Update正式版)</p>
                    <img src="../images/logo.png" width="450" style="margin:20px;">
                    <p style="text-align:center;font-size: 18px;color: #000000;">MOTA校园 · 永久免费自助打印</p>
                    <p style="text-align:center;font-size: 40px;margin-top:10px;color: #000000;">请选择需要进行的操作</p>
                </Row>
                <Row style="margin-top: 3%">
                    <Col span="8">
                        <Card v-on:click.native="showClause('scan')" class="card-button">
                            <div style="display:flex;justify-content: center;align-items: center;flex-direction:column;">
                                <img src="../images/scanner.svg" style="margin:10px;" width="130" height="130">
                                <h2>我 要 扫 描</h2>
                                <h3>Scan</h3>
                            </div>

                        </Card>
                    </Col>
                    <Col span="8">
                        <Card v-on:click.native="showClause('print')" class="card-button">
                            <div style="display:flex;justify-content: center;align-items: center;flex-direction:column;">
                                <img src="../images/printer.svg" style="margin:10px;" width="130" height="130">
                                <h2>我 要 打 印</h2>
                                <h3>Print</h3>
                            </div>
                        </Card>
                    </Col>
                    <Col span="8">
                        <Card v-on:click.native="showClause('copy')" class="card-button">
                            <div style="display:flex;justify-content: center;align-items: center;flex-direction:column;">
                                <img src="../images/copy-machine.svg" style="margin:10px;" width="130" height="130">
                                <h2>我 要 复 印</h2>
                                <h3>Copy</h3>
                            </div>
                        </Card>
                    </Col>
                </Row>
                <Row style="display:flex;justify-content: center;align-items: center;">
                    <img src="../images/index_notice.png" width="600" style="margin:20px;">
                </Row>
            </Content>
            <Footer><p class="layout-footer-center">2018-2019 &copy; Oriole Software MOTA 长沙点墨文化传媒有限公司</p>
                <Button type="primary" style="font-size:16px;position: absolute; right: 10px; bottom:10px;" v-on:click="showAbout()">
                    <Icon type="md-jet" />
                    关于 点墨传媒
                </Button>
                <v-countdownButton ref="countdown" style="position: absolute; right: 10px; bottom:10px;"></v-countdownButton>
            </Footer>
        </Layout>
    </div>
</template>

<script>
    import * as axios from "axios";
    import ExceptionModel from '../components/ExceptionModel.vue';
    import CountdownButton from '../components/CountdownButton.vue';
    import Keyboard from '../components/Keyboard.vue';

    export default {
        components:{
            'v-exception':ExceptionModel,
            'v-countdownButton':CountdownButton,
            'v-keyboard': Keyboard,
        },
        data() {
            return {
                statement: false,
                routerPath: "",
                type: "",
                triggerCount:0,
                adminLoginModel:false,
                adminModel:false,
                password:"",
                aboutModel:false,
            }
        },
        mounted() {
            this.$refs.countdown.countDownStart(30,"/Carousel",false);
            this.$root.randomCode = this.randomWord(false, 15);
            this.getDeviceID();
            this.getServerUrl();
        },
        methods: {
            countdownReset() {
                this.$refs.countdown.countdownReset(30);
            },
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
            getDeviceID(){
                axios({
                    method: 'get',
                    url: 'http://localhost:8999/getDeviceID',
                }).then((response) => {
                    this.$root.deviceID=response.data;
                }).catch((reason) => {
                    this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode,reason.toString());
                });
            },
            getServerUrl(){
                axios({
                    method: 'get',
                    url: 'http://localhost:8999/getServerUrl',
                }).then((response) => {
                    this.$root.serverUrl=response.data;
                    this.$root.websocketUrl=response.data.replace(/http/, "ws");
                }).catch((reason) => {
                    this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode,reason.toString());
                });
            },
            showClause(type) {
                this.statement = true;
                this.type = type;

            },
            allow() {
                clearInterval(this.countdownClock);
                this.$router.push({
                    name: this.type == 'print' ? 'UploadFile' : 'Scan',
                    params: {
                        //转跳并传递参数设备路径参数
                        type: this.type,
                    }
                });
            },

            touchstart(e) {
                if(this.triggerCount==4){
                    this.adminLoginModel=true;
                }
                let triggerRange=100;
                if(e.clientY<triggerRange&&e.clientX<triggerRange){
                    this.triggerCount=1;
                }
                if(e.clientY<triggerRange&&document.documentElement.clientWidth-e.clientX<triggerRange&&this.triggerCount==1){
                    this.triggerCount=2;
                }
                if(document.documentElement.clientHeight-e.clientY<triggerRange&&document.documentElement.clientWidth-e.clientX<triggerRange&&this.triggerCount==2){
                    this.triggerCount=3;
                }
                if(document.documentElement.clientHeight-e.clientY<triggerRange&&e.clientX<triggerRange&&this.triggerCount==3){
                    this.triggerCount=4;
                }
            },

            showAbout(){
                this.aboutModel=true;
            },

            getPassword(val){
                this.password = val;
            },
            checkPassword(){
                axios({
                    method: 'get',
                    url: 'http://localhost:8999/getPassword',
                }).then((response) => {
                    if(response.data==this.password){
                        this.adminLoginModel=false;
                        this.adminModel=true;
                    }else{
                        this.$Modal.confirm({
                            title: '密码错误',
                            content: '请核对您的密码，确保输入正确！',
                            okText: '确认',
                            onOk: () => {
                                this.$Modal.remove();
                            },
                        });
                    }
                }).catch((reason) => {
                    this.closeAllModel();
                    this.$refs.exceptionModel.openExceptionModel(this.$root.randomCode,reason.toString());
                });
            },
            exit(){
                axios({
                    method: 'get',
                    url: 'http://localhost:8999/exit',
                })
            },
            exitAndShutdown(){
                axios({
                    method: 'get',
                    url: 'http://localhost:8999/exitAndShutdown',
                })
            },
            exitAndRebooting(){
                axios({
                    method: 'get',
                    url: 'http://localhost:8999/exitAndRebooting',
                })
            },
            stopServer(){
                this.closeAllModel();
                this.$refs.exceptionModel.openExceptionModel("ADMIN", "STOP SERVER - 管理员终止了本台设备运行", 10001, "STOP",true);
            },
            closeAllModel(){
                this.adminLoginModel=false;
                this.adminModel=false;
            }
        }
    }
</script>