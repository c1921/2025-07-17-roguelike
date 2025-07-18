<script setup lang="ts">
import type { BattleLog } from '../types';

defineProps<{
  logs: BattleLog[];
}>();
</script>

<template>
  <div class="card card-bordered shadow-sm">
    <div class="card-body">
      <p class="text-sm">战斗日志</p>
      <div class="h-40 overflow-y-auto flex flex-col">
        <div 
          v-for="(log, index) in logs" 
          :key="`${log.timestamp}-${index}`"
          class="p-2 rounded text-sm animate-fade-in"
          :class="{
            'bg-success/10 border-l-4 border-success': log.type === 'player',
            'bg-danger/10 border-l-4 border-danger': log.type === 'enemy',
            'bg-info/10 border-l-4 border-info': log.type === 'system'
          }"
        >
          <span>{{ log.message }}</span>
        </div>
        <div v-if="logs.length === 0" class="text-center italic py-5">
          战斗日志将在这里显示...
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(-5px); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-fade-in {
  animation: fade-in 0.3s ease;
}
</style> 