interface ChanelLogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function ChanelLogo({ className = '', size = 'md' }: ChanelLogoProps) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24',
  }

  return (
    <svg
      className={`${sizeMap[size]} ${className}`}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="3" fill="none"/>
      <path
        d="M65 30 C 75 30, 75 40, 75 50 C 75 60, 75 70, 65 70"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M40 35 L 35 35 C 28 35, 25 40, 25 50 C 25 60, 28 65, 35 65 L 40 65"
        stroke="currentColor"
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
