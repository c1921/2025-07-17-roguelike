<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { gameState, startGame, startNewFloor, startAutoBattle, executeBattleTurn, selectSkillReward, playerAction, enemyAction } from '../game/gameLogic';
import PlayerInfo from './PlayerInfo.vue';
import EnemyInfo from './EnemyInfo.vue';
import BattleLog from './BattleLog.vue';
import SkillList from './SkillList.vue';
import SkillRewards from './SkillRewards.vue';

// 自动战斗的间隔ID
const autoBattleIntervalId = ref<number | null>(null);

// 模态框ID
const modalId = 'skill-rewards-modal';

// 控制模态框显示状态和返回按钮显示
const isModalHidden = ref(true);

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

// 执行单次行动（根据当前回合决定是玩家行动还是敌人行动）
const handleExecuteTurn = () => {
  if (gameState.currentTurn === 'player') {
    playerAction();
  } else {
    enemyAction();
  }
};

// 选择技能奖励
const handleSelectSkill = (skillId: string) => {
  selectSkillReward(skillId);
  
  // 隐藏模态框
  hideModal();
  
  // 自动进入下一层
  handleNextFloor();
};

// 跳过选择技能，直接进入下一层
const handleSkipSelection = () => {
  // 清空技能奖励列表，确保模态框不会再次显示
  gameState.availableSkillRewards = [];
  
  // 隐藏模态框
  hideModal();
  
  // 进入下一层
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

// 显示模态框
const showModal = () => {
  nextTick(() => {
    const openButton = document.getElementById('open-modal-btn');
    if (openButton) {
      openButton.click();
      isModalHidden.value = false;
    }
  });
};

// 隐藏模态框
const hideModal = () => {
  nextTick(() => {
    const closeButton = document.querySelector(`button[data-overlay="#${modalId}"]`);
    if (closeButton) {
      (closeButton as HTMLElement).click();
      isModalHidden.value = true;
    }
  });
};

// 监听游戏状态变化，当有奖励技能时自动打开模态框
watch(() => gameState.availableSkillRewards.length, (newLength) => {
  if (newLength > 0) {
    showModal();
  }
});

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
      <div v-if="gameState.isInBattle" class="text-md mt-1">
        回合: {{ gameState.turnCount + 1 }} | 
        <span :class="{'text-primary font-bold': gameState.currentTurn === 'player', 'text-error': gameState.currentTurn === 'enemy'}">
          {{ gameState.currentTurn === 'player' ? '玩家行动' : '敌人行动' }}
        </span>
      </div>
    </div>

    <!-- 顶部：玩家和敌人信息 -->
    <div class="flex flex-row gap-4 mb-5">
      <div class="w-1/2" :class="{'border-4 border-primary rounded-lg': gameState.currentTurn === 'player' && gameState.isInBattle}">
        <PlayerInfo :player="gameState.player" />
      </div>
      <div class="w-1/2" :class="{'border-4 border-error rounded-lg': gameState.currentTurn === 'enemy' && gameState.isInBattle}">
        <div v-if="gameState.isInBattle && gameState.currentEnemy">
          <EnemyInfo :enemy="gameState.currentEnemy" />
        </div>
        <div v-else class="card card-bordered shadow-sm h-full">
          <div class="card-body flex items-center justify-center">
            <p class="text-center text-gray-500">等待下一个敌人...</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 中间：技能列表或游戏控制按钮 -->
    <div class="mb-5">
      <div v-if="!gameState.isInBattle && gameState.availableSkillRewards.length === 0"
        class="flex flex-col items-center justify-center min-h-40">
        <button @click="handleStartGame" class="btn btn-primary px-8 py-3 text-lg">
          开始新游戏
        </button>

        <button v-if="gameState.floor > 0" @click="handleNextFloor" class="btn btn-success mt-5 px-8 py-3 text-lg">
          进入下一层
        </button>
      </div>
      <div v-else>
        <SkillList :skills="gameState.player.skills" />

        <div class="flex justify-center mt-5" v-if="gameState.isInBattle">
          <div class="join">
            <button @click="handleExecuteTurn" :disabled="autoBattleIntervalId !== null"
              class="btn join-item" 
              :class="{
                'btn-primary': gameState.currentTurn === 'player',
                'btn-error': gameState.currentTurn === 'enemy',
                'btn-disabled': autoBattleIntervalId !== null
              }">
              {{ gameState.currentTurn === 'player' ? '玩家行动' : '敌人行动' }}
            </button>
            <button @click="handleStartAutoBattle" class="btn join-item"
              :class="autoBattleIntervalId !== null ? 'btn-error' : 'btn-success'">
              {{ autoBattleIntervalId !== null ? '停止自动战斗' : '开始自动战斗' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 返回按钮 - 当模态框隐藏且有技能奖励时显示 -->
    <div v-if="isModalHidden && gameState.availableSkillRewards.length > 0" class="flex justify-center mt-5">
      <button @click="showModal" class="btn btn-info px-8 py-3 text-lg">
        返回选择技能
      </button>
    </div>

    <!-- 底部：战斗日志 -->
    <div>
      <BattleLog :logs="gameState.battleLogs" />
    </div>

    <!-- 模态框触发按钮 (隐藏) -->
    <button id="open-modal-btn" type="button" class="hidden" data-overlay="#skill-rewards-modal">
      打开模态框
    </button>

    <!-- 技能奖励模态框 -->
    <div id="skill-rewards-modal"
      class="overlay modal overlay-open:opacity-100 overlay-open:duration-300 hidden [--overlay-backdrop:static]"
      role="dialog" tabindex="-1">
      <div class="modal-dialog modal-dialog-lg">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">选择一个新技能</h3>
            <button type="button" class="btn btn-text btn-circle btn-sm absolute end-3 top-3" aria-label="Close"
              data-overlay="#skill-rewards-modal" @click="isModalHidden = true">
              <span class="icon-[tabler--x] size-4">×</span>
            </button>
          </div>
          <div class="modal-body">
            <SkillRewards :skills="gameState.availableSkillRewards" @select="handleSelectSkill" />
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-soft btn-secondary" data-overlay="#skill-rewards-modal"
              @click="isModalHidden = true">
              暂时关闭
            </button>
            <button type="button" class="btn btn-primary" @click="handleSkipSelection">
              跳过此次选择
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template> 