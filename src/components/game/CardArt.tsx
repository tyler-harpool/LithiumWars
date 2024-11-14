'use client';

import { motion } from 'framer-motion';
import { Faction } from '@/lib/types/game';

interface CardArtProps {
  faction: Faction;
  type: string;
  isAttacking?: boolean;
  isActive?: boolean;
}

export function CardArt({ faction, type, isAttacking = false, isActive = false }: CardArtProps) {
  const pulseAnimation = {
    scale: [1, 1.2, 1],
    opacity: [0.7, 1, 0.7],
  };

  const attackAnimation = {
    scale: [1, 1.3, 1],
    rotate: [0, -10, 10, 0],
  };

  const getArtElement = () => {
    switch (faction) {
      case 'mechanist':
        return (
          <motion.div
            className="relative w-32 h-32"
            animate={isAttacking ? attackAnimation : isActive ? pulseAnimation : {}}
            transition={{ duration: isAttacking ? 0.5 : 2, repeat: isAttacking ? 0 : Infinity }}
          >
            {/* Core */}
            <motion.div
              className="absolute inset-8 bg-blue-500/20 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Rotating Rings */}
            <motion.div
              className="absolute inset-0 border-4 border-blue-500/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-4 border-4 border-blue-400/20 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            />

            {/* Energy Particles */}
            <motion.div
              className="absolute inset-0"
              initial="initial"
              animate="animate"
            >
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-blue-400 rounded-full"
                  animate={{
                    x: [0, Math.cos(i * 60) * 50],
                    y: [0, Math.sin(i * 60) * 50],
                    opacity: [1, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        );

      case 'luminari':
        return (
          <motion.div
            className="relative w-32 h-32"
            animate={isAttacking ? attackAnimation : isActive ? pulseAnimation : {}}
            transition={{ duration: isAttacking ? 0.5 : 2, repeat: isAttacking ? 0 : Infinity }}
          >
            {/* Crystal Core */}
            <motion.div
              className="absolute inset-8 bg-purple-500/30 rotate-45"
              animate={{
                rotate: [45, 225, 45],
                scale: [1, 1.2, 1],
                boxShadow: [
                  '0 0 20px rgba(147,51,234,0.3)',
                  '0 0 40px rgba(147,51,234,0.5)',
                  '0 0 20px rgba(147,51,234,0.3)',
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />

            {/* Energy Field */}
            <motion.div
              className="absolute inset-0"
              animate={{
                backgroundImage: [
                  'radial-gradient(circle, rgba(147,51,234,0.3) 0%, transparent 70%)',
                  'radial-gradient(circle, rgba(147,51,234,0.5) 30%, transparent 70%)',
                  'radial-gradient(circle, rgba(147,51,234,0.3) 0%, transparent 70%)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Crystal Shards */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-4 h-12 bg-purple-400/30"
                initial={{ rotate: i * 90, scale: 0.5, x: -2 }}
                animate={{
                  rotate: [i * 90, i * 90 + 360],
                  scale: [0.5, 0.7, 0.5],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
                style={{
                  left: '50%',
                  top: '50%',
                  transformOrigin: '50% 0',
                }}
              />
            ))}
          </motion.div>
        );

      case 'swarmborn':
        return (
          <motion.div
            className="relative w-32 h-32"
            animate={isAttacking ? attackAnimation : isActive ? pulseAnimation : {}}
            transition={{ duration: isAttacking ? 0.5 : 2, repeat: isAttacking ? 0 : Infinity }}
          >
            {/* Organic Core */}
            <motion.div
              className="absolute inset-8 bg-red-500/20 rounded-full"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Pulsing Tendrils */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-16 bg-red-400/30"
                initial={{ rotate: i * 45, scale: 0.5, x: -1 }}
                animate={{
                  rotate: [i * 45, i * 45 + 10, i * 45 - 10, i * 45],
                  scale: [0.5, 0.7, 0.5],
                  opacity: [0.3, 0.7, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                style={{
                  left: '50%',
                  top: '50%',
                  transformOrigin: '50% 0',
                }}
              />
            ))}

            {/* Swarm Particles */}
            <motion.div
              className="absolute inset-0"
              initial="initial"
              animate="animate"
            >
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-red-400 rounded-full"
                  animate={{
                    x: [0, Math.cos(i * 30) * 40],
                    y: [0, Math.sin(i * 30) * 40],
                    opacity: [1, 0],
                    scale: [1, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                  style={{
                    left: '50%',
                    top: '50%',
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {getArtElement()}
    </div>
  );
}
