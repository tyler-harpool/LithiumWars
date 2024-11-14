'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { PlayerHand } from './PlayerHand';
import { CardField } from './CardField';
import { ResourceDisplay } from './ResourceDisplay';
import { useGameStore } from '@/lib/stores/gameStore';
import { Button } from '@/components/ui/button';
import { Timer } from './Timer';
import { BuildQueue } from './BuildQueue';
import { Card, ResourceCard } from '@/lib/types/game';
import { cn } from '@/lib/utils';

export function GameBoard() {
  const {
    playerField,
    opponentField,
    currentPhase,
    initiateCombat,
    resolveCombat,
    endCombatPhase,
    endTurn,
    drawCard,
    addToBuildQueue,
    handleResourceCardUse,
    addPrimaryResource,    // Note the singular form
    addSecondaryResource,  // Note the singular form
    actionsRemaining,
    primaryResource,
    gameLoop
  } = useGameStore();

  const [timerKey, setTimerKey] = useState(0);

  // Run game loop every 100ms
  useEffect(() => {
    const interval = setInterval(gameLoop, 100);
    return () => clearInterval(interval);
  }, [gameLoop]);

  useEffect(() => {
    setTimerKey((prevKey) => prevKey + 1);
  }, [currentPhase]);




  const handleCardClick = useCallback((card: Card | ResourceCard) => {
    console.log('Card clicked:', card);

    if (actionsRemaining <= 0 || currentPhase !== 'main') {
      console.log('Cannot play card - no actions or wrong phase');
      return;
    }

    if ('type' in card && (card.type === 'primary' || card.type === 'secondary')) {
      console.log('Playing resource card');
      handleResourceCardUse(card);
      return;
    }

    if (card.cost > primaryResource) {
      console.log('Not enough resources');
      return;
    }

    const emptySlot = playerField.findIndex(slot => slot === null);
    if (emptySlot !== -1) {
      console.log('Adding card to build queue:', emptySlot);
      addToBuildQueue(card, emptySlot);
    }
  }, [
    actionsRemaining,
    currentPhase,
    primaryResource,
    playerField,
    handleResourceCardUse,
    addToBuildQueue
  ]);

  const handleAttack = useCallback((attackerPos: number) => {
    if (actionsRemaining > 0 && currentPhase === 'combat') {
      const availableTargets = opponentField
        .map((card, index) => ({ card, index }))
        .filter(({ card }) => card !== null);

      if (availableTargets.length > 0) {
        const target = availableTargets[Math.floor(Math.random() * availableTargets.length)];
        console.log('Initiating combat:', { attackerPos, targetPos: target.index });
        initiateCombat(attackerPos, target.index);
      }
    }
  }, [actionsRemaining, currentPhase, opponentField, initiateCombat]);


  const handleTimeUp = useCallback(() => {
    console.log('Time is up!');
    addPrimaryResource(2);     // Updated method name
    addSecondaryResource(1);   // Updated method name
    endTurn();
  }, [addPrimaryResource, addSecondaryResource, endTurn]);

  return (
    <div className="min-h-screen bg-[#0B1222] flex flex-col">
      {/* Top Bar */}
      <div className="flex justify-between items-center px-6 py-4 bg-[#0F1729]/80 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Phase:</span>
          <motion.span
            className="font-medium text-white bg-slate-700/50 px-3 py-1 rounded-full"
            animate={{ scale: currentPhase === 'combat' ? [1, 1.1, 1] : 1 }}
            transition={{ duration: 0.5, repeat: currentPhase === 'combat' ? Infinity : 0 }}
          >
            {currentPhase}
          </motion.span>
        </div>
        <ResourceDisplay />
      </div>

      {/* Build Queue */}
      <BuildQueue />

      {/* Game Area */}
      <div className="flex-1 flex flex-col p-6 gap-1">
        {/* Opponent Field */}
        <div className="flex-1 grid grid-cols-5 gap-1 mb-1">
          {opponentField.map((card, index) => (
            <div
              key={`opponent-${index}`}
              className={cn(
                "aspect-[2/3] relative rounded-lg border-2 border-dashed border-slate-700/30",
                card ? 'bg-slate-800/20' : 'bg-slate-800/10',
                "transition-colors duration-200"
              )}
            >
              {card && (
                <CardField
                  position={index}
                  card={card}
                  isOpponent
                />
              )}
            </div>
          ))}
        </div>

        {/* Center Line */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent my-2" />

        {/* Player Field */}
        <div className="flex-1 grid grid-cols-5 gap-1 mb-1">
          {playerField.map((card, index) => (
            <div
              key={`player-${index}`}
              className={cn(
                "aspect-[2/3] relative rounded-lg border-2 border-dashed",
                !card ? 'border-slate-700/30 bg-slate-800/10' :
                  currentPhase === 'combat'
                    ? 'border-blue-500/30 bg-blue-900/10'
                    : 'border-slate-700/30 bg-slate-800/20',
                "transition-all duration-200"
              )}
            >
              {card && (
                <CardField
                  position={index}
                  card={card}
                  onAttack={() => handleAttack(index)}
                  isPlayable={currentPhase === 'combat' && actionsRemaining > 0}
                />
              )}
            </div>
          ))}
        </div>

        {/* Player Hand */}
        <div className="h-64 mt-4">
          <PlayerHand onCardClick={handleCardClick} />
        </div>
      </div>

      {/* Phase Controls */}
      <div className="fixed bottom-6 right-6 flex gap-2">
        {currentPhase === 'combat' && (
          <>
            <Button
              size="lg"
              onClick={() => {
                console.log('Resolving combat');
                resolveCombat();
                endCombatPhase();
              }}
              className="bg-red-500 hover:bg-red-600 text-white font-medium"
            >
              Resolve Combat
            </Button>
            <Button
              size="lg"
              onClick={endCombatPhase}
              variant="secondary"
              className="font-medium"
            >
              Skip Combat
            </Button>
          </>
        )}
        {currentPhase === 'end' && (
          <Button
            size="lg"
            onClick={endTurn}
            className="bg-green-500 hover:bg-green-600 text-white font-medium"
          >
            End Turn
          </Button>
        )}
      </div>

      {/* Combat Phase Overlay */}
      {currentPhase === 'combat' && (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-red-900/10 to-transparent" />
        </div>
      )}

      <Timer initialTime={15} onTimeUp={handleTimeUp} key={timerKey} />

      {/* Action Buttons */}
      <div className="fixed bottom-6 left-6 flex gap-2">
        <Button
          size="lg"
          onClick={drawCard}
          disabled={currentPhase !== 'main' || actionsRemaining === 0}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium"
        >
          Draw Card ({actionsRemaining} actions)
        </Button>
      </div>
    </div>
  );
}
