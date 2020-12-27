import { http } from '@/http'
import { Routes } from '@/api'

function login(username: string, password: string) {
  const body = {
    user: {
      email: username,
      password
    }
  }

  return http.post(Routes.userLogin, body)
}

export const UserApi = {
  login
}
