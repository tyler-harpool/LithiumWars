'use client';

import React from 'react';
import { useGameStore } from '@/lib/stores/gameStore';
import { Progress } from '@/components/ui/progress';

export function BuildQueue() {
  const { buildQueue, resourceGeneration } = useGameStore();

  // Debug logging
  React.useEffect(() => {
    console.log('Current build queue:', buildQueue);
  }, [buildQueue]);

  return (
    <div className="fixed left-6 top-20 w-64 bg-black/20 backdrop-blur-sm rounded-lg p-4 space-y-4">
      {/* Resource Generation */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-white">Resource Generation</h3>
        <div className="flex justify-between text-sm text-white/80">
          <span>Primary: {resourceGeneration.primaryPerSecond.toFixed(1)}/s</span>
          <span>Secondary: {resourceGeneration.secondaryPerSecond.toFixed(1)}/s</span>
        </div>
      </div>

      {/* Build Queue */}
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-white">Build Queue</h3>
        {buildQueue.length === 0 ? (
          <div className="text-sm text-white/50 italic">Queue is empty</div>
        ) : (
          buildQueue.map((item) => (
            <div key={item.id} className="space-y-1 bg-black/20 p-2 rounded-lg">
              <div className="flex justify-between text-sm text-white/80">
                <span className="font-medium">{item.card.name}</span>
                <span className="bg-black/30 px-2 rounded">
                  {Math.floor(item.progress)}%
                </span>
              </div>
              <div className="relative pt-1">
                <Progress
                  value={item.progress}
                  className="h-1.5 bg-slate-700/50"
                />
                <div
                  className="absolute bottom-0 left-0 h-1.5 bg-blue-500 rounded-full transition-all duration-100 ease-out"
                  style={{
                    width: `${item.progress}%`,
                    transition: 'width 100ms linear'
                  }}
                />
              </div>
              <div className="text-xs text-white/50 mt-1">
                Time remaining: {Math.ceil((item.buildTime - (Date.now() - item.startTime) / 1000))}s
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
