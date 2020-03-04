<template>
  <div class="container">
    <div>
      <logo />
      <el-button type="primary">
        <nuxt-link to="/about">about</nuxt-link>
      </el-button>
    </div>
  </div>
</template>

<script>
import Logo from "@/components/Logo.vue";

export default {
  components: {
    Logo
  },
  asyncData(context) {
    context.app.$axios
      .get("test")
    return {
      list: [{ name: "test" }]
    };
  },
  data() {
    return {
      list: []
    };
  },
  created() {
    console.log(this.$api)
  }
};
</script>

<style lang="scss" scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
