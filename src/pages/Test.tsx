import React, { useCallback, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import ReactDOM from "react-dom/client";
import { Report } from "./Report";
import Report1 from "./Report1";
import Report2 from "./Report2";
import Report3 from "./Report3";
import Report4 from "./Report4";
import Report5 from "./Report5";
import Report6 from "./Report6";
import Report7 from "./Report7";
import Report8 from "./Report8";
import Appendix from "./Appendix";
import Report9 from "./Report9";
import Report10 from "./Report10";
import Report11 from "./Report11";
import Report12 from "./Report12";
import Report13 from "./Report13";
import Report14 from "./Report14";

interface Page {
  content: React.ReactNode;
}

export const PDFExporter: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  const pages: Page[] = [
    // {
    //   content: <div className="w-full h-screen bg-red-500">page 1 Content</div>,
    // },
    // {
    //   content: (
    //     <div className="w-full h-screen bg-blue-500">Page 2 Content</div>
    //   ),
    // },
    {
      content: <Report />,
    },
    {
      content: <Report1 />,
    },
  ];

  const exportToPDF = useCallback(async () => {
    try {
      setIsExporting(true);

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // const tempContainer = document.createElement("div");
      // tempContainer.style.position = "absolute";
      // tempContainer.style.left = "-9999px";
      // tempContainer.style.top = "0";
      // tempContainer.style.width = `${viewportWidth}px`;
      // tempContainer.style.height = `${viewportHeight}px`;
      // tempContainer.style.zIndex = "9999";
      // tempContainer.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
      // document.body.appendChild(tempContainer);

      const tempContainer = document.createElement("div");
      tempContainer.style.position = "absolute";
      tempContainer.style.left = "-9999px";
      tempContainer.style.top = "0";
      tempContainer.style.zIndex = "9999";
      tempContainer.style.width = `${viewportWidth}px`;
      tempContainer.style.minHeight = "100vh";
      document.body.appendChild(tempContainer);

      const pdf = new jsPDF({
        unit: "px",
        format: [viewportWidth, viewportHeight],
        orientation: viewportWidth > viewportHeight ? "l" : "p",
      });

      for (let i = 0; i < pages.length; i++) {
        tempContainer.innerHTML = "";

        const pageDiv = document.createElement("div");
        pageDiv.style.width = "100%";
        pageDiv.style.height = "100%";
        pageDiv.style.backgroundColor = "white";
        pageDiv.style.overflow = "hidden";
        tempContainer.appendChild(pageDiv);

        const root = ReactDOM.createRoot(pageDiv);
        root.render(
          <div
            style={{
              // width: "100%",
              minHeight: "100vh",
              position: "relative",
              // overflow: "auto",
            }}
          >
            {pages[i].content}
          </div>
        );

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const canvas = await html2canvas(pageDiv, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
          logging: false,
          width: viewportWidth,
          height: viewportHeight,
          windowWidth: viewportWidth,
          windowHeight: viewportHeight,
        });

        const imgData = canvas.toDataURL("image/jpeg", 1.0);

        if (i > 0) {
          pdf.addPage(
            [viewportWidth, viewportHeight],
            viewportWidth > viewportHeight ? "l" : "p"
          );
        }

        pdf.addImage(imgData, "JPEG", 0, 0, viewportWidth, viewportHeight);

        root.unmount();
      }

      pdf.save("document.pdf");
      document.body.removeChild(tempContainer);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  }, []);
  return (
    <div>
      <button
        onClick={exportToPDF}
        disabled={isExporting}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {isExporting ? "Exporting..." : "Export PDF"}
      </button>

      {isExporting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded">
            <p>Generating PDF...</p>
          </div>
        </div>
      )}
      <Report month={""} year={""} accountName={""} />
      <Report1 />
      <Report2 />
      <Report3 />
      <Report4 />
      <Report5 />
      <Report6 />
      <Report7 />
      <Report10 />
      <Report9 />
      <Report11 />
      <Report12 />
      <Report13 />
      <Report14 />
      <Appendix />
    </div>
  );
};
