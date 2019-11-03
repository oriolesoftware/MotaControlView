<template>
    <div class="layout">
        <Layout class="layout" v-on:click.native="start()">
            <Carousel class="layout" autoplay v-model="carousel" loop :autoplay-speed="10000" height="auto">
                <CarouselItem v-for="list in carouselList">
                    <div class="demo-carousel">
                        <img :src="'http://localhost:8999/getControlScreenADImg?picName='+list.adPicFile" :width="screenWidth" :height="screenHeight"/>
                    </div>
                </CarouselItem>
            </Carousel>
        </Layout>
    </div>
</template>
<script>
    import * as axios from "axios";

    export default {
        data() {
            return {
                carousel: 0,
                screenWidth: document.documentElement.clientWidth,
                screenHeight: document.documentElement.clientHeight,
                carouselList:[],
            }
        },
        mounted(){
            axios({
                method: 'get',
                url: 'http://localhost:8999/getControlScreenADImgList',
            }).then((response) => {
                this.carouselList=response.data;
            })
        },
        methods: {
          start(){
              this.$router.push("/");
          }
        }
    }
</script>

<style scoped>
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
</style>