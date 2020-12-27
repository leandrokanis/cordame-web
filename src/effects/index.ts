import { createInitiator } from './initiator'
import { REQUEST_BASE_URL, REQUEST_TIMEOUT_THRESHOLD } from '../constants'
import { UserAbility } from '@/store/modules/user'

const { http } = createInitiator({
  baseURL: REQUEST_BASE_URL,
  timeout: REQUEST_TIMEOUT_THRESHOLD
})

const enum Routes {
  userLogin = '/v1/users/sign_in',
  userAbilities = '/user/abilities'
}

export function userLogin(username: string, password: string) {
  return http.post<Record<'token', string>, Record<'token', string>>(
    Routes.userLogin,
    {
      user: {
        email: username,
        password
      }
    }
  )
}

export function fetchUserAbilities() {
  return http.get<UserAbility[], UserAbility[]>(Routes.userAbilities)
}
