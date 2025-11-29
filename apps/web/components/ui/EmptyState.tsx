interface EmptyStateProps {
  title: string
  description: string
  icon?: 'sessions' | 'search' | 'filter'
  action?: {
    label: string
    onClick: () => void
  }
}

export default function EmptyState({ title, description, icon = 'sessions', action }: EmptyStateProps) {
  const icons = {
    sessions: (
      <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Book illustration */}
        <g opacity="0.1">
          <rect x="40" y="60" width="120" height="90" rx="4" fill="#2563EB" />
        </g>
        <g opacity="0.3">
          <rect x="50" y="50" width="120" height="90" rx="4" fill="#3B82F6" />
        </g>
        <g>
          <rect x="60" y="40" width="120" height="90" rx="4" fill="#60A5FA" />
          <line x1="100" y1="40" x2="100" y2="130" stroke="white" strokeWidth="2" opacity="0.5" />
          <line x1="60" y1="60" x2="175" y2="60" stroke="white" strokeWidth="1" opacity="0.3" />
          <line x1="60" y1="75" x2="175" y2="75" stroke="white" strokeWidth="1" opacity="0.3" />
          <line x1="60" y1="90" x2="175" y2="90" stroke="white" strokeWidth="1" opacity="0.3" />
          <line x1="60" y1="105" x2="175" y2="105" stroke="white" strokeWidth="1" opacity="0.3" />
        </g>
        {/* Floating elements */}
        <circle cx="30" cy="30" r="4" fill="#93C5FD" opacity="0.6">
          <animate attributeName="cy" values="30;35;30" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="190" cy="170" r="3" fill="#DBEAFE" opacity="0.8">
          <animate attributeName="cy" values="170;165;170" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="180" cy="40" r="5" fill="#BFDBFE" opacity="0.7">
          <animate attributeName="cy" values="40;45;40" dur="3.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    ),
    search: (
      <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Magnifying glass */}
        <circle cx="80" cy="80" r="40" stroke="#93C5FD" strokeWidth="8" opacity="0.3" />
        <circle cx="80" cy="80" r="35" stroke="#60A5FA" strokeWidth="6" opacity="0.5" />
        <circle cx="80" cy="80" r="30" stroke="#3B82F6" strokeWidth="4" />
        <line x1="108" y1="108" x2="140" y2="140" stroke="#3B82F6" strokeWidth="8" strokeLinecap="round" />
        {/* Search lines */}
        <line x1="70" y1="70" x2="90" y2="70" stroke="#93C5FD" strokeWidth="2" opacity="0.5" />
        <line x1="70" y1="80" x2="85" y2="80" stroke="#93C5FD" strokeWidth="2" opacity="0.5" />
        <line x1="70" y1="90" x2="90" y2="90" stroke="#93C5FD" strokeWidth="2" opacity="0.5" />
        {/* Sparkles */}
        <g opacity="0.7">
          <path d="M150,50 L152,58 L160,60 L152,62 L150,70 L148,62 L140,60 L148,58 Z" fill="#DBEAFE">
            <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
          </path>
          <path d="M40,140 L41,145 L46,146 L41,147 L40,152 L39,147 L34,146 L39,145 Z" fill="#BFDBFE">
            <animate attributeName="opacity" values="0.5;0.9;0.5" dur="2.5s" repeatCount="indefinite" />
          </path>
        </g>
      </svg>
    ),
    filter: (
      <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Funnel/Filter */}
        <path d="M50,40 L150,40 L120,90 L120,140 L80,140 L80,90 Z" fill="#DBEAFE" opacity="0.3" />
        <path d="M55,45 L145,45 L118,88 L118,135 L82,135 L82,88 Z" fill="#93C5FD" opacity="0.5" />
        <path d="M60,50 L140,50 L116,86 L116,130 L84,130 L84,86 Z" fill="#60A5FA" />
        {/* Lines passing through */}
        <line x1="30" y1="60" x2="170" y2="60" stroke="#3B82F6" strokeWidth="2" opacity="0.3" />
        <line x1="40" y1="75" x2="160" y2="75" stroke="#3B82F6" strokeWidth="2" opacity="0.3" />
        {/* Result elements */}
        <rect x="90" y="145" width="20" height="6" rx="3" fill="#2563EB" opacity="0.6">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" />
        </rect>
        <rect x="85" y="155" width="30" height="6" rx="3" fill="#3B82F6" opacity="0.7">
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
        </rect>
      </svg>
    ),
  }

  return (
    <div className="text-center py-16 px-4 animate-fade-in">
      {/* Illustration */}
      <div className="w-48 h-48 mx-auto mb-6">
        {icons[icon]}
      </div>

      {/* Text Content */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {description}
      </p>

      {/* Action Button */}
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {action.label}
        </button>
      )}
    </div>
  )
}
