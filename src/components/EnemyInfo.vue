<script setup lang="ts">
import type { Enemy } from '../types';

defineProps<{
  enemy: Enemy;
}>();
</script>

<template>
  <div class="card card-bordered shadow-sm w-full">
    <div class="card-body">
      <p class="text-sm justify-center">{{ enemy.name }}</p>
      <div class="space-y-2">
        <div>
          <div class="flex justify-between">
            <span class="font-medium">生命值: {{ enemy.hp }}/{{ enemy.maxHp }}</span>
            <span class="text-sm">{{ Math.floor((enemy.hp / enemy.maxHp) * 100) }}%</span>
          </div>
          <div class="progress w-full" role="progressbar" :aria-valuenow="Math.floor((enemy.hp / enemy.maxHp) * 100)" aria-valuemin="0" aria-valuemax="100">
            <div 
              class="progress-bar transition-all duration-300"
              :class="{
                'progress-error': enemy.hp / enemy.maxHp > 0.5,
                'progress-warning': enemy.hp / enemy.maxHp <= 0.5
              }"
              :style="{ width: `${(enemy.hp / enemy.maxHp) * 100}%` }"
            ></div>
          </div>
        </div>
        <div class="flex items-center">
          <span class="font-medium mr-2">攻击力:</span> 
          <span class="badge badge-error">{{ enemy.damage }}</span>
        </div>
      </div>
    </div>
  </div>
</template> 