import authConfig from '~/assets/authConfig'

export default function ({ app: { $axios } }) {
	$axios.defaults.baseURL = process.env.baseUrl
	$axios.defaults.timeout = 30000
	$axios.interceptors.request.use(config => {
		config.headers['X-Token'] = authConfig.token
		config.headers['X-Device-Id'] = authConfig.deviceId
		config.headers['X-Uid'] = authConfig.uid
		return config
	})
	$axios.interceptors.response.use(response => {
		if (/^[4|5]/.test(response.status)) {
			return Promise.reject(response.statusText)
		}
		return response.data
	})
}