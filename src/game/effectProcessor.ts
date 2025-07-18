import type { GameState, Skill, Effect } from '../types';

// 效果处理器接口
interface EffectProcessor {
  processEffect(gameState: GameState, effect: Effect): void;
}

// 伤害效果处理器
class DamageProcessor implements EffectProcessor {
  processEffect(gameState: GameState, effect: Effect): void {
    if (!gameState.currentEnemy) return;
    
    gameState.currentEnemy.hp -= effect.value;
  }
}

// 治疗效果处理器
class HealProcessor implements EffectProcessor {
  processEffect(gameState: GameState, effect: Effect): void {
    const target = effect.target || 'self';
    
    if (target === 'self') {
      gameState.player.hp = Math.min(gameState.player.hp + effect.value, gameState.player.maxHp);
    }
    // 可以添加其他目标的治疗逻辑
  }
}

// 效果处理器注册表
const effectProcessors: Record<string, EffectProcessor> = {
  'damage': new DamageProcessor(),
  'heal': new HealProcessor(),
};

// 处理技能效果
export function processSkillEffect(gameState: GameState, skill: Skill): void {
  for (const effect of skill.effects) {
    const processor = effectProcessors[effect.type];
    if (processor) {
      processor.processEffect(gameState, effect);
    }
  }
}

// 生成效果描述
export function generateEffectDescription(effect: Effect): string {
  switch (effect.type) {
    case 'damage':
      return `造成${effect.value}点伤害`;
    case 'heal':
      return `恢复${effect.value}点生命值`;
    default:
      return `${effect.type}效果(${effect.value})`;
  }
}

// 生成技能效果日志
export function generateEffectLog(effect: Effect, targetName?: string): string {
  switch (effect.type) {
    case 'damage':
      return `对${targetName || '敌人'}造成了${effect.value}点伤害`;
    case 'heal':
      return `恢复了${effect.value}点生命值`;
    default:
      return `产生了${effect.type}效果(${effect.value})`;
  }
} 