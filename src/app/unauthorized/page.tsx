export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center bg-red-50">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Access Denied</h1>
      <p className="text-lg text-gray-700 mb-6">
        You do not have permission to view this page.
      </p>
      <a
        href="/dashboard"
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
      >
        Return to Dashboard
      </a>
    </div>
  );
}
