/* eslint-disable no-undef */

onmessage = function (e) {
  switch (e.data.msg) {
    case 'load': {
      // Import Webassembly script
      self.importScripts('../opencv.js')
      waitForOpencv(function (success) {
        if (success) {
          loadModels()
          postMessage({ msg: e.data.msg })
        } else throw new Error('Error on loading OpenCV')
      })
      break
    }
    case 'imageProcessing':
      return imageProcessing(e.data)
    default:
      break
  }
}

function loadModels(callback) {
  let utils = new Utils('')
  let proto =
    'https://raw.githubusercontent.com/opencv/opencv/master/samples/dnn/face_detector/deploy_lowres.prototxt'
  let weights =
    'https://raw.githubusercontent.com/opencv/opencv_3rdparty/dnn_samples_face_detector_20180205_fp16/res10_300x300_ssd_iter_140000_fp16.caffemodel'
  let recognModel =
    'https://raw.githubusercontent.com/pyannote/pyannote-data/master/openface.nn4.small2.v1.t7'
  utils.createFileFromUrl('face_detector.prototxt', proto, () => {
    document.getElementById('status').innerHTML =
      'Downloading face_detector.caffemodel'
    utils.createFileFromUrl('face_detector.caffemodel', weights, () => {
      document.getElementById('status').innerHTML = 'Downloading OpenFace model'
      utils.createFileFromUrl('face_recognition.t7', recognModel, () => {
        document.getElementById('status').innerHTML = ''
        netDet = cv.readNetFromCaffe(
          'face_detector.prototxt',
          'face_detector.caffemodel'
        )
        netRecogn = cv.readNetFromTorch('face_recognition.t7')
        callback()
      })
    })
  })
}

function waitForOpencv(callbackFn, waitTimeMs = 30000, stepTimeMs = 1000) {
  if (cv.Mat) callbackFn(true)
  let timeSpentMs = 0
  const interval = setInterval(() => {
    const limitReached = timeSpentMs > waitTimeMs
    console.log('this :>> ', this)

    if (cv.Mat || limitReached) {
      clearInterval(interval)
      return callbackFn(!limitReached)
    } else {
      timeSpentMs += stepTimeMs
    }
  }, stepTimeMs)
}
