import { Module } from 'vuex'
import { RootState } from '../global'
import { Ability, reset } from 'v-access'
import { fetchUserAbilities } from '@/effects'
import VueRouter from 'vue-router'
import { RouteSetting } from '@/router'
import { UserApi } from '@/api'
import { AxiosResponse } from 'axios'

export interface UserState {
  accessToken: string
  client: string
  uid: string
  abilities: Ability[]
  routes: RouteSetting[]
}

export interface UserAbility {
  name: string
  uid: string
  create_at: string
}

export const userMutationTypes = {
  setToken: 'setToken',
  setUserAbilities: 'setUserAbilities',
  setUserRoutes: 'setUserRoutes'
}

const user: Module<UserState, RootState> = {
  namespaced: true,

  state: {
    accessToken: '',
    uid: '',
    client: '',
    abilities: [],
    // this is user private routes, not all routes
    routes: []
  },

  getters: {
    hasLogin({ accessToken }) {
      return Boolean(accessToken)
    }
  },

  mutations: {
    [userMutationTypes.setToken](state, { accessToken, uid, client }) {
      state.accessToken = accessToken
      state.uid = uid
      state.client = client
    },
    [userMutationTypes.setUserAbilities](state, abilities) {
      state.abilities = abilities
    },
    [userMutationTypes.setUserRoutes](state, routes) {
      state.routes = routes
    }
  },

  actions: {
    async login({ commit }, { username, password }): Promise<void> {
      const response: AxiosResponse = await UserApi.login(username, password)
      const accessToken = response.headers['access-token']
      const uid = response.headers['uid']
      const client = response.headers['client']

      response && commit('setToken', { accessToken, uid, client })
    },

    async fetchUserAbilities({ commit }) {
      const abilities = await fetchUserAbilities()

      if (abilities && abilities.length) {
        const abilitiesIds = abilities.map(
          (ability: Record<'name', string>) => ability.name
        )
        commit('setUserAbilities', abilitiesIds)
      }
    },

    async logout({ dispatch }, router: VueRouter) {
      reset(router)
      await dispatch('resetState', null, { root: true })
      router.push({
        name: 'Login'
      })
    }
  }
}

export default user
