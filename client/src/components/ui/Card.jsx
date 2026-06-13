import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export default function Card({ children, className, hover = true, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'rounded-2xl bg-surface-2 border border-white/6',
        'transition-shadow duration-300',
        hover && 'hover:border-brand-500/30 hover:shadow-[0_8px_32px_rgba(61,90,255,0.12)]',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
