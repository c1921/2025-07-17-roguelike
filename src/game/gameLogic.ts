import { reactive } from 'vue';
import type { GameState } from '../types';
import { generateEnemy } from './enemyGenerator';
import { generateSkillReward } from './skillGenerator';
import { processSkillEffect, generateEffectLog } from './effectProcessor';

// 初始化游戏状态
const gameState = reactive<GameState>({
  player: {
    hp: 100,
    maxHp: 100,
    skills: [
      {
        id: 'basic-attack',
        name: '基本攻击',
        effects: [
          { type: 'damage', value: 10 }
        ],
        cooldown: 0,
        currentCooldown: 0,
        description: '一次基本攻击，造成10点伤害'
      },
      {
        id: 'healing-light',
        name: '治疗之光',
        effects: [
          { type: 'heal', value: 15, target: 'self' }
        ],
        cooldown: 3,
        currentCooldown: 0,
        description: '恢复15点生命值，冷却时间3回合'
      }
    ],
    lastUsedSkillIndex: -1 // 记录上一次使用的技能索引
  },
  currentEnemy: null,
  battleLogs: [],
  floor: 1,
  isInBattle: false,
  availableSkillRewards: [],
  currentTurn: 'player', // 默认玩家先行动
  turnCount: 0
});

// 添加战斗日志
const addBattleLog = (message: string, type: 'player' | 'enemy' | 'system') => {
  gameState.battleLogs.unshift({
    message,
    type,
    timestamp: Date.now()
  });

  // 限制日志数量
  if (gameState.battleLogs.length > 50) {
    gameState.battleLogs.pop();
  }
};

// 开始新的一层
const startNewFloor = () => {
  gameState.floor += 1;
  gameState.isInBattle = true;
  gameState.currentEnemy = generateEnemy(gameState.floor);
  
  // 重置所有技能的冷却
  gameState.player.skills.forEach(skill => {
    skill.currentCooldown = 0;
  });
  
  // 重置上一次使用的技能索引
  gameState.player.lastUsedSkillIndex = -1;
  
  // 重置回合状态
  gameState.currentTurn = 'player';
  gameState.turnCount = 0;
  
  addBattleLog(`进入第 ${gameState.floor} 层，遇到了 ${gameState.currentEnemy.name}！`, 'system');
  addBattleLog('你的回合开始了！', 'system');
};

// 切换回合
const switchTurn = () => {
  if (gameState.currentTurn === 'player') {
    setTimeout(() => {
      gameState.currentTurn = 'enemy';
      addBattleLog(`${gameState.currentEnemy!.name}的回合开始了！`, 'system');
    }, 500);
  } else {
    setTimeout(() => {
      gameState.currentTurn = 'player';
      gameState.turnCount++; // 每当玩家回合开始时增加回合计数
      
      // 减少所有技能的冷却时间
      gameState.player.skills.forEach(skill => {
        if (skill.currentCooldown > 0) {
          skill.currentCooldown -= 1;
        }
      });
      
      addBattleLog('你的回合开始了！', 'system');
    }, 500);
  }
};

// 玩家行动
const playerAction = () => {
  if (!gameState.isInBattle || !gameState.currentEnemy || gameState.currentTurn !== 'player') return false;
  
  let skillUsed = false;
  
  // 循环使用技能，从上一次使用的技能的下一个开始
  const skillsCount = gameState.player.skills.length;
  let startIndex = (gameState.player.lastUsedSkillIndex! + 1) % skillsCount;
  let currentIndex = startIndex;
  
  do {
    const skill = gameState.player.skills[currentIndex];
    
    if (skill.currentCooldown <= 0) {
      // 使用技能
      processSkillEffect(gameState, skill);
      
      // 生成效果日志
      const effectLogs: string[] = [];
      
      for (const effect of skill.effects) {
        if (effect.type === 'damage') {
          effectLogs.push(generateEffectLog(effect, gameState.currentEnemy.name));
        } else {
          effectLogs.push(generateEffectLog(effect));
        }
      }
      
      // 添加战斗日志
      addBattleLog(`你使用了 ${skill.name}，${effectLogs.join('，')}！`, 'player');
      
      // 设置冷却
      skill.currentCooldown = skill.cooldown;
      skillUsed = true;
      
      // 更新上一次使用的技能索引
      gameState.player.lastUsedSkillIndex = currentIndex;
      break;
    }
    
    // 尝试下一个技能
    currentIndex = (currentIndex + 1) % skillsCount;
  } while (currentIndex !== startIndex && !skillUsed);
  
  // 如果没有技能可用，跳过回合
  if (!skillUsed) {
    addBattleLog('你没有可用的技能，跳过回合！', 'player');
  }
  
  // 检查敌人是否被击败
  if (gameState.currentEnemy.hp <= 0) {
    addBattleLog(`你击败了 ${gameState.currentEnemy.name}！`, 'system');
    endBattle(true);
    return true;
  }
  
  // 切换到敌人回合
  switchTurn();
  return true;
};

// 敌人行动
const enemyAction = () => {
  if (!gameState.isInBattle || !gameState.currentEnemy || gameState.currentTurn !== 'enemy') return false;
  
  // 敌人攻击
  const enemyDamage = gameState.currentEnemy.damage;
  gameState.player.hp -= enemyDamage;
  addBattleLog(`${gameState.currentEnemy.name} 攻击了你，造成了 ${enemyDamage} 点伤害！`, 'enemy');
  
  // 检查玩家是否被击败
  if (gameState.player.hp <= 0) {
    addBattleLog('你被击败了！游戏结束！', 'system');
    endBattle(false);
    return true;
  }
  
  // 切换到玩家回合
  switchTurn();
  return true;
};

// 自动战斗回合
const battleTick = () => {
  if (!gameState.isInBattle) return;
  
  // 检查当前回合，执行相应的行动
  if (gameState.currentTurn === 'player') {
    playerAction();
  } else if (gameState.currentTurn === 'enemy') {
    enemyAction();
  }
};

// 结束战斗
const endBattle = (victory: boolean) => {
  gameState.isInBattle = false;
  
  if (victory && gameState.currentEnemy) {
    // 生成技能奖励
    gameState.availableSkillRewards = generateSkillReward(gameState.floor);
    addBattleLog('你获得了选择新技能的机会！', 'system');
  } else {
    // 游戏结束，重置游戏
    resetGame();
  }
};

// 选择技能奖励
const selectSkillReward = (skillId: string) => {
  const selectedSkill = gameState.availableSkillRewards.find(s => s.id === skillId);
  if (selectedSkill) {
    gameState.player.skills.push(selectedSkill);
    addBattleLog(`你学会了新技能：${selectedSkill.name}！`, 'system');
    gameState.availableSkillRewards = [];
  }
};

// 重置游戏
const resetGame = () => {
  gameState.player.hp = gameState.player.maxHp;
  gameState.player.skills = [
    {
      id: 'basic-attack',
      name: '基本攻击',
      effects: [
        { type: 'damage', value: 10 }
      ],
      cooldown: 0,
      currentCooldown: 0,
      description: '一次基本攻击，造成10点伤害'
    },
    {
      id: 'healing-light',
      name: '治疗之光',
      effects: [
        { type: 'heal', value: 15, target: 'self' }
      ],
      cooldown: 3,
      currentCooldown: 0,
      description: '恢复15点生命值，冷却时间3回合'
    }
  ];
  gameState.player.lastUsedSkillIndex = -1; // 重置上一次使用的技能索引
  gameState.currentEnemy = null;
  gameState.battleLogs = [];
  gameState.floor = 0;
  gameState.isInBattle = false;
  gameState.availableSkillRewards = [];
  gameState.currentTurn = 'player';
  gameState.turnCount = 0;
  
  addBattleLog('新的冒险开始了！', 'system');
};

// 开始游戏
const startGame = () => {
  resetGame();
  startNewFloor();
};

// 自动战斗
const startAutoBattle = () => {
  if (!gameState.isInBattle) return null;
  
  const interval = setInterval(() => {
    if (!gameState.isInBattle) {
      clearInterval(interval);
      return;
    }
    
    // 检查当前回合，执行相应的行动
    if (gameState.currentTurn === 'player') {
      playerAction();
    } else if (gameState.currentTurn === 'enemy') {
      enemyAction();
    }
  }, 1000); // 每秒检查一次
  
  return interval;
};

// 执行单次战斗回合
const executeBattleTurn = () => {
  if (gameState.isInBattle) {
    battleTick();
  }
};

export {
  gameState,
  startGame,
  startNewFloor,
  startAutoBattle,
  executeBattleTurn,
  selectSkillReward,
  resetGame,
  playerAction,
  enemyAction
}; 