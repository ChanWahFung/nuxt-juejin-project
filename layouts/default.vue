<template>
  <div style="background-color: #f4f4f4;min-height: 100vh;">
    <top-bar></top-bar>
    <main class="main">
      <nuxt />
    </main>
    <back-top></back-top>
  </div>
</template>

<script>
export default {
}
</script>

<style>
.main{
  max-width: 960px;
  margin: 0 auto;
  margin-top: 20px;
}
</style>
