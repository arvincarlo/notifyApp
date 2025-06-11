const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center p-4 gap-2">
      <div className="loading-dots flex gap-1">
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
        <div
          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
