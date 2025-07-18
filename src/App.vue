<script setup lang="ts">
import { onMounted } from 'vue';
import GameContainer from './components/GameContainer.vue';

onMounted(() => {
  setTimeout(() => window.HSStaticMethods?.autoInit(), 100);
});
</script>

<template>
  <div class="min-h-screen">
    <GameContainer />
  </div>
</template>

