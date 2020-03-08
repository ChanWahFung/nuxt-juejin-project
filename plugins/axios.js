export default function ({ app: { $axios } }) {
	// 数据访问前缀
	$axios.defaults.baseURL = 'http://127.0.0.1:8000'
	$axios.interceptors.request.use(config => {
		return config
	})
	$axios.interceptors.response.use(response => {
		return response.data
	})
}