// src/lib/game/abilitySystem.ts
import { Card, Ability } from '../types/game';

export type AbilityTarget = 'single' | 'all' | 'adjacent' | 'self';
export type AbilityTiming = 'onPlay' | 'onDeath' | 'onTurnStart' | 'onTurnEnd' | 'activated';

export interface AbilityEffect {
  type: 'damage' | 'heal' | 'buff' | 'draw' | 'spawn' | 'transform';
  value: number;
  duration?: number;
}

export interface EnhancedAbility extends Ability {
  targeting: AbilityTarget;
  timing: AbilityTiming;
  effect: AbilityEffect;
  animation: string;
}

export class AbilitySystem {
  static async resolveAbility(
    ability: EnhancedAbility,
    source: Card,
    targets: Card[],
    gameState: any
  ): Promise<void> {
    const effect = ability.effect;

    for (const target of targets) {
      switch (effect.type) {
        case 'damage':
          if (target.defense) {
            target.defense -= effect.value;
          }
          break;
        case 'heal':
          if (target.defense) {
            target.defense += effect.value;
          }
          break;
        case 'buff':
          if (target.attack) {
            target.attack += effect.value;
          }
          break;
        case 'draw':
          // Handled by game state
          break;
        case 'spawn':
          // Handled by game state
          break;
        case 'transform':
          // Handled by game state
          break;
      }
    }
  }
}
