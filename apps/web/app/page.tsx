export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          BibleProject
        </h1>
        <p className="mt-3 text-base text-gray-500 sm:mt-4">
          Collaborative group Bible study platform
        </p>
        <div className="mt-6 flex gap-4 justify-center">
          <a
            href="/auth/login"
            className="rounded-md bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700"
          >
            Sign In
          </a>
          <a
            href="/auth/signup"
            className="rounded-md border border-gray-300 px-6 py-3 text-gray-700 font-semibold hover:bg-gray-50"
          >
            Sign Up
          </a>
        </div>
      </div>
    </main>
  )
}
