'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/lib/stores/gameStore';
import { TECH_TREE } from '@/lib/data/tech-tree';
import { TechTreeNode } from '@/lib/types/tech-tree';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { Lock, CheckCircle, AlertCircle } from 'lucide-react';

export function BuildMenu() {
  const [selectedCategory, setSelectedCategory] = useState<'units' | 'resources' | 'technologies'>('units');
  const {
    primaryResource,
    secondaryResource,
    playerField,
    addToBuildQueue,
    researchedTech = new Set() // Add this to your GameState
  } = useGameStore();

  const checkRequirements = (node: TechTreeNode): {
    met: boolean;
    reason?: string;
  } => {
    // Check resources
    if (primaryResource < node.requirements.resources.primary ||
        secondaryResource < node.requirements.resources.secondary) {
      return { met: false, reason: 'Insufficient resources' };
    }

    // Check tech requirements
    if (node.requirements.tech?.some(req => !researchedTech.has(req.id))) {
      return { met: false, reason: 'Missing required technology' };
    }

    // Check unit requirements
    if (node.requirements.units) {
      const unitCounts = node.requirements.units.map(req => ({
        id: req.id,
        required: req.count || 1,
        actual: playerField.filter(card => card?.id === req.id).length
      }));

      const missingUnits = unitCounts.find(u => u.actual < u.required);
      if (missingUnits) {
        return {
          met: false,
          reason: `Need ${missingUnits.required} ${TECH_TREE.units[missingUnits.id].name}`
        };
      }
    }

    return { met: true };
  };

  return (
    <div className="fixed right-6 top-20 w-96 bg-black/40 backdrop-blur-sm rounded-lg p-4">
      <Tabs defaultValue="units" onValueChange={(v: any) => setSelectedCategory(v)}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="units" className="flex-1">Units</TabsTrigger>
          <TabsTrigger value="resources" className="flex-1">Resources</TabsTrigger>
          <TabsTrigger value="technologies" className="flex-1">Tech</TabsTrigger>
        </TabsList>

        {Object.entries(TECH_TREE).map(([category, items]) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="space-y-2">
              {Object.values(items).map((node) => {
                const requirements = checkRequirements(node);

                return (
                  <motion.div
                    key={node.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={cn(
                      "p-3 rounded-lg border border-white/10",
                      "hover:bg-white/5 transition-colors",
                      !requirements.met && "opacity-50"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium text-white flex items-center gap-2">
                          {node.name}
                          {requirements.met ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <Lock className="w-4 h-4 text-yellow-500" />
                          )}
                        </h3>
                        <p className="text-sm text-white/60">{node.description}</p>
                      </div>
                      <div className="text-sm text-white/80">
                        <div>P: {node.requirements.resources.primary}</div>
                        <div>S: {node.requirements.resources.secondary}</div>
                      </div>
                    </div>

                    {!requirements.met && requirements.reason && (
                      <div className="mt-2 text-xs text-yellow-500/80 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {requirements.reason}
                      </div>
                    )}

                    <Button
                      size="sm"
                      variant="secondary"
                      className="mt-2 w-full"
                      disabled={!requirements.met}
                      onClick={() => {
                        const emptySlot = playerField.findIndex(slot => slot === null);
                        if (emptySlot !== -1) {
                          addToBuildQueue(node.card, emptySlot);
                        }
                      }}
                    >
                      Build ({node.buildTime}s)
                    </Button>
                  </motion.div>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
