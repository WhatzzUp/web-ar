import OpenCVWorker from '~/assets/js/opencv.worker.js'

export default (context, inject) => {
  inject('worker', {
    createWorker() {
      return new OpenCVWorker()
    },
  })
}
