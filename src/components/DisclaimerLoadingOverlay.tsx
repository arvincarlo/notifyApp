const DisclaimerLoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 flex items-center gap-2">
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-[#FF4647] rounded-full animate-[bounce_1s_infinite_0ms]"></div>
          <div className="w-3 h-3 bg-[#FF4647] rounded-full animate-[bounce_1s_infinite_200ms]"></div>
          <div className="w-3 h-3 bg-[#FF4647] rounded-full animate-[bounce_1s_infinite_400ms]"></div>
        </div>
      </div>
    </div>
  );
};
export default DisclaimerLoadingOverlay;
