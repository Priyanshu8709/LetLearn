import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs) => twMerge(clsx(inputs))

export const formatPrice = (p) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p)

export const formatDate = (d) =>
  new Intl.DateTimeFormat('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(d))

export const truncate = (s = '', n = 100) => (s.length > n ? s.slice(0, n) + '…' : s)

export const getInitials = (f = '', l = '') => `${f[0] ?? ''}${l[0] ?? ''}`.toUpperCase()

export const starArray = (r = 0) =>
  Array.from({ length: 5 }, (_, i) => (i < Math.floor(r) ? 'full' : i < r ? 'half' : 'empty'))
