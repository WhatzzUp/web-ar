/* eslint-disable no-undef */

// onmessage = function (e) {
//   console.log('e.data :>> ', e.data)
//   switch (e.data.msg) {
//     case 'load': {
//       // Import Webassembly script
//       self.importScripts('./opencv.js')
//       waitForOpencv(function (success) {
//         if (success) postMessage({ msg: e.data.msg })
//         else throw new Error('Error on loading OpenCV')
//       })
//       break
//     }
//     default:
//       break
//   }
// }

function waitForOpencv(callbackFn, waitTimeMs = 30000, stepTimeMs = 100) {
  if (cv.Mat) callbackFn(true)

  console.log('cv :>> ', cv)
  cv()
  let timeSpentMs = 0
  const interval = setInterval(() => {
    const limitReached = timeSpentMs > waitTimeMs
    console.log('cv :>> ', cv.Mat)

    if (cv.Mat || limitReached) {
      clearInterval(interval)
      return callbackFn(!limitReached)
    } else {
      timeSpentMs += stepTimeMs
    }
  }, stepTimeMs)
}
self.addEventListener('message', (event) => {
  console.log('event :>> ', event)
  switch (event.data.msg) {
    case 'load': {
      try {
        self.importScripts('../opencv.js')
        // Import Webassembly script
        waitForOpencv( (success)=> {
          console.log('success :>> ', success)
          if (success) postMessage({ msg: e.data.msg })
          else throw new Error('Error on loading OpenCV')
        })
      } catch (error) {
        console.log('error :>> ', error)
      }

      break
    }
    default:
      break
  }
})
