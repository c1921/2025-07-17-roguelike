import type { Enemy } from '../types';

// 敌人名称列表
const enemyNames = [
  '小型史莱姆', '大型史莱姆', '骷髅战士', '骷髅弓箭手', '僵尸', 
  '幽灵', '地精', '地精射手', '兽人战士', '兽人萨满',
  '巨型蜘蛛', '毒蜘蛛', '石头怪', '火元素', '水元素',
  '风元素', '土元素', '狼人', '吸血鬼', '恶魔',
  '巨龙幼崽', '成年巨龙', '远古巨龙', '黑暗骑士', '巫妖'
];

// 生成敌人
export const generateEnemy = (floor: number): Enemy => {
  // 根据楼层计算敌人的属性
  const baseHp = 50 + floor * 10;
  const baseDamage = 5 + Math.floor(floor * 1.5);
  
  // 选择敌人名称
  const nameIndex = Math.min(Math.floor(floor / 2), enemyNames.length - 1);
  const name = enemyNames[nameIndex];
  
  // 添加一些随机性
  const randomFactor = 0.8 + Math.random() * 0.4; // 0.8 到 1.2 之间的随机数
  
  const enemy: Enemy = {
    id: `enemy-${floor}-${Date.now()}`,
    name: name,
    hp: Math.floor(baseHp * randomFactor),
    maxHp: Math.floor(baseHp * randomFactor),
    damage: Math.floor(baseDamage * randomFactor),
    rewards: {
      skills: [] // 技能奖励在战斗结束时由技能生成器生成
    }
  };
  
  return enemy;
}; 