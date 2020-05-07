export default function ({ app: { $axios, $cookies } }) {
	$axios.defaults.baseURL = process.env.baseUrl
	$axios.defaults.timeout = 30000
	$axios.interceptors.request.use(config => {
		config.headers['X-Token'] = $cookies.get('token') || ''
		config.headers['X-Device-Id'] = $cookies.get('clientId') || ''
		config.headers['X-Uid'] = $cookies.get('userId') || ''
		return config
	})
	$axios.interceptors.response.use(response => {
		if (/^[4|5]/.test(response.status)) {
			return Promise.reject(response.statusText)
		}
		return response.data
	})
}