import { cn } from '../../lib/utils'

const variants = {
  default: 'bg-white/8 text-white/70',
  brand: 'bg-brand-500/15 text-brand-300 border border-brand-500/20',
  success: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/20',
  warning: 'bg-amber-500/15 text-amber-300 border border-amber-500/20',
  danger: 'bg-red-500/15 text-red-300 border border-red-500/20',
  purple: 'bg-purple-500/15 text-purple-300 border border-purple-500/20',
}

export default function Badge({ children, variant = 'default', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
