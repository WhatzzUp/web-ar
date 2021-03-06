/* eslint-disable no-undef */
const Module = {}
Module.onRuntimeInitialized = function () {
  postMessage({ msg: 'wasm' })
}
importScripts('../cv-wasm.js', 'worker.js')
