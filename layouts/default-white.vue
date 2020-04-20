<template>
  <div style="background-color: #fff;min-height: 100vh;">
    <top-bar></top-bar>
    <main class="main">
      <nuxt />
    </main>
    <back-top></back-top>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState([
      'layoutBgColor'
    ])
  },
}
</script>

<style>
.main{
  max-width: 960px;
  margin: 0 auto;
  margin-top: 20px;
}
</style>
