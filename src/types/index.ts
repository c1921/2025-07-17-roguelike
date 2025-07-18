export interface Skill {
  id: string;
  name: string;
  damage: number;
  cooldown: number;
  currentCooldown: number;
  description: string;
}

export interface Enemy {
  id: string;
  name: string;
  hp: number;
  maxHp: number;
  damage: number;
  rewards: {
    skills: Skill[];
  };
}

export interface Player {
  hp: number;
  maxHp: number;
  skills: Skill[];
  lastUsedSkillIndex?: number; // 添加跟踪上一次使用技能的索引
}

export interface BattleLog {
  message: string;
  type: 'player' | 'enemy' | 'system';
  timestamp: number;
}

export interface GameState {
  player: Player;
  currentEnemy: Enemy | null;
  battleLogs: BattleLog[];
  floor: number;
  isInBattle: boolean;
  availableSkillRewards: Skill[];
} 