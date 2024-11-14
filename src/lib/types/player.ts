// src/lib/types/player.ts
export interface Player {
  id: string;
  name: string;
  faction: Faction;
  deck: Card[];
  hand: Card[];
  field: Card[];
  resources: {
    primary: number;
    secondary: number;
  };
}
