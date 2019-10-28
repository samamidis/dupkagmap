<template>
  <div class="Content">
    <div class="container">
      <h1 class="Content__Title">
        {{ $t('home.title') }}
      </h1>
      <p>{{ $t('home.introduction') }}</p>
      <p>This is testing area index from inside -lang folder</p>
      <p>All content should be inside this folder</p>
      <p>{{$route.fullPath}}</p>
      <nuxt-link :to="localePath('user')">{{ $t('home') }}</nuxt-link>
      <!-- <v-btn @click="readFromFirestore">Klick</v-btn> -->
      <!-- <p>{{ profile }}</p> -->

    </div>
  </div>
</template>

<script>
import fireservice from '@/services/fireservice'

export default {
  components: {},

  async fetch({ store }) {
    if (!store.state.users.user) {
      store.dispatch('profile/resetProfile')
      return null
    } else {
      const profile = await fireservice.readProfile(store.state.users.user.uid)

      store.dispatch('profile/setProfile', profile)
      return profile
    }
  },
  head() {
    return { title: this.$t('home.title') }
  }
}
</script>
