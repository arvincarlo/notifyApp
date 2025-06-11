import { useCallback, useState } from "react";
import { EncryptionOptions, jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import ReactDOM from "react-dom/client";

interface Page {
  content: React.ReactNode;
}

const useExportPDF = () => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPDF = useCallback(
    async (
      pages: Page[],
      dateCovered?: string,
      middleName?: string,
      lastName?: string,
      month?: string,
      year?: string
    ) => {
      try {
        setIsExporting(true);

        const tempContainer = document.createElement("div");
        tempContainer.style.position = "absolute";
        tempContainer.style.left = "-9999px";
        tempContainer.style.top = "0";
        tempContainer.style.width = "100%";
        tempContainer.style.zIndex = "9999";
        document.body.appendChild(tempContainer);

        const months = {
          Jan: "1",
          Feb: "2",
          Mar: "3",
          Apr: "4",
          May: "5",
          Jun: "6",
          Jul: "7",
          Aug: "8",
          Sep: "9",
          Oct: "10",
          Nov: "11",
          Dec: "12",
        };

        let pdf: any = null;

        for (let i = 0; i < pages.length; i++) {
          tempContainer.innerHTML = "";

          const pageDiv = document.createElement("div");
          pageDiv.style.position = "relative";
          pageDiv.style.width = "100%";
          pageDiv.style.height = "auto";
          pageDiv.style.overflow = "visible";
          tempContainer.appendChild(pageDiv);

          const root = ReactDOM.createRoot(pageDiv);

          root.render(
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "auto",
                overflow: "visible",
              }}
            >
              {pages[i].content}
            </div>
          );

          await new Promise((resolve) => setTimeout(resolve, 1000));

          const contentWidth = Math.max(pageDiv.scrollWidth, 1920);
          const contentHeight = Math.max(pageDiv.scrollHeight, 1180);

          if (i === 0) {
            const pdfOptions: any = {
              unit: "px",
              format: [contentWidth, contentHeight],
              orientation: contentWidth > contentHeight ? "l" : "p",
            };

            if (dateCovered) {
              const dates = dateCovered.split(".");
              const monthNum = months[dates[0] as keyof typeof months];
              const year = dates[1].slice(-2);
              const mid = middleName
                ? middleName.length < 4
                  ? middleName.toUpperCase() + "X".repeat(4 - middleName.length)
                  : middleName.toUpperCase().slice(0, 4)
                : "XXXX";
              const password = `Cbc${mid}${monthNum}${year}`;
              console.log("Password:", password);
              pdfOptions.encryption = {
                userPassword: password,
                ownerPassword: password,
              };
            }

            pdf = new jsPDF(pdfOptions);
          } else {
            pdf.addPage(
              [contentWidth, contentHeight],
              contentWidth > contentHeight ? "l" : "p"
            );
          }

          const canvas = await html2canvas(pageDiv, {
            useCORS: true,
            allowTaint: true,
            logging: true,
            width: contentWidth,
            height: contentHeight,
            windowWidth: contentWidth,
            windowHeight: contentHeight,
            scrollX: 0,
            scrollY: 0,
            scale: 2,
            onclone: (clonedDoc) => {
              const clonedElement = clonedDoc.querySelector("div");
              if (clonedElement) {
                clonedElement.style.height = "auto";
                clonedElement.style.overflow = "visible";
              }
            },
          });

          const imgData = canvas.toDataURL("image/jpeg", 1.0);
          pdf.addImage(imgData, "JPEG", 0, 0, contentWidth, contentHeight);

          root.unmount();
          await new Promise((resolve) => setTimeout(resolve, 500));
        }

        pdf.save(`${lastName}${month}${year}.pdf`);

        document.body.removeChild(tempContainer);

        return true;
      } catch (error) {
        console.error("Export failed:", error);
        return false;
      } finally {
        setIsExporting(false);
      }
    },
    []
  );

  return { exportToPDF, isExporting, setIsExporting };
};

export default useExportPDF;
