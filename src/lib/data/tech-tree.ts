// src/lib/data/tech-tree.ts

import { TechTree } from '../types/tech-tree';
import { RESOURCE_CONSTANTS } from '../stores/gameStore';

export const TECH_TREE: TechTree = {
  units: {
    'basic-infantry': {
      id: 'basic-infantry',
      name: 'Basic Infantry',
      description: 'Standard infantry unit',
      category: 'unit',
      tier: 1,
      requirements: {
        resources: { primary: 50, secondary: 0 },
      },
      unlocks: ['advanced-infantry'],
      buildTime: 10,
      card: {
        id: 'basic-infantry',
        name: 'Basic Infantry',
        type: 'unit',
        faction: 'mechanist',
        cost: 50,
        attack: 2,
        defense: 2,
        abilities: [],
        rarity: 'common',
      }
    },
    'advanced-infantry': {
      id: 'advanced-infantry',
      name: 'Advanced Infantry',
      description: 'Upgraded infantry with better armor',
      category: 'unit',
      tier: 2,
      requirements: {
        resources: { primary: 100, secondary: 25 },
        tech: [{ id: 'advanced-armor', level: 1 }],
        units: [{ id: 'basic-infantry', count: 2 }]
      },
      buildTime: 15,
      card: {
        id: 'advanced-infantry',
        name: 'Advanced Infantry',
        type: 'unit',
        faction: 'mechanist',
        cost: 100,
        attack: 4,
        defense: 4,
        abilities: [{
          id: 'reinforced-armor',
          name: 'Reinforced Armor',
          description: 'Reduces incoming damage by 1',
          cost: 0
        }],
        rarity: 'rare',
      }
    }
  },
  resources: {
    'basic-generator': {
      id: 'basic-generator',
      name: 'Basic Generator',
      description: 'Generates primary resources',
      category: 'resource',
      tier: 1,
      requirements: {
        resources: { primary: 50, secondary: 0 }
      },
      unlocks: ['advanced-generator'],
      buildTime: 5,
      card: {
        id: 'basic-generator',
        name: 'Basic Generator',
        type: 'primary',
        value: 2,
        cost: 50,
        faction: 'neutral',
        abilities: [],
      }
    },
    'miner': {
      id: 'basic-miner',
      name: 'Miner',
      description: 'Mines primary resources',
      category: 'resource',
      tier: 1,
      requirements: {
        resources: { primary: 5, secondary: 0 }
      },
      unlocks: ['advanced-generator'],
      buildTime: 5,
      card: {
        id: 'basic-generator',
        name: 'Basic Generator',
        type: 'primary',
        value: 2,
        cost: 5,
        faction: 'neutral',
        abilities: [],
      }
    }
  },
  technologies: {
    'advanced-armor': {
      id: 'advanced-armor',
      name: 'Advanced Armor',
      description: 'Unlocks better armor for units',
      category: 'technology',
      tier: 1,
      requirements: {
        resources: { primary: 150, secondary: 50 },
        units: [{ id: 'basic-infantry', count: 3 }]
      },
      unlocks: ['advanced-infantry'],
      buildTime: 20,
      card: {
        id: 'advanced-armor',
        name: 'Advanced Armor',
        type: 'effect',
        faction: 'mechanist',
        cost: 150,
        abilities: [{
          id: 'armor-upgrade',
          name: 'Armor Upgrade',
          description: 'Permanently improves armor technology',
          cost: 0
        }],
        rarity: 'rare',
      }
    }
  }
};
