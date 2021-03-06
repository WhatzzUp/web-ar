<template>
  <v-app>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { Component, Vue } from 'nuxt-property-decorator'
@Component({
  components: {},
})
export default class DefaultLayout extends Vue {}
</script>
<style>
html,
body {
  margin: 0;
  padding: 0;
}
</style>
