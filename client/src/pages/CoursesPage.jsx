import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, X, BookOpen } from 'lucide-react'
import PageLayout from '../components/layout/PageLayout'
import CourseCard from '../components/courses/CourseCard'
import { CourseCardSkeleton } from '../components/ui/Skeleton'
import useCourseStore from '../store/courseStore'
import { cn } from '../lib/utils'

const PRICE_RANGES = [
  { label: 'Any Price', value: '' },
  { label: 'Under ₹500', value: '0-500' },
  { label: '₹500 - ₹2000', value: '500-2000' },
  { label: 'Above ₹2000', value: '2000-' },
]

const RATINGS = [
  { label: 'Any Rating', value: '' },
  { label: '4.5 & up', value: '4.5' },
  { label: '4.0 & up', value: '4.0' },
  { label: '3.5 & up', value: '3.5' },
]

export default function CoursesPage() {
  const { courses, tags, fetchCourses, searchCourses, fetchTags, isLoading } = useCourseStore()
  const [query, setQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [rating, setRating] = useState('')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const searchTimeout = useRef(null)

  useEffect(() => {
    fetchCourses()
    fetchTags()
  }, [])

  useEffect(() => {
    clearTimeout(searchTimeout.current)
    searchTimeout.current = setTimeout(() => {
      const params = {}
      if (query) params.query = query
      if (selectedTag) params.tag = selectedTag
      if (rating) params.rating = rating
      if (priceRange) {
        const [min, max] = priceRange.split('-')
        if (min) params.minPrice = min
        if (max) params.maxPrice = max
      }
      if (Object.keys(params).length > 0) {
        searchCourses(params)
      } else {
        fetchCourses()
      }
    }, 400)
    return () => clearTimeout(searchTimeout.current)
  }, [query, selectedTag, priceRange, rating])

  const hasFilters = query || selectedTag || priceRange || rating

  const clearFilters = () => {
    setQuery(''); setSelectedTag(''); setPriceRange(''); setRating('')
  }

  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-extrabold text-white mb-2">Browse Courses</h1>
          <p className="text-white/40">Discover {courses.length}+ courses across all disciplines</p>
        </motion.div>

        {/* Search + Filter bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-3 mb-6"
        >
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              placeholder="Search courses, topics, instructors..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-2 border border-white/8 text-sm text-white placeholder:text-white/30 outline-none focus:border-brand-500/50 focus:ring-2 focus:ring-brand-500/15 transition-all"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => setFiltersOpen((o) => !o)}
            className={cn(
              'flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all',
              filtersOpen || hasFilters
                ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                : 'glass text-white/60 hover:text-white hover:bg-white/8'
            )}
          >
            <SlidersHorizontal size={16} />
            Filters
            {hasFilters && (
              <span className="h-5 w-5 flex items-center justify-center rounded-full bg-brand-500 text-[10px] text-white font-bold">
                {[query, selectedTag, priceRange, rating].filter(Boolean).length}
              </span>
            )}
          </button>
        </motion.div>

        {/* Filters panel */}
        {filtersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass rounded-2xl p-6 mb-6 border border-white/8"
          >
            <div className="grid sm:grid-cols-3 gap-6">
              {/* Tags */}
              <div>
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 block">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setSelectedTag('')}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                      !selectedTag ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'glass text-white/50 hover:text-white'
                    )}
                  >
                    All
                  </button>
                  {tags.map((tag) => (
                    <button
                      key={tag._id}
                      onClick={() => setSelectedTag(selectedTag === tag._id ? '' : tag._id)}
                      className={cn(
                        'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                        selectedTag === tag._id ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' : 'glass text-white/50 hover:text-white'
                      )}
                    >
                      {tag.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div>
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 block">
                  Price Range
                </label>
                <div className="flex flex-col gap-2">
                  {PRICE_RANGES.map((p) => (
                    <label key={p.label} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="price"
                        checked={priceRange === p.value}
                        onChange={() => setPriceRange(p.value)}
                        className="accent-brand-500"
                      />
                      <span className={cn('text-sm transition-colors', priceRange === p.value ? 'text-white' : 'text-white/40 group-hover:text-white/70')}>
                        {p.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3 block">
                  Min Rating
                </label>
                <div className="flex flex-col gap-2">
                  {RATINGS.map((r) => (
                    <label key={r.label} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        name="rating"
                        checked={rating === r.value}
                        onChange={() => setRating(r.value)}
                        className="accent-brand-500"
                      />
                      <span className={cn('text-sm transition-colors', rating === r.value ? 'text-white' : 'text-white/40 group-hover:text-white/70')}>
                        {r.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-1"
              >
                <X size={14} /> Clear all filters
              </button>
            )}
          </motion.div>
        )}

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-white/40">
            {isLoading ? 'Searching...' : `${courses.length} courses found`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(12)].map((_, i) => <CourseCardSkeleton key={i} />)}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-24">
            <BookOpen size={48} className="mx-auto text-white/10 mb-4" />
            <p className="text-white/40 text-lg">No courses found</p>
            <p className="text-white/25 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course, i) => (
              <CourseCard key={course._id} course={course} index={i} />
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  )
}
