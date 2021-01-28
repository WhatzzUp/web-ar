// store.js
export const state = () => ({
  worker: null,
  status: {},
})

export const mutations = {
  SET_STATE(state, { name, value }) {
    state[name] = value
  },

  SET_STATUS(state, { value, msg }) {
    state.status[msg] = value
  },
}

export const actions = {
  setState({ commit }, payload) {
    commit('SET_STATE', payload)
  },

  setStatus({ commit }, payload) {
    commit('SET_STATUS', payload)
  },
  /**
   * We will use this method privately to communicate with the worker and
   * return a promise with the result of the event. This way we can call
   * the worker asynchronously.
   */
  sendWorkerMessage({ state, dispatch }, payload) {
    const { msg } = payload
    state.status[msg] = ['loading']
    dispatch('setStatus', { value: ['loading'], msg })

    state.worker.postMessage(payload)
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        const status = state.status[msg]
        if (status[0] === 'done') resolve(status[1])
        if (status[0] === 'error') reject(status[1])
        if (status[0] !== 'loading') {
          delete state.status[msg]
          clearInterval(interval)
        }
      }, 50)
    })
  },

  imageProcessing({ dispatch }, payload) {
    return dispatch('sendWorkerMessage', { msg: 'imageProcessing', payload })
  },

  async initWebWorker({ dispatch, state, commit }, payload) {
    if (process.browser) {
      // Remember workers just work in client?
      const worker = this.$worker.createWorker() // Instruction assigned in plugin
      console.log('worker :>> ', worker)
      dispatch('setState', { name: 'worker', value: worker })
      state.worker.addEventListener('message', workerResponseHandler.bind(this))
      await dispatch('sendWorkerMessage', { msg: 'load' })
    }
  },
}
function workerResponseHandler(event) {
  this.dispatch('opencv/setStatus', { value: ['done'], msg: event.data.msg })
  console.log('[WORKER REPONSE]', event.data)
}
export const getters = {
  worker: (_state) => _state.worker,
}
