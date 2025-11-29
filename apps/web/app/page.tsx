export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-b from-blue-50 to-white">
      <div className="text-center max-w-3xl">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <svg className="w-24 h-24 text-blue-600" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="3" fill="none"/>
            <path d="M65 30 C 75 30, 75 40, 75 50 C 75 60, 75 70, 65 70" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none"/>
            <path d="M40 35 L 35 35 C 28 35, 25 40, 25 50 C 25 60, 28 65, 35 65 L 40 65" stroke="currentColor" strokeWidth="8" strokeLinecap="round" fill="none"/>
          </svg>
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
          Chancel
        </h1>
        <p className="mt-3 text-xl text-blue-600 font-medium sm:mt-4">
          Sacred space. Shared study.
        </p>
        <p className="mt-4 text-base text-gray-600 sm:mt-5 sm:text-lg">
          Online Bible study platform for collaborative group sessions
        </p>
        <div className="mt-8 flex gap-4 justify-center">
          <a
            href="/auth/login"
            className="rounded-md bg-blue-600 px-8 py-3 text-white font-semibold hover:bg-blue-700 shadow-md transition-colors"
          >
            Sign In
          </a>
          <a
            href="/auth/signup"
            className="rounded-md border-2 border-blue-600 px-8 py-3 text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
          >
            Sign Up
          </a>
        </div>
      </div>
    </main>
  )
}
