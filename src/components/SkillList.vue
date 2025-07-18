<script setup lang="ts">
import type { Skill } from '../types';

defineProps<{
  skills: Skill[];
}>();
</script>

<template>
  <div class="card card-bordered shadow-sm">
    <div class="card-body">
      <p class="card-title">技能列表</p>
      <div class="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
        <div 
          v-for="skill in skills" 
          :key="skill.id"
          class="card card-compact p-3 transition-all duration-200"
          :class="{ 
            'border-l-4 border-info': skill.currentCooldown === 0, 
            'border-l-4 border-gray-300 opacity-75': skill.currentCooldown > 0 
          }"
        >
          <div class="flex justify-between items-center mb-2">
            <h3 class="text-base font-medium">{{ skill.name }}</h3>
            <div v-if="skill.cooldown > 0" class="badge badge-sm"
              :class="{
                'badge-success': skill.currentCooldown === 0,
                'badge-error': skill.currentCooldown > 0
              }">
              <span v-if="skill.currentCooldown > 0">
                冷却中 ({{ skill.currentCooldown }})
              </span>
              <span v-else>
                已就绪
              </span>
            </div>
          </div>
          <div class="flex justify-between text-sm mb-1.5">
            <div>
              <span class="font-medium">伤害:</span> 
              <span class="text-error">{{ skill.damage }}</span>
            </div>
            <div>
              <span class="font-medium">冷却时间:</span> 
              <span>{{ skill.cooldown }} 回合</span>
            </div>
          </div>
          <div class="text-xs">
            {{ skill.description }}
          </div>
        </div>
        <div v-if="skills.length === 0" class="text-center italic py-5">
          你还没有学会任何技能
        </div>
      </div>
    </div>
  </div>
</template> 