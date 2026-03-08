'use client'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-1 py-8">
      {/* Previous Button */}
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-2 py-2 rounded bg-card border border-border text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition"
        aria-label="Previous page"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded text-sm font-bold transition ${
                currentPage === page
                  ? 'bg-orange-700 text-white'
                  : 'bg-card border border-border text-foreground hover:bg-secondary'
              }`}
            >
              {page}
            </button>
          )
        })}
      </div>

      {/* Next Button */}
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-2 py-2 rounded bg-card border border-border text-foreground hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition"
        aria-label="Next page"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  )
}
