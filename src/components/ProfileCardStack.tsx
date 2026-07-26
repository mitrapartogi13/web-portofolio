'use client';

import React, { useState } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
} from 'framer-motion';
import Image from 'next/image';
import { Hand } from 'lucide-react';

interface ProfileCardStackProps {
  images: string[];
  alt: string;
  /** How many cards are visible in the depth stack at once. */
  visibleCount?: number;
}

interface DeckCard {
  id: number;
  src: string;
}

// Distance / velocity (in any direction) past which a release counts as a
// "discard" swipe rather than a snap-back.
const SWIPE_OFFSET_THRESHOLD = 110;
const SWIPE_VELOCITY_THRESHOLD = 500;
// How far off-screen a discarded card is flung before it loops to the back.
const FLING_DISTANCE = 700;

export default function ProfileCardStack({
  images,
  alt,
  visibleCount = 3,
}: ProfileCardStackProps) {
  // Stable ids so framer-motion keeps each card's identity across reorders,
  // which is what lets the depth/scale shift animate smoothly.
  const [cards, setCards] = useState<DeckCard[]>(() =>
    images.map((src, i) => ({ id: i, src })),
  );
  const [hasInteracted, setHasInteracted] = useState(false);

  // Move the front card to the back of the deck.
  const cycleDeck = () =>
    setCards((prev) => [...prev.slice(1), prev[0]]);

  return (
    <div className="relative aspect-square w-full max-w-[360px] mx-auto select-none [perspective:1200px]">
      {cards.map((card, index) => (
        <Card
          key={card.id}
          card={card}
          index={index}
          total={cards.length}
          alt={alt}
          isFront={index === 0}
          isVisible={index < visibleCount}
          onSwipe={cycleDeck}
          onGrab={() => setHasInteracted(true)}
        />
      ))}

      {/* One-time "drag me" hint, fades out after the first interaction. */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: hasInteracted ? 0 : 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="pointer-events-none absolute -bottom-9 left-1/2 -translate-x-1/2 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-stone-400 dark:text-stone-500"
      >
        <Hand className="w-3.5 h-3.5 animate-pulse" />
        Geser kartu
      </motion.div>
    </div>
  );
}

interface CardProps {
  card: DeckCard;
  index: number;
  total: number;
  alt: string;
  isFront: boolean;
  isVisible: boolean;
  onSwipe: () => void;
  onGrab: () => void;
}

function Card({
  card,
  index,
  total,
  alt,
  isFront,
  isVisible,
  onSwipe,
  onGrab,
}: CardProps) {

  // Free drag position of the front card. Non-front cards keep these at 0.
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // rotateY flip applied while the card is being discarded.
  const flip = useMotionValue(0);
  // Live in-plane tilt follows horizontal drag for a natural "leaning" feel.
  const dragRotate = useTransform(x, [-220, 0, 220], [-16, 0, 16]);
  // Fade is driven by total drag distance, so it works in any direction.
  const dragOpacity = useTransform([x, y], ([lx, ly]: number[]) =>
    Math.max(0, 1 - Math.hypot(lx, ly) / 280),
  );

  // Resting position inside the depth stack: cards behind shrink, drop down
  // a little, and alternate a slight tilt to read as a physical pile.
  const restingScale = 1 - index * 0.06;
  const restingY = index * 16;
  const restingRotate = index === 0 ? 0 : (index % 2 === 0 ? 1 : -1) * (index + 1) * 1.5;

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const distance = Math.hypot(info.offset.x, info.offset.y);
    const velocity = Math.hypot(info.velocity.x, info.velocity.y);

    if (distance > SWIPE_OFFSET_THRESHOLD || velocity > SWIPE_VELOCITY_THRESHOLD) {
      // Fling along the direction it was thrown, flipping as it goes, then
      // send it to the back of the queue and reset for a clean re-entry.
      const norm = distance || 1;
      const flingX = (info.offset.x / norm) * FLING_DISTANCE;
      const flingY = (info.offset.y / norm) * FLING_DISTANCE;
      const flipDir = info.offset.x >= 0 ? 1 : -1;

      Promise.all([
        animate(x, flingX, { duration: 0.45, ease: 'easeOut' }),
        animate(y, flingY, { duration: 0.45, ease: 'easeOut' }),
        animate(flip, flipDir * 180, { duration: 0.45, ease: 'easeInOut' }),
      ]).then(() => {
        onSwipe();
        x.set(0);
        y.set(0);
        flip.set(0);
      });
    } else {
      // Not far enough — spring back to the center of the deck.
      const spring = { type: 'spring' as const, stiffness: 320, damping: 28 };
      animate(x, 0, spring);
      animate(y, 0, spring);
    }
  };

  return (
    // OUTER: the deck "slot". Owns depth (scale/offset/tilt) and stacking
    // order, animating whenever the card's index changes after a swipe.
    <motion.div
      className="absolute inset-0"
      style={{ zIndex: total - index }}
      animate={{
        scale: restingScale,
        y: restingY,
        rotate: restingRotate,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* INNER: the grab layer. Only the front card is draggable — in any
          direction — and its motion values power the live tilt, fade and the
          discard flip above. */}
      <motion.div
        className="w-full h-full [transform-style:preserve-3d]"
        style={{ x, y, rotate: dragRotate, rotateY: flip, opacity: dragOpacity }}
        drag={isFront}
        dragMomentum={false}
        onDragStart={onGrab}
        onDragEnd={handleDragEnd}
        whileTap={isFront ? { cursor: 'grabbing' } : undefined}
      >
        <div
          className={`relative w-full h-full overflow-hidden rounded-3xl ${
            isFront ? 'cursor-grab' : 'pointer-events-none'
          }`}
        >
          <Image
            src={card.src}
            alt={alt}
            fill
            unoptimized
            draggable={false}
            sizes="(max-width: 768px) 100vw, 360px"
            className={`object-cover transition-all duration-700 ease-in-out ${
              isFront ? 'grayscale-0' : 'grayscale'
            }`}
            priority={isFront}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
