<script setup lang="ts">
import type { Skill } from '../types';

const props = defineProps<{
  skills: Skill[];
}>();

const emit = defineEmits<{
  select: [skillId: string];
}>();

const selectSkill = (skillId: string) => {
  emit('select', skillId);
};
</script>

<template>
  <div class="w-full max-w-3xl">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div 
        v-for="skill in skills" 
        :key="skill.id"
        class="card card-bordered shadow-sm hover:shadow-md hover:translate-y-[-2px] transition-all duration-200 cursor-pointer"
        @click="selectSkill(skill.id)"
      >
        <div class="card-body">
          <h3 class="card-title">{{ skill.name }}</h3>
          <div class="flex justify-between text-sm mb-3">
            <div>
              <span class="font-medium">伤害:</span> 
              <span class="text-error">{{ skill.damage }}</span>
            </div>
            <div>
              <span class="font-medium">冷却:</span> 
              <span>{{ skill.cooldown }}回合</span>
            </div>
          </div>
          <div class="text-xs mb-4">
            {{ skill.description }}
          </div>
          <div class="card-actions justify-end">
            <button class="btn btn-info btn-block">选择</button>
          </div>
        </div>
      </div>
    </div>
    <div v-if="skills.length === 0" class="text-center italic py-10">
      没有可用的技能奖励
    </div>
  </div>
</template> 