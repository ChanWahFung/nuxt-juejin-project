<template>
  <div>
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
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI',
    Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

.main{
  max-width: 960px;
  margin: 0 auto;
  margin-top: 20px;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
</style>
