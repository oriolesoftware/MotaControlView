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
        <Layout class="layout" @mousedown.native="touchstart">
            <Content style="height: 100%;padding: 2%" :style="this.$root.background">
                <img src="../images/logo.png" width="450" style="margin:20px;">
                <Row style="align-items:center;display:flex;flex-direction:column;justify-content:center">
                    <img src="../images/fix.png" height="500"/>
                </Row>
            </Content>
            <Footer><p class="layout-footer-center">&copy; Copyright 2018-2019 Oriole(MOTA). All Rights Reserved.</p>
            </Footer>
        </Layout>
    </div>
</template>
<script>
    import * as axios from "axios";

    export default {
        data() {
            return {
                triggerCount:0,
            }
        },
        mounted() {
            clearInterval(this.$root.countdownClock);
        },
        methods: {
            touchstart(e) {
                if(this.triggerCount==4){
                    this.$router.push("/");
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
        }
    }
</script>