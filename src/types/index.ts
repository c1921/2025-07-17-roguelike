export interface Effect {
  type: string;     // 效果类型：damage, heal, buff等
  value: number;    // 效果数值
  duration?: number; // 效果持续时间（可选，用于持续效果）
  target?: string;  // 效果目标（可选，如self, enemy, all等）
}

export interface Skill {
  id: string;
  name: string;
  effects: Effect[];  // 一个技能可以有多个效果
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
  currentTurn: 'player' | 'enemy'; // 当前是谁的回合
  turnCount: number; // 回合计数器
} 