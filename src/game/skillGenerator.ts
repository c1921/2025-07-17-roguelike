import type { Skill } from '../types';

// 技能模板
const skillTemplates: Skill[] = [
  {
    id: 'fireball',
    name: '火球术',
    damage: 20,
    cooldown: 3,
    currentCooldown: 0,
    description: '释放一个火球，造成20点伤害，冷却时间3回合'
  },
  {
    id: 'ice-spike',
    name: '冰刺',
    damage: 15,
    cooldown: 2,
    currentCooldown: 0,
    description: '释放一根冰刺，造成15点伤害，冷却时间2回合'
  },
  {
    id: 'lightning-bolt',
    name: '闪电箭',
    damage: 25,
    cooldown: 4,
    currentCooldown: 0,
    description: '释放一道闪电，造成25点伤害，冷却时间4回合'
  },
  {
    id: 'poison-dart',
    name: '毒镖',
    damage: 10,
    cooldown: 1,
    currentCooldown: 0,
    description: '投掷一枚毒镖，造成10点伤害，冷却时间1回合'
  },
  {
    id: 'heavy-slash',
    name: '重斩',
    damage: 30,
    cooldown: 5,
    currentCooldown: 0,
    description: '使用全力一击，造成30点伤害，冷却时间5回合'
  },
  {
    id: 'quick-stab',
    name: '快速刺击',
    damage: 8,
    cooldown: 1,
    currentCooldown: 0,
    description: '迅速刺击敌人，造成8点伤害，冷却时间1回合'
  },
  {
    id: 'meteor-strike',
    name: '陨石打击',
    damage: 40,
    cooldown: 7,
    currentCooldown: 0,
    description: '召唤一颗陨石，造成40点伤害，冷却时间7回合'
  },
  {
    id: 'wind-slash',
    name: '风刃',
    damage: 12,
    cooldown: 2,
    currentCooldown: 0,
    description: '释放一道风刃，造成12点伤害，冷却时间2回合'
  },
  {
    id: 'earth-spike',
    name: '地刺',
    damage: 18,
    cooldown: 3,
    currentCooldown: 0,
    description: '从地面刺出尖刺，造成18点伤害，冷却时间3回合'
  },
  {
    id: 'shadow-bolt',
    name: '暗影箭',
    damage: 22,
    cooldown: 4,
    currentCooldown: 0,
    description: '释放一道暗影能量，造成22点伤害，冷却时间4回合'
  }
];

// 生成随机技能奖励
export const generateSkillReward = (floor: number): Skill[] => {
  // 根据楼层决定技能的强度和数量
  const numSkills = Math.min(3, Math.max(1, Math.floor(floor / 5) + 1));
  const skills: Skill[] = [];
  
  // 创建一个技能模板的副本，以避免修改原始模板
  const availableSkills = [...skillTemplates];
  
  // 随机选择技能
  for (let i = 0; i < numSkills; i++) {
    if (availableSkills.length === 0) break;
    
    const randomIndex = Math.floor(Math.random() * availableSkills.length);
    const selectedSkill = { ...availableSkills[randomIndex] };
    
    // 根据楼层增强技能
    const floorBonus = Math.floor(floor / 3) * 0.1; // 每3层增加10%的伤害
    selectedSkill.damage = Math.floor(selectedSkill.damage * (1 + floorBonus));
    
    // 给技能一个唯一ID
    selectedSkill.id = `${selectedSkill.id}-${Date.now()}-${i}`;
    
    // 更新技能描述
    selectedSkill.description = `${selectedSkill.description.split('，')[0]}，造成${selectedSkill.damage}点伤害，冷却时间${selectedSkill.cooldown}回合`;
    
    skills.push(selectedSkill);
    
    // 从可用技能中移除已选择的技能
    availableSkills.splice(randomIndex, 1);
  }
  
  return skills;
}; 