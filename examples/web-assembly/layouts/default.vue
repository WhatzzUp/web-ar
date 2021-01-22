<template>
  <v-app dark>
    <nuxt></nuxt>
  </v-app>
</template>

<script>
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class Default extends Vue {
  worker
  status = {}
  /**
   * We will use this method privately to communicate with the worker and
   * return a promise with the result of the event. This way we can call
   * the worker asynchronously.
   */
  _dispatch(event) {
    const { msg } = event
    console.log('a', msg)
    console.log('this._status :>> ', this.status)
    this.status[msg] = ['loading']
    console.log('aB')

    this.worker.postMessage(event)
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        const status = this.status[msg]
        if (status[0] === 'done') resolve(status[1])
        if (status[0] === 'error') reject(status[1])
        if (status[0] !== 'loading') {
          delete this.status[msg]
          clearInterval(interval)
        }
      }, 50)
    })
  }

  async created() {
    if (process.browser) {
      // Remember workers just work in client?
      this.worker = this.$worker.createWorker() // Instruction assigned in plugin
      this.worker.addEventListener('message', this.workerResponseHandler)
      const test = await this._dispatch({ msg: 'load' })
      console.log('test :>> ', test)
    }
  }

  workerResponseHandler(event) {
    console.log('[WORKER REPONSE]', event.data)
  }
}
</script>
