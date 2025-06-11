import PdfFooter from "@/components/PdfFooter";
import PdfHeader from "@/components/PdfHeader";

export default function Report5({ print }: { print: boolean }) {
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
      <div className="p-4 flex-1">
        <h2 className="text-lg font-bold mb-3">Derivatives Products</h2>

        {/* Interest Rate Swap Section */}
        <div className="mb-4">
          <h3 className="text-sm font-bold mb-2">Interest Rate Swap</h3>
          <div className="border border-black rounded-lg overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="px-2 py-1.5 text-left">Reference Number</th>
                  <th className="px-2 py-1.5 text-left">Start Date</th>
                  <th className="px-2 py-1.5 text-left">End Date</th>
                  <th className="px-2 py-1.5 text-left">Currency</th>
                  <th className="px-2 py-1.5 text-right">Pay Leg Principal</th>
                  <th className="px-2 py-1.5 text-right">
                    Receive Leg Principal
                  </th>
                  <th className="px-2 py-1.5 text-right">Pay Leg Rate</th>
                  <th className="px-2 py-1.5 text-right">Receive Leg Rate</th>
                  <th className="px-2 py-1.5 text-right">MTM Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1.5">111111</td>
                  <td className="px-2 py-1.5">17-Mar-24</td>
                  <td className="px-2 py-1.5">17-Mar-24</td>
                  <td className="px-2 py-1.5">PHP</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right">1.0000%</td>
                  <td className="px-2 py-1.5 text-right">2.0000%</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                </tr>
                <tr>
                  <td colSpan={7}></td>
                  <td className="bg-amber-50 px-2 py-1.5 text-center font-bold">
                    TOTAL
                  </td>
                  <td className="bg-amber-50 px-2 py-1.5 text-right font-bold">
                    14.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Cross Currency Swap Section */}
        <div className="mb-4">
          <h3 className="text-sm font-bold mb-2">Cross Currency Swap</h3>
          <div className="border border-black rounded-lg overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="px-2 py-1.5 text-left">Reference Number</th>
                  <th className="px-2 py-1.5 text-left">Start Date</th>
                  <th className="px-2 py-1.5 text-left">End Date</th>
                  <th className="px-2 py-1.5 text-left">Currency Pair</th>
                  <th className="px-2 py-1.5 text-right">FX Rate</th>
                  <th className="px-2 py-1.5 text-right">Pay Leg Principal</th>
                  <th className="px-2 py-1.5 text-right">
                    Receive Leg Principal
                  </th>
                  <th className="px-2 py-1.5 text-right">Pay Leg Rate</th>
                  <th className="px-2 py-1.5 text-right">Receive Leg Rate</th>
                  <th className="px-2 py-1.5 text-right">MTM Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1.5">111111</td>
                  <td className="px-2 py-1.5">17-Mar-24</td>
                  <td className="px-2 py-1.5">17-Mar-24</td>
                  <td className="px-2 py-1.5">PHP / USD</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right">PHP 2.00</td>
                  <td className="px-2 py-1.5 text-right">PHP 2.00</td>
                  <td className="px-2 py-1.5 text-right">1.0000%</td>
                  <td className="px-2 py-1.5 text-right">2.0000%</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                </tr>
                <tr>
                  <td colSpan={8}></td>
                  <td className="bg-amber-50 px-2 py-1.5 text-center font-bold">
                    TOTAL
                  </td>
                  <td className="bg-amber-50 px-2 py-1.5 text-right font-bold">
                    14.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <PdfFooter />
    </div>
  );
}
