import { Icon, type IconName } from '@/lib/icons'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, type HTMLMotionProps } from 'motion/react'
import type React from 'react'

const buttonVariants = cva(
  // Base styles
  'flex justify-center items-center px-4 font-semibold tracking-tight transition-[box-shadow,background-color] disabled:cursor-not-allowed disabled:opacity-50 active:transition-none',
  {
    variants: {
      intent: {
        default: [
          'bg-[#36322F]',
          'text-[#fff]',
          // "hover:enabled:bg-[#4a4542]",
          'hover:enabled:bg-blue-950',
          'disabled:bg-[#8c8885]',
          '[box-shadow:inset_0px_-2.108433723449707px_0px_0px_#371310,_0px_1.2048193216323853px_6.325301647186279px_0px_rgba(58,_33,_8,_8%)]',
          // "hover:enabled:[box-shadow:inset_0px_-2.53012px_0px_0px_#371310,_0px_1.44578px_7.59036px_0px_rgba(58,_33,_8,_24%)]",
          'md:hover:enabled:[box-shadow:inset_0px_-2.53012px_0px_0px_#EFEFEF_20%,_0px_1.44578px_7.59036px_0px_rgba(180,_180,_180,_8%)]',
          'disabled:shadow-none',
          'active:bg-[#2A2724]',
          'active:[box-shadow:inset_0px_-1.5px_0px_0px_#171310,_0px_0.5px_2px_0px_rgba(58,_33,_8,_10%)]'
        ],
        primary: [
          'bg-primary',
          'text-[#fff]',
          'hover:enabled:bg-primary-hover',
          'disabled:bg-[#9FC3F5]',
          '[box-shadow:inset_0px_-2.108433723449707px_0px_0px_#1A68D1,_0px_1.2048193216323853px_6.325301647186279px_0px_rgba(28,_100,_242,_28%)]',
          'hover:enabled:[box-shadow:inset_0px_-2.53012px_0px_0px_#2C7BE5,_0px_1.44578px_7.59036px_0px_rgba(28,_100,_242,_64%)]',
          'disabled:shadow-none',
          // "active:bg-[#1A68D1]",
          'active:[box-shadow:inset_0px_-1.5px_0px_0px_#1554AB,_0px_0.5px_2px_0px_rgba(28,_100,_242,_70%)]'
        ],
        secondary: [
          'bg-[#FFFFFF]',
          'text-[#36322F]',
          'hover:enabled:bg-[#F8F8F8]',
          'disabled:bg-[#F0F0F0]',
          'hover:enabled:[box-shadow:inset_0px_-2.53012px_0px_0px_#E8E8E8,_0px_1.44578px_7.59036px_0px_rgba(0,_0,_0,_12%)]',
          'disabled:shadow-none',
          'border',
          'border-[#E0E0E0]',
          'active:bg-[#F0F0F0]',
          'active:[box-shadow:inset_0px_-1.5px_0px_0px_#D8D8D8,_0px_0.5px_2px_0px_rgba(0,_0,_0,_15%)]'
        ],
        danger: [
          'bg-[#E6492D]',
          'text-[#fff]',
          'hover:enabled:bg-[#F05B41]',
          'disabled:bg-[#F5A799]',
          '[box-shadow:inset_0px_-2.108433723449707px_0px_0px_#D63A1F,_0px_1.2048193216323853px_6.325301647186279px_0px_rgba(214,_58,_31,_58%)]',
          'hover:enabled:[box-shadow:inset_0px_-2.53012px_0px_0px_#E6492D,_0px_1.44578px_7.59036px_0px_rgba(214,_58,_31,_64%)]',
          'disabled:shadow-none',
          'active:bg-[#D63A1F]',
          'active:[box-shadow:inset_0px_-1.5px_0px_0px_#B22E17,_0px_0.5px_2px_0px_rgba(214,_58,_31,_70%)]'
        ],
        outline: [
          'border-2 border-foreground/5 dark:border-foreground/15',
          'dark:bg-foreground/10 text-foreground',
          'md:hover:enabled:bg-foreground md:hover:enabled:text-white md:dark:hover:enabled:text-background',
          'disabled:bg-[#F5A799]',
          // "hover:enabled:[box-shadow:inset_0px_-2.53012px_0px_0px_#EFEFEF,_0px_1.44578px_7.59036px_0px_rgba(0,_0,_0,_12%)]",
          'disabled:shadow-none',
          'active:bg-[#FFF]'
          // "active:[box-shadow:inset_0px_-1.5px_0px_0px_#B22E17,_0px_0.5px_2px_0px_rgba(214,_58,_31,_70%)]",
        ],
        ghost: [
          'border-foreground/10 border-0',
          'text-foreground',
          'md:hover:enabled:bg-foreground/5',
          'dark:md:hover:enabled:bg-foreground/15',
          'disabled:bg-[#F5A799]',
          'md:hover:enabled:[box-shadow:inset_0px_-2.53012px_0px_0px_#EFEFEF_20%,_0px_1.44578px_7.59036px_0px_rgba(0,_0,_0,_12%)]',
          // "md:dark:hover:enabled:text-background",
          'disabled:shadow-none',
          'active:bg-[#F0F0F0]/10'
          // "active:[box-shadow:inset_0px_-1.5px_0px_0px_#B22E17,_0px_0.5px_2px_0px_rgba(214,_58,_31,_10%)]",
        ]
      },
      size: {
        sm: ['text-xs', 'py-1', 'px-2', 'h-9', 'rounded-[8px]'],
        md: ['text-base', 'py-2', 'px-5', 'h-11', 'rounded-[10px]'],
        lg: ['text-lg', 'py-3', 'px-8', 'h-14', 'rounded-[12px]'],
        xl: ['text-xl', 'py-3', 'px-10', 'h-16', 'rounded-[14px]'],
        sq: ['text-base aspect-square', 'flex items-center justify-center rounded-full']
      },
      fullWidth: {
        true: 'w-full'
      }
    },
    compoundVariants: [
      {
        intent: ['ghost'],
        size: ['md', 'lg'],
        className: 'aspect-square rounded-full flex items-center justify-center'
      }
    ],
    defaultVariants: {
      intent: 'default',
      size: 'md'
    }
  }
)

export interface NeumorphButtonProps extends HTMLMotionProps<'button'>, VariantProps<typeof buttonVariants> {
  children?: React.ReactNode
  loading?: boolean
  icon?: IconName
}

export const NeumorphButton: React.FC<NeumorphButtonProps> = ({
  className,
  intent,
  size,
  fullWidth,
  children,
  loading = false,
  disabled,
  icon,
  ...props
}) => {
  return (
    <motion.button
      className={buttonVariants({ intent, size, fullWidth, className })}
      disabled={disabled || loading}
      whileTap={{ scale: 0.98 }}
      // whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      {...props}>
      {icon ? <Icon name={loading ? 'spinner-dots' : icon} className='size-6' /> : null}
      <motion.span
        initial={{ opacity: 1 }}
        animate={{ opacity: loading ? 0.7 : 1 }}
        transition={{ duration: 0.2 }}
        className='h-8'>
        {children}
      </motion.span>
    </motion.button>
  )
}
