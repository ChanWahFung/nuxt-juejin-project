export default function ({ app: { $axios } }) {
	$axios.defaults.baseURL = 'http://127.0.0.1:8000'
	$axios.interceptors.request.use(config => {
		return config
	})
	$axios.interceptors.response.use(response => {
		return response.data
	})
}