export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-gray-900 dark:text-gray-100">
      <h1 className="text-5xl font-extrabold text-blue-700 dark:text-blue-400">Welcome to BCMS!</h1>
      <p className="text-lg mt-4 text-gray-700 dark:text-gray-300">
        Broadband Customer Monitoring System
      </p>
      <nav className="mt-8">
        <ul className="flex space-x-4">
          <li>
            <a
              href="/"
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Home
            </a>
          </li>
          <li>
            <a
              href="/dashboard"
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
            >
              Dashboard
            </a>
          </li>
          {/* Add more navigation links here */}
        </ul>
      </nav>
    </div>
  );
}
