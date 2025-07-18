<script setup lang="ts">
import type { Skill, Effect } from '../types';

defineProps<{
  skills: Skill[];
}>();

const emit = defineEmits<{
  select: [skillId: string];
}>();

const selectSkill = (skillId: string) => {
  emit('select', skillId);
};

// 获取效果标签文本
const getEffectLabel = (effect: Effect): string => {
  switch (effect.type) {
    case 'damage': return '伤害:';
    case 'heal': return '治疗:';
    default: return `${effect.type}:`;
  }
};

// 获取效果CSS类
const getEffectClass = (effect: Effect): string => {
  switch (effect.type) {
    case 'damage': return 'text-error';
    case 'heal': return 'text-success';
    default: return 'text-info';
  }
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
          <h3 class="text-sm">{{ skill.name }}</h3>
          <div class="flex flex-wrap gap-2">
            <div v-for="(effect, index) in skill.effects" :key="index" class="badge badge-sm">
              <span class="font-medium">{{ getEffectLabel(effect) }}</span> 
              <span :class="getEffectClass(effect)">{{ effect.value }}</span>
              <span v-if="effect.duration">({{ effect.duration }}回合)</span>
            </div>
            <div class="badge badge-sm">
              <span class="font-medium">冷却:</span> 
              <span>{{ skill.cooldown }}回合</span>
            </div>
          </div>
          <div class="text-xs">
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