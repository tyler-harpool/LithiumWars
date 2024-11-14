// src/components/game/BuildQueue.tsx

'use client';

import React from 'react';
import { useGameStore } from '@/lib/stores/gameStore';
import { Progress } from '@/components/ui/progress';

export function BuildQueue() {
  const { buildQueue, resourceGeneration } = useGameStore();

  return (
    <div className="fixed left-6 top-20 w-64 bg-black/20 backdrop-blur-sm rounded-lg p-4 space-y-4">
      {/* Resource Generation */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-white">Resource Generation</h3>
        <div className="flex justify-between text-sm text-white/80">
          <span>Primary: {resourceGeneration.primaryPerSecond}/s</span>
          <span>Secondary: {resourceGeneration.secondaryPerSecond}/s</span>
        </div>
      </div>

      {/* Build Queue */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-white">Build Queue</h3>
        {buildQueue.map((item) => (
          <div key={item.id} className="space-y-1">
            <div className="flex justify-between text-sm text-white/80">
              <span>{item.card.name}</span>
              <span>{Math.floor(item.progress)}%</span>
            </div>
            <Progress value={item.progress} className="h-1" />
          </div>
        ))}
      </div>
    </div>
  );
}
