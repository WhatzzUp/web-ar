/* eslint-disable no-undef */

onmessage = function (e) {
  switch (e.data.msg) {
    case 'load': {
      // Import Webassembly script
      self.importScripts('../opencv.js')
      waitForOpencv(function (success) {
        if (success) {
          console.log('cv :>> ', cv)
          console.log('face :>> ', cv.eigen())
          const eigen = cv.eigen.faceRecognizer()
          const fisher = cv.FisherFaceRecognizer()
          const lbph = cv.LBPHFaceRecognizer()
          console.log('eigen :>> ', eigen)
          console.log('fisher :>> ', fisher)
          console.log('lbph :>> ', lbph)
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
