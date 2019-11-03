<template>
    <Button type="error" style="font-size:16px;"
            v-on:click="countdownDo()" v-if="showButton">
        <Icon type="md-exit"/>
        退出
        <span style="color: #FA8072">[{{this.$root.countdownReturnTime}} 秒]</span>
    </Button>
</template>

<script>
    export default {
        data(){
            return{
                showButton:true,
                router:"/",
            }
        },
        components: {
        },
        methods: {
            countDownStart(returnTime = 60, router = "/",showButton="true") {
                clearInterval(this.$root.countdownClock);
                this.router=router;
                this.showButton=showButton;
                this.$root.countdownReturnTime = returnTime;
                this.$root.countdownClock = window.setInterval(() => {
                    this.$root.countdownReturnTime--;
                    if (this.$root.countdownReturnTime < 0) {
                        this.countdownDo();
                    }
                }, 1000)
            },
            countdownDo() {
                clearInterval(this.$root.countdownClock);
                this.$router.push(this.router);
            },
            countdownReset(returnTime = 60) {
                this.$root.countdownReturnTime = returnTime;
            },
        }
    }
</script>

<style scoped>
</style>