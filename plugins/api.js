export default ({ app }, inject) => {
  inject('api', {
    token: '123'
  })
  inject('api2', {
    token: '1234'
  })
}