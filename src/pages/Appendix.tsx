import PdfFooter from "@/components/PdfFooter";
import PdfHeader from "@/components/PdfHeader";
import React, { useEffect } from "react";
import "./Appendix.css";

export default function Appendix({
  print,
  content,
}: {
  print: boolean;
  content: string;
}) {
  return (
    <div
      style={{
        position: "relative",
        minHeight: `${print ? "100vh" : "115vh"}`,
        height: "auto",
      }}
    >
      <PdfHeader />
      <div
        className="bg-[#630003] pl-4 pt-2 pb-2 mt-4"
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "white",
        }}
      >
        <span>Appendix</span>
      </div>

      {/* Content */}

      {/* <div className="footer-notes font-bold">
        <div className="note">
          *Effective June 1, 2024, the interest rate on the US Dollar demand
          accounts shall be 0%
        </div>

        <div className="note">
          *Effective September 1, 2024, the interest rate on the Peso demand
          accounts shall be 0.10% per annum. The interest earnings are based on
          daily cleared balances, subject to the applicable withholding tax, and
          credited to the account at the end of the month
        </div>

        <div className="note">
          *Please note that the balances in this statement do not include
          payable / receivable amounts from purchase / sell transactions for
          which settlement date falls AFTER report date.
        </div>

        <div className="note">
          *For concerns or feedback regarding your Consolidated Statement of
          Investment Holdings, please contact our Customer Assistance Management
          Unit at the following numbers:
          <div className="contact-info">
            <div>- Tel:</div>
            <div>- Email:</div>
            <div>- Customer Contact Center</div>
          </div>
        </div>

        <div className="note">
          *Chinabank is regulated by the Bangko Sentral ng Pilipinas (BSP)
          <div className="contact-info">
            <div>- BSP Financial Consumer Affairs</div>
            <div>- Email:</div>
          </div>
        </div>
      </div> */}
      <div
        className="footer-notes"
        dangerouslySetInnerHTML={{ __html: content }}
      ></div>

      {/* Footer */}
      <PdfFooter />
    </div>
  );
}
