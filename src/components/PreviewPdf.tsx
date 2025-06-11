import { SaveIcon } from "lucide-react";
import { Button } from "./ui/button";
import PdfHeader from "./PdfHeader";
import "./PreviewPdf.css";

export const PreviewPdfModal = ({
  isOpen,
  onClose,
  content,
}: {
  isOpen: boolean;
  onClose: () => void;
  content: {
    title: string;
    disclaimerText: string;
  };
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600/50 backdrop-blur-sm z-50">
      <div className="h-screen flex flex-col bg-white">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Disclosure Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-auto p-6">
          <p className="text-sm text-gray-600 mb-4">
            Please review the disclosure details below before proceeding. Ensure
            that all the information is accurate and aligned with the intended
            validity period and content requirements.
          </p>

          <div className="border rounded-lg overflow-hidden">
            {/* Chinabank Logo Header */}
            {/* <nav className="w-full">
              <div className="bg-[#660000] h-[50px]">
                <div className="container mx-auto px-4 -ml-1 h-full flex items-center">
                  <div className="flex items-center">
                    <img
                      src="/images/report-logo.png"
                      alt="Chinabank Logo"
                      className="h-5 w-auto"
                    />
                  </div>
                </div>
              </div>
            </nav> */}
            <PdfHeader preview={true} />

            {/* Appendix Header */}
            <div className="bg-[#6B1420] text-white p-3 mt-3">
              <h3>Appendix</h3>
            </div>

            {/* Content */}
            <div className="p-4">
              <div className="html-content">
                <div
                  dangerouslySetInnerHTML={{ __html: content.disclaimerText }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Fixed at bottom */}
        <div className="flex justify-end gap-4 p-6 border-t bg-white">
          <Button
            variant="outline"
            className="rounded-full px-6"
            onClick={onClose}
          >
            Continue Editing
          </Button>
          <Button
            className="rounded-full px-6 bg-[#FF4647] hover:bg-[#FF4647]/90 text-white"
            onClick={onClose}
          >
            <SaveIcon className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
