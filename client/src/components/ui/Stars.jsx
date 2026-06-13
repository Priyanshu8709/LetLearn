import { Star } from 'lucide-react'
import { starArray } from '../../lib/utils'
import { cn } from '../../lib/utils'

export default function Stars({ rating = 0, size = 14, className }) {
  const stars = starArray(rating)
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {stars.map((type, i) => (
        <Star
          key={i}
          size={size}
          className={cn(
            type === 'full' && 'fill-amber-400 text-amber-400',
            type === 'half' && 'fill-amber-400/50 text-amber-400',
            type === 'empty' && 'fill-transparent text-white/20'
          )}
        />
      ))}
    </div>
  )
}
