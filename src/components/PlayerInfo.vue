<script setup lang="ts">
import type { Player } from '../types';

defineProps<{
  player: Player;
}>();
</script>

<template>
  <div class="card card-bordered shadow-sm">
    <div class="card-body">
      <p class="text-sm">玩家信息</p>
      <div>
        <div class="flex justify-between">
          <span class="font-medium">生命值: {{ player.hp }}/{{ player.maxHp }}</span>
          <span class="text-sm">{{ Math.floor((player.hp / player.maxHp) * 100) }}%</span>
        </div>
        <div class="progress w-full" role="progressbar" :aria-valuenow="Math.floor((player.hp / player.maxHp) * 100)" aria-valuemin="0" aria-valuemax="100">
          <div 
            class="progress-bar transition-all duration-300"
            :class="{
              'progress-success': player.hp / player.maxHp > 0.5,
              'progress-warning': player.hp / player.maxHp <= 0.5 && player.hp / player.maxHp > 0.25,
              'progress-error': player.hp / player.maxHp <= 0.25
            }"
            :style="{ width: `${(player.hp / player.maxHp) * 100}%` }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template> 