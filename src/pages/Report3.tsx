import PdfFooter from "@/components/PdfFooter";
import PdfHeader from "@/components/PdfHeader";

export default function Report3({ print }: { print: boolean }) {
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
        <span>Bank Portfolio</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4 space-y-4">
        <h2 className="text-xl font-bold">Certificate of Deposits</h2>

        <div className="border border-black rounded-lg p-4">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-1.5">Product Description</th>
                <th className="text-left py-1.5">Reference No.</th>
                <th className="text-left py-1.5">Value Date</th>
                <th className="text-right py-1.5">Principal Amount</th>
                <th className="text-right py-1.5">Interest Rate</th>
                <th className="text-center py-1.5">Term</th>
                <th className="text-center py-1.5">Maturity Date</th>
                <th className="text-right py-1.5">Maturity Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1.5 font-bold">PHP</td>
                <td colSpan={7}></td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-1.5">Treasury Certificate of Deposit</td>
                <td className="py-1.5">1111</td>
                <td className="py-1.5">17-Mar-24</td>
                <td className="text-right py-1.5">2.00</td>
                <td className="text-right py-1.5">2.0000%</td>
                <td className="text-center py-1.5">30 days</td>
                <td className="text-center py-1.5">01-Jan-01</td>
                <td className="text-right py-1.5">1.00</td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                <td className="bg-[#fff9e6] text-right font-bold py-1.5">
                  TOTAL
                </td>
                <td className="bg-[#fff9e6] text-right font-bold py-1.5">
                  14.00
                </td>
                <td colSpan={4}></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <PdfFooter />
    </div>
  );
}
