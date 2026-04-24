interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  onSearch: () => void
  loading: boolean
}

export function SearchBar({ value, onChange, onSearch, loading }: SearchBarProps) {
  return (
    <div className="flex gap-2 mb-4">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()}
        placeholder="Search album or artist..."
        className="flex-1 p-4 bg-gray-900 border border-gray-700 rounded-lg text-lg focus:outline-none focus:border-blue-500"
      />
      <button
        onClick={onSearch}
        disabled={loading}
        className="px-8 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold disabled:opacity-50"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
    </div>
  )
}