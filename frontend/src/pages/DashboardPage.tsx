export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-gray-900 dark:text-gray-100">
      <h1 className="text-4xl font-bold text-green-600 dark:text-green-400">Dashboard Overview</h1>
      <p className="text-lg mt-4 text-gray-700 dark:text-gray-300">
        This is your main dashboard content.
      </p>
      {/* Add dashboard widgets and charts here */}
    </div>
  );
}
