'use client'

import React, { useState, useEffect, useId, useMemo } from 'react'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

export interface TextTrainProps {
  /** Array of words to cycle through in the animation */
  words?: string[];
  /** Time in milliseconds between word transitions */
  interval?: number;
  /** Additional CSS classes to apply to the container */
  className?: string;
  /** Additional CSS classes to apply to the text */
  textClassName?: string;
  /** Duration of the transition animation in milliseconds */
  animationDuration?: number;
  /** Delay before the animation starts in milliseconds */
  delay?: number;
}

export function TextTrain ({
  delay = 0,
  className,
  textClassName,
  interval = 6000,
  animationDuration = 700,
  words = ['better', 'modern', 'beautiful', 'awesome'],
}: TextTrainProps) {
  const id = useId()
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [width, setWidth] = useState(100)
  const textRef = React.useRef<HTMLDivElement>(null)

  const updateWidthForWord = () => {
    if (textRef.current) {
      // Add some padding to the text width (30px on each side)
      const textWidth = textRef.current.scrollWidth + 30
      setWidth(textWidth)
    }
  }

  useEffect(() => {
    // Update width whenever the word changes
    updateWidthForWord()
  }, [currentWordIndex])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length)
      // Width will be updated in the effect that depends on currentWordIndex
    }, interval)

    return () => clearInterval(intervalId)
  }, [words, interval])

  const currentKey = useMemo(
    () => words[currentWordIndex],
    [words, currentWordIndex]
  )

  return (
    <motion.div
      layout
      layoutId={`words-here-${id}`}
      animate={{ width }}
      transition={{ duration: animationDuration / 2000, delay }}
      className={cn(
        'relative inline-block rounded-lg tracking-tight text-center text-4xl font-tek font-bold text-background',
        '_[background:linear-gradient(to_bottom,#f3f4f6,#e5e7eb)]',
        '_shadow-[inset_0_-1px_#d1d5db,inset_0_0_0_1px_#d1d5db,_0_4px_8px_#d1d5db]',
        '_dark:[background:linear-gradient(to_bottom,#374151,#1f2937)]',
        '_dark:shadow-[inset_0_-1px_#10171e,inset_0_0_0_1px_hsla(205,89%,46%,.24),_0_4px_8px_#00000052]',
        'drop-shadow-xs bg-linear-120',
        className
      )}
      key={currentKey}
    >
      <motion.div
        transition={{
          duration: animationDuration / 1000,
          ease: 'easeInOut',
        }}
        className={cn('inline-block', textClassName)}
        ref={textRef}
        layoutId={`word-div-${words[currentWordIndex]}-${id}`}
      >
        <motion.div className='inline-block'>
          {words[currentWordIndex].split('').map((letter, index) => (
            <motion.span
              key={index}
              initial={{
                opacity: 0,
                filter: 'blur(6px)',
              }}
              animate={{
                opacity: 1,
                filter: 'blur(0px)',
              }}
              transition={{
                delay: index * 0.02,
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

export function TextFlip ({
  words = ['better', 'modern', 'beautiful', 'awesome'],
  interval = 8000,
  className,
  textClassName,
  animationDuration = 800,
}: TextTrainProps) {
  const id = useId()
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [width, setWidth] = useState(100)
  const textRef = React.useRef<HTMLDivElement>(null)

  const updateWidthForWord = () => {
    if (textRef.current) {
      // Add some padding to the text width (30px on each side)
      const textWidth = textRef.current.scrollWidth + 30
      setWidth(textWidth)
    }
  }

  useEffect(() => {
    // Update width whenever the word changes
    updateWidthForWord()
  }, [currentWordIndex])

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length)
      // Width will be updated in the effect that depends on currentWordIndex
    }, interval)

    return () => clearInterval(intervalId)
  }, [words, interval])

  return (
    <motion.p
      layout
      layoutId={`words-here-${id}`}
      animate={{ width }}
      transition={{ duration: animationDuration / 2000 }}
      className={cn(
        'relative inline-block rounded-lg text-center dark:bg-zinc-300 text-foreground',
        className
      )}
      key={words[currentWordIndex]}
    >
      <motion.div
        transition={{
          duration: animationDuration / 1000,
          ease: 'easeInOut',
        }}
        className={cn('inline-block', textClassName)}
        ref={textRef}
        layoutId={`word-div-${words[currentWordIndex]}-${id}`}
      >
        <motion.div className='inline-block'>
          {words[currentWordIndex].split('').map((letter, index) => (
            <motion.span
              key={index}
              initial={{
                opacity: 0,
                filter: 'blur(2px)',
              }}
              animate={{
                opacity: 1,
                filter: 'blur(0px)',
              }}
              transition={{
                delay: index * 0.01,
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </motion.p>
  )
}
