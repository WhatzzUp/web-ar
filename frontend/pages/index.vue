<template>
  <v-row justify="center" align="center"> <Plain /> </v-row>
</template>

<script>
import { Component, Vue } from 'nuxt-property-decorator'
import Plain from '@/components/plain'
@Component({
  components: { Plain },
})
export default class IndexPage extends Vue {}
</script>
