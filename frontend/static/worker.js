/* eslint-disable no-undef */
/* eslint-disable camelcase */
let face_cascade, eye_cascade

function loadFaceDetectTrainingSet() {
  if (face_cascade === undefined) {
    face_cascade = new cv.CascadeClassifier()
    const load = face_cascade.load(
      '../../test/data/haarcascade_frontalface_default.xml'
    )
    console.log('load face detection training data', load)
  }
}

function loadEyesDetectTrainingSet() {
  if (eye_cascade == undefined) {
    eye_cascade = new cv.CascadeClassifier()
    const load = eye_cascade.load('../../test/data/haarcascade_eye.xml')
    console.log('load eye detection training data', load)
  }
}

function faceDetect(imageData) {
  loadFaceDetectTrainingSet()

  const img = cv.matFromArray(imageData, 24) // 24 for rgba

  const img_gray = new cv.Mat()
  cv.cvtColor(img, img_gray, cv.ColorConversionCodes.COLOR_RGBA2GRAY.value, 0)

  const faces = new cv.RectVector()
  const s1 = [0, 0]
  const s2 = [0, 0]
  face_cascade.detectMultiScale(img_gray, faces, 1.1, 3, 0, s1, s2)

  const rects = []

  for (let i = 0; i < faces.size(); i += 1) {
    const faceRect = faces.get(i)
    rects.push({
      x: faceRect.x,
      y: faceRect.y,
      width: faceRect.width,
      height: faceRect.height,
    })
  }

  postMessage({ features: rects })

  img.delete()
  faces.delete()
  img_gray.delete()
}

function eyesDetect(imageData) {
  loadFaceDetectTrainingSet()
  loadEyesDetectTrainingSet()

  const img = cv.matFromArray(imageData, 24) // 24 for rgba
  const img_gray = new cv.Mat()
  cv.cvtColor(img, img_gray, cv.ColorConversionCodes.COLOR_RGBA2GRAY.value, 0)

  const faces = new cv.RectVector()
  const s1 = [0, 0]
  const s2 = [0, 0]
  face_cascade.detectMultiScale(img_gray, faces, 1.1, 3, 0, s1, s2)

  const rects = []

  for (let i = 0; i < faces.size(); i += 1) {
    const faceRect = faces.get(i)
    const x = faceRect.x
    const y = faceRect.y
    const w = faceRect.width
    const h = faceRect.height

    rects.push({
      x,
      y,
      width: w,
      height: h,
    })

    const roiRect = new cv.Rect(x, y, w, h)
    const roi_gray = img_gray.getROI_Rect(roiRect)

    const eyes = new cv.RectVector()
    eye_cascade.detectMultiScale(roi_gray, eyes, 1.1, 3, 0, s1, s2)

    for (let j = 0; j < eyes.size(); j += 1) {
      const eyeRect = eyes.get(j)

      rects.push({
        x: x + eyeRect.x,
        y: y + eyeRect.y,
        width: eyeRect.width,
        height: eyeRect.height,
      })
    }

    eyes.delete()
    roi_gray.delete()
  }

  postMessage({ features: rects })

  img.delete()
  faces.delete()
  img_gray.delete()
}

self.onmessage = function (e) {
  switch (e.data.cmd) {
    case 'faceDetect':
      faceDetect(e.data.img)
      break
    case 'eyesDetect': {
      eyesDetect(e.data.img)
      break
    }
  }
}

self.onerror = function (e) {
  console.log(e)
}
console.log('done loading worker')
