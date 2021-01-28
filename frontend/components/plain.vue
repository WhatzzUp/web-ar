<template>
  <div id="main">
    <div class="vid_container">
      <video class="video" autoplay></video>
      <canvas class="canvas"></canvas>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from 'nuxt-property-decorator'
import Stats from 'stats.js'
const VIDEO_SIZE = 500

@Component({
  components: {},
})
export default class Plain extends Vue {
  stats = null
  video = null
  canvas = null
  ctx = null
  mobile = this.isMobile()
  isMobile() {
    const isAndroid = /Android/i.test(navigator.userAgent)
    const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
    return isAndroid || isiOS
  }

  hasGetUserMedia() {
    // Note: Opera builds are unprefixed.
    return !!(
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia
    )
  }

  renderPrediction() {
    this.stats.begin()
    console.log('this.video.videoWidth :>> ', this.video.videoWidth)
    this.ctx.drawImage(
      this.video,
      0,
      0,
      this.video.videoWidth,
      this.video.videoHeight,
      0,
      0,
      this.canvas.width,
      this.canvas.height
    )
    this.stats.end()
    requestAnimationFrame(this.renderPrediction)
  }

  initStats() {
    this.stats = new Stats()
    document.getElementById('main').appendChild(this.stats.dom)
    this.stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
  }

  mounted() {
    this.initStats()
  }

  async created() {
    if (this.hasGetUserMedia()) {
      console.log('navigator :>> ', navigator)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: {
            facingMode: 'user',
            // Only setting the video to a specified size in order to accommodate a
            // point cloud, so on mobile devices accept the default size.
            width: this.mobile ? undefined : VIDEO_SIZE,
            height: this.mobile ? undefined : VIDEO_SIZE,
          },
        })
        this.video = document.querySelector('video')
        this.video.srcObject = stream
        this.canvas = document.querySelector('canvas')
        this.ctx = this.canvas.getContext('2d')
        this.renderPrediction()
      } catch (error) {}
    } else {
      alert('getUserMedia() is not supported in your browser')
    }
  }

  onFailSoHard(e) {
    console.log('Reeeejected!', e)
  }
}
</script>
<style scoped>
.vid_container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.canvas {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
}
.video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
}
</style>
