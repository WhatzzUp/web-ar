<template>
  <a-scene>
    <a-assets timeout="30000">
      <!-- Model source: https://sketchfab.com/3d-models/spinosaurus-2135501583704537907645bf723685e7
             Model author: https://sketchfab.com/VapTor
             Model license: CC Attribution -->
      <a-asset-item
        id="spinosaurus"
        src="https://cdn.glitch.com/324a5290-5aa7-4efc-92d6-ae0736433b12%2Fspinosaurus.glb"
        response-type="arraybuffer"
      ></a-asset-item>
    </a-assets>

    <a-camera position="0 1.2 0"></a-camera>



    <a-entity id="dino" position="-1 0 -3" scale="0.5 0.5 0.5">
      <a-entity
        position="0 2.15 0"
        rotation="0 55 0"
        gltf-model="#spinosaurus"
        animation-mixer
        shadow="cast: true; receive: false"
      ></a-entity>
    </a-entity>

    <a-entity light="type: ambient; intensity: 0.5;"></a-entity>
    <a-light
      type="directional"
      light="castShadow: true;
                      shadowMapHeight: 1024;
                      shadowMapWidth: 1024;
                      shadowCameraLeft: -7;
                      shadowCameraRight: 5;
                      shadowCameraBottom: -5;
                      shadowCameraTop: 5;"
      id="light"
      target="dino"
      position="-5 3 1.5"
    ></a-light>

    <!-- This shadow-receiving plane is only visible in AR mode. -->
    <a-plane
      height="15"
      width="15"
      position="0 0 -3"
      rotation="-90 0 0"
      shadow="receive: true"
      ar-shadows="opacity: 0.3"
      visible="false"
    ></a-plane>
  </a-scene>
</template>

<script>
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class Default extends Vue {
  videoWidth
  videoHeight
  video
  qvga = { width: { exact: 320 }, height: { exact: 240 } }

  vga = { width: { exact: 640 }, height: { exact: 480 } }

  resolution = window.innerWidth < 640 ? this.qvga : this.vga

  // whether streaming video from the camera.
  streaming = false

  canvasOutput
  canvasOutputCtx
  stream = null

  detectFace = document.getElementById('face')
  detectEye = document.getElementById('eye')

  info = document.getElementById('info')

  created() {
    if (
      window.location.protocol === 'http:' &&
      window.location.hostname !== 'localhost' &&
      window.location.hostname !== '127.0.0.1' &&
      window.location.hostname !== '[::1]'
    ) {
      window.location = window.location.href.replace('http:', 'https:')
    }
  }

  mounted() {
    // this.video = document.getElementById('video')
    // this.canvasOutput = document.getElementById('canvasOutput')
    // this.canvasOutputCtx = this.canvasOutput.getContext('2d')
    // this.startCamera()
  }
}
</script>
