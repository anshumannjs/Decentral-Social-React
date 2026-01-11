export default function PostSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-start space-x-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="flex items-center space-x-2">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-4 bg-gray-200 rounded w-16" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="flex items-center space-x-4">
            <div className="h-4 bg-gray-200 rounded w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}