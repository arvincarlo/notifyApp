export const ReportHeader = () => {
  return (
    <>
      <nav className="w-full z-50">
        <div className="bg-[#660000] h-[80px] w-full">
          <div className="container mx-auto px-4 h-full flex items-center">
            {/* Logo */}
            <div className="flex items-center">
              <img
                src="./images/report-logo.png"
                alt="Chinabank Logo"
                width={200}
                height={40}
                className="h-8 w-auto"
              />
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
