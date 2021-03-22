import Vue from 'vue'
import Vuex from 'vuex'

import { userStore } from './user.store.js'
import { socketStore } from './socket.store.js'
import { boardStore } from './board.store.js'

Vue.use(Vuex)

export const store = new Vuex.Store({
  strict: true,
  modules: {
    userStore,
    socketStore,
    boardStore
  },
  state: {
  },
  mutations: {
  },
  actions: {
  }
})
