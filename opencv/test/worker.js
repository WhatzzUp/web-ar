/* eslint-disable no-undef */
var netDet = undefined,
  netRecogn = undefined;
var persons = {};
onmessage = function (e) {
  switch (e.data.msg) {
    case "load": {
      // Import Webassembly script
      self.importScripts("./opencv.js");
      self.importScripts("./utils_worker.js");
      waitForOpencv(function (success) {
        console.log("success :>> ", success);
        if (success) {
          loadModels();
          postMessage({ msg: e.data.msg });
        } else throw new Error("Error on loading OpenCV");
      });
      break;
    }
    case "imageProcessing":
      return detectFaces(e.data);
    default:
      break;
  }
};

function loadModels(callback = () => {}) {
  var utils = new Utils("");
  console.log("utils :>> ", utils);
  var proto =
    "https://raw.githubusercontent.com/opencv/opencv/master/samples/dnn/face_detector/deploy_lowres.prototxt";
  var weights =
    "https://raw.githubusercontent.com/opencv/opencv_3rdparty/dnn_samples_face_detector_20180205_fp16/res10_300x300_ssd_iter_140000_fp16.caffemodel";
  var recognModel =
    "https://raw.githubusercontent.com/pyannote/pyannote-data/master/openface.nn4.small2.v1.t7";
  utils.createFileFromUrl("face_detector.prototxt", proto, () => {
    utils.createFileFromUrl("face_detector.caffemodel", weights, () => {
      utils.createFileFromUrl("face_recognition.t7", recognModel, () => {
        netDet = cv.readNetFromCaffe(
          "face_detector.prototxt",
          "face_detector.caffemodel"
        );
        netRecogn = cv.readNetFromTorch("face_recognition.t7");
        callback();
      });
    });
  });
}

function waitForOpencv(callbackFn, waitTimeMs = 30000, stepTimeMs = 1000) {
  if (cv.Mat) callbackFn(true);
  let timeSpentMs = 0;
  const interval = setInterval(() => {
    const limitReached = timeSpentMs > waitTimeMs;
    console.log("cv :>> ", cv);

    if (cv.Mat || limitReached) {
      clearInterval(interval);
      return callbackFn(!limitReached);
    } else {
      timeSpentMs += stepTimeMs;
    }
  }, stepTimeMs);
}

function imageProcessing({ msg, payload }) {
  console.log("payload :>> ", payload);
  const img = cv.matFromImageData(payload);
  let result = new cv.Mat();

  // This converts the image to a greyscale.
  cv.cvtColor(img, result, cv.COLOR_BGR2GRAY);
}
//! [Run face detection model]
function detectFaces({ msg, payload }) {
  console.time();

  console.log("payload !!!:>> ", payload);
  var frameBGR = new cv.Mat(payload.height, payload.width, cv.CV_8UC3);

  //   const img = cv.matFromImageData(payload);
  //   cv.cvtColor(img, img, cv.COLOR_RGBA2BGR);

  const img = cv.matFromImageData(payload);
  let result = new cv.Mat();

  // This converts the image to a greyscale.
  cv.cvtColor(img, img, cv.COLOR_RGBA2BGR);

  var blob = cv.blobFromImage(
    img,
    1,
    { width: 192, height: 144 },
    [104, 117, 123, 0],
    false,
    false
  );

  netDet.setInput(blob);
  console.timeEnd();

  var out = netDet.forward();

  var faces = [];
  for (var i = 0, n = out.data32F.length; i < n; i += 7) {
    var confidence = out.data32F[i + 2];
    var left = out.data32F[i + 3] * img.cols;
    var top = out.data32F[i + 4] * img.rows;
    var right = out.data32F[i + 5] * img.cols;
    var bottom = out.data32F[i + 6] * img.rows;
    left = Math.min(Math.max(0, left), img.cols - 1);
    right = Math.min(Math.max(0, right), img.cols - 1);
    bottom = Math.min(Math.max(0, bottom), img.rows - 1);
    top = Math.min(Math.max(0, top), img.rows - 1);

    if (confidence > 0.5 && left < right && top < bottom) {
      faces.push({
        x: left,
        y: top,
        width: right - left,
        height: bottom - top,
      });
    }
  }

  blob.delete();
  out.delete();
  tmp_face = [];

  faces.forEach(function (rect) {
    var face = img.roi(rect);
    var name = recognize(face);
    tmp_face.push({ rect, name });
  });
  img.delete();

  postMessage({ msg, payload: tmp_face });
}
function face2vec(face) {
  var blob = cv.blobFromImage(
    face,
    1.0 / 255,
    { width: 96, height: 96 },
    [0, 0, 0, 0],
    true,
    false
  );
  netRecogn.setInput(blob);
  var vec = netRecogn.forward();
  blob.delete();
  return vec;
}
//! [Get 128 floating points feature vector]

//! [Recognize]
function recognize(face) {
  var vec = face2vec(face);

  var bestMatchName = "unknown";
  var bestMatchScore = 0.5; // Actually, the minimum is -1 but we use it as a threshold.
  for (name in persons) {
    var personVec = persons[name];
    var score = vec.dot(personVec);
    if (score > bestMatchScore) {
      bestMatchScore = score;
      bestMatchName = name;
    }
  }
  vec.delete();
  return bestMatchName;
}
