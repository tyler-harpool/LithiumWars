// src/lib/game/combatSystem.ts
import { Card } from '../types/game';

export interface CombatResult {
  success: boolean;
  damage: number;
  survived: boolean;
  effects: CombatEffect[];
}

export type CombatEffect = {
  type: 'damage' | 'heal' | 'buff' | 'debuff';
  value: number;
  target: Card;
};

export class CombatSystem {
  static calculateDamage(attacker: Card, defender: Card): CombatResult {
    if (!defender.defense || !attacker.attack) {
      return { success: false, damage: 0, survived: true, effects: [] };
    }

    const damage = attacker.attack;
    const survived = defender.defense > damage;
    const effects: CombatEffect[] = [
      {
        type: 'damage',
        value: damage,
        target: defender
      }
    ];

    // Add combat effects based on abilities
    attacker.abilities?.forEach(ability => {
      if (ability.name.includes('Pierce')) {
        effects.push({
          type: 'debuff',
          value: 1,
          target: defender
        });
      }
    });

    return {
      success: true,
      damage,
      survived,
      effects
    };
  }
}
