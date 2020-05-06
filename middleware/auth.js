export default function ({ app, redirect }) {
  app.$api.isAuth().then(res => {
    if (res.s === 1 && res.d.isExpired) {
      redirect('/timeline?isExpried=true')
    }
  })
}