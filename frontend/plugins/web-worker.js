// import OpencvWorker from '~/assets/js/wasm.worker.js' // worker files has to end in ".worker.js" - see nuxt.config.js
import OpencvWorker from '~/assets/js/opencv.worker.js' // worker files has to end in ".worker.js" - see nuxt.config.js

export default (context, inject) => {
  inject('worker', {
    createWorker() {
      return new OpencvWorker()
    },
  })
}
