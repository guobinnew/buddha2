<template>
    <div class="container">
        <el-carousel :interval="4000" type="card" height="400px">
          <el-carousel-item v-for="item in photos" :key="item">
            <img style="width:100%;" :src="item"></img>
          </el-carousel-item>s
        </el-carousel>
    </div>
</template>

<style scoped>
.container {
  overflow: hidden;
  height: 80%;
  padding-top: 50px;
}

.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 400px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>

<script>
export default {
  data: function() {
    return {
      photos: [
        "img/splash1.png",
        "img/splash2.jpg",
        "img/splash3.png",
        "img/splash4.png"
      ]
    };
  },
  mounted: function() {}
};
</script>
