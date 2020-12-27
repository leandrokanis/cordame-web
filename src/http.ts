import axios from 'axios'
import qs from 'qs'
import { PERSISTED_STATE_KEY, REQUEST_BASE_URL } from '@/constants'

const instance = axios.create({
  baseURL: REQUEST_BASE_URL,
  paramsSerializer: function(params) {
    return qs.stringify(params, { indices: false })
  }
})

instance.interceptors.request.use(
  config => {
    const storage = localStorage.getItem(PERSISTED_STATE_KEY)
    const currentUser = storage && JSON.parse(storage)?.user

    config.headers = {
      'access-token': currentUser?.accessToken,
      client: currentUser?.client,
      uid: currentUser?.uid
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  response => response,
  error => {
    console.warn('Error status', error.response?.status)
    return Promise.reject(error)
  }
)

export const http = instance
