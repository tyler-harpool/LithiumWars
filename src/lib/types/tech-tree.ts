// src/lib/types/tech-tree.ts

import { Card, ResourceCard } from './game';

export type TechRequirement = {
  id: string;  // ID of required card/tech
  count?: number; // How many are needed (for units)
  level?: number; // For upgrades/tech levels
};

export type ResourceRequirement = {
  primary: number;
  secondary: number;
};

export interface TechTreeNode {
  id: string;
  name: string;
  description: string;
  category: 'unit' | 'resource' | 'technology';
  tier: number; // 1-3 for tech levels
  requirements: {
    resources: ResourceRequirement;
    tech?: TechRequirement[];
    units?: TechRequirement[];
  };
  unlocks?: string[]; // IDs of items this unlocks
  buildTime: number;
  card: Card | ResourceCard;
}

export interface TechTree {
  units: Record<string, TechTreeNode>;
  resources: Record<string, TechTreeNode>;
  technologies: Record<string, TechTreeNode>;
}
