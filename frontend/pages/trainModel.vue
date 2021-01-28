<template>
  <v-row justify="center" align="center"></v-row>
</template>

<script>
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import Plain from '@/components/plain'
const opencvStore = namespace('opencv')
@Component({
  components: { Plain },
})
export default class TrainModlePage extends Vue {
  @opencvStore.Action('initWebWorker') initWebWorker
  created() {
    alert()
    this.initWebWorker()
  }
}
</script>
