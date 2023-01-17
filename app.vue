<script setup lang="ts">
const config = useRuntimeConfig()
useHead({
  title: config.public.appTitle,
  meta: [
    { name: 'description', content: 'A chatbox application using OpenAI Completion endpoint to simulate conversation.' }
  ],
})
</script>

<template>
  <NuxtPage />
</template>
