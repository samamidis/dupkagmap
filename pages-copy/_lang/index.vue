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
    </div>
  </div>
</template>

<script>
export default {
  head() {
    return { title: this.$t('home.title') }
  }
}
</script>
