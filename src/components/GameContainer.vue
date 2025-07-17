<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { gameState, startGame, startNewFloor, startAutoBattle, executeBattleTurn, selectSkillReward } from '../game/gameLogic';
import PlayerInfo from './PlayerInfo.vue';
import EnemyInfo from './EnemyInfo.vue';
import BattleLog from './BattleLog.vue';
import SkillList from './SkillList.vue';
import SkillRewards from './SkillRewards.vue';

// 自动战斗的间隔ID
const autoBattleIntervalId = ref<number | null>(null);

// 开始自动战斗
const handleStartAutoBattle = () => {
  if (autoBattleIntervalId.value) {
    clearInterval(autoBattleIntervalId.value);
    autoBattleIntervalId.value = null;
    return;
  }
  
  const interval = startAutoBattle();
  if (interval) {
    autoBattleIntervalId.value = interval;
  }
};

// 执行单次战斗回合
const handleExecuteTurn = () => {
  executeBattleTurn();
};

// 选择技能奖励
const handleSelectSkill = (skillId: string) => {
  selectSkillReward(skillId);
  
  // 自动进入下一层
  handleNextFloor();
};

// 进入下一层
const handleNextFloor = () => {
  // 记录之前是否开启了自动战斗
  const wasAutoBattleEnabled = autoBattleIntervalId.value !== null;
  
  // 确保清除之前的自动战斗定时器
  if (autoBattleIntervalId.value) {
    clearInterval(autoBattleIntervalId.value);
    autoBattleIntervalId.value = null;
  }
  
  startNewFloor();
  
  // 如果之前开启了自动战斗，则自动开启新的自动战斗
  if (wasAutoBattleEnabled) {
    const interval = startAutoBattle();
    if (interval) {
      autoBattleIntervalId.value = interval;
    }
  }
};

// 开始新游戏
const handleStartGame = () => {
  // 确保清除之前的自动战斗定时器
  if (autoBattleIntervalId.value) {
    clearInterval(autoBattleIntervalId.value);
    autoBattleIntervalId.value = null;
  }
  
  startGame();
};

// 组件挂载时开始游戏
onMounted(() => {
  startGame();
});

// 组件卸载时清除自动战斗定时器
onUnmounted(() => {
  if (autoBattleIntervalId.value) {
    clearInterval(autoBattleIntervalId.value);
  }
});
</script>

<template>
  <div class="container mx-auto p-5">
    <div class="text-center mb-5">
      <div class="text-lg mt-2">当前层数: {{ gameState.floor }}</div>
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-4 gap-5">
      <div class="md:col-span-1">
        <PlayerInfo :player="gameState.player" />
        <SkillList :skills="gameState.player.skills" />
      </div>
      
      <div class="md:col-span-2">
        <div v-if="gameState.isInBattle && gameState.currentEnemy" class="flex flex-col items-center">
          <EnemyInfo :enemy="gameState.currentEnemy" />
          
          <div class="join mt-5">
            <button 
              @click="handleExecuteTurn" 
              :disabled="autoBattleIntervalId !== null"
              class="btn btn-primary join-item"
              :class="{'btn-disabled': autoBattleIntervalId !== null}"
            >
              执行回合
            </button>
            <button 
              @click="handleStartAutoBattle"
              class="btn join-item"
              :class="autoBattleIntervalId !== null ? 'btn-error' : 'btn-success'"
            >
              {{ autoBattleIntervalId !== null ? '停止自动战斗' : '开始自动战斗' }}
            </button>
          </div>
        </div>
        
        <div v-else-if="gameState.availableSkillRewards.length > 0" class="flex flex-col items-center">
          <div class="card card-bordered shadow-sm w-full mb-5">
            <div class="card-body">
              <h2 class="card-title justify-center">选择一个新技能</h2>
            </div>
          </div>
          <SkillRewards 
            :skills="gameState.availableSkillRewards" 
            @select="handleSelectSkill" 
          />
          
          <button @click="handleNextFloor" class="btn btn-primary mt-5 px-8 py-3 text-lg">
            进入下一层
          </button>
        </div>
        
        <div v-else class="flex flex-col items-center justify-center min-h-80">
          <button @click="handleStartGame" class="btn btn-primary px-8 py-3 text-lg">
            开始新游戏
          </button>
          
          <button 
            v-if="gameState.floor > 0" 
            @click="handleNextFloor" 
            class="btn btn-success mt-5 px-8 py-3 text-lg"
          >
            进入下一层
          </button>
        </div>
      </div>
      
      <div class="md:col-span-1">
        <BattleLog :logs="gameState.battleLogs" />
      </div>
    </div>
  </div>
</template> 