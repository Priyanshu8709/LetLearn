import { cn, getInitials } from '../../lib/utils'

export default function Avatar({ src, firstname, lastname, size = 'md', className }) {
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-base', xl: 'h-20 w-20 text-xl' }

  return src ? (
    <img
      src={src}
      alt={`${firstname} ${lastname}`}
      className={cn('rounded-full object-cover ring-2 ring-white/10', sizes[size], className)}
    />
  ) : (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold',
        'bg-gradient-to-br from-brand-500 to-purple-600 text-white',
        'ring-2 ring-white/10',
        sizes[size],
        className
      )}
    >
      {getInitials(firstname, lastname)}
    </div>
  )
}
