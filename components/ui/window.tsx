'use client'

import { useWindow, type Keys } from '@/hooks/use-window'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'motion/react'
import { MouseEvent, PropsWithChildren, ReactNode, useCallback, useEffect } from 'react'

interface DialogWindowProps {
  keyCode: Keys
  action?: <T, R>(p: T) => R
  value?: string
  title?: ReactNode
  children?: ReactNode
  open: boolean
  setOpen: VoidFunction
  // action?: <T, R>(p: T) => R;
}
export const DialogWindow = (props: DialogWindowProps) => {
  const { keyCode, action, children, open: _open, setOpen } = props

  // useWindow handles keyboard shortcuts and returns the combined open state
  // It combines the controlled _open prop with its internal toggle state
  const { onKeyDown, open: windowOpen } = useWindow(_open, setOpen)
  const { add, remove } = onKeyDown(keyCode, action)

  useEffect(() => {
    add()
    return () => remove()
  }, [add, remove])

  const stopPropagation = useCallback((e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
  }, [])

  // Use windowOpen which combines _open (controlled) with internal toggle state (keyboard)
  // This allows both controlled props and keyboard shortcuts to work
  const open = windowOpen

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key='dialog-container'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn('fixed z-[200] inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4')}
          onClick={stopPropagation}
          style={{ touchAction: 'none' }}>
          <motion.div
            drag={false}
            dragMomentum={false}
            initial={{ scale: 0.95, opacity: 0, borderRadius: 112 }}
            animate={{ scale: 1, opacity: 1, borderRadius: 28 }}
            exit={{ scale: 0.85, opacity: 0, y: 20 }}
            className={cn('z-[201] w-full max-w-lg overflow-hidden shadow-xl bg-transparent')}
            onClick={stopPropagation}
            style={{ touchAction: 'manipulation' }}>
            <WindowContent>{children}</WindowContent>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const WindowContent = ({ children }: PropsWithChildren) => (
  <div className={cn('relative overflow-hidden')}>{children}</div>
)
