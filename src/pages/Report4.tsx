import PdfFooter from "@/components/PdfFooter";
import PdfHeader from "@/components/PdfHeader";

export default function Report4({ print }: { print: boolean }) {
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
        <h2 className="text-lg font-bold mb-3">Structured Products</h2>

        {/* Premium Yield Advantage (PYA) Section */}
        <div className="mb-4">
          <h3 className="text-sm font-bold mb-2">
            Premium Yield Advantage (PYA)
          </h3>
          <div className="border border-black rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="px-2 py-1.5 text-left">Bundle Number</th>
                  <th className="px-2 py-1.5 text-left">Value Date</th>
                  <th className="px-2 py-1.5 text-left">Maturity Date</th>
                  <th className="px-2 py-1.5 text-left">Currency Pair</th>
                  <th className="px-2 py-1.5 text-right">Face Value</th>
                  <th className="px-2 py-1.5 text-right">PYA Yield</th>
                  <th className="px-2 py-1.5 text-center">Term</th>
                  <th className="px-2 py-1.5 text-right">Maturity Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1.5">111111</td>
                  <td className="px-2 py-1.5">17-Mar-24</td>
                  <td className="px-2 py-1.5">17-Mar-24</td>
                  <td className="px-2 py-1.5">USD / PHP</td>
                  <td className="px-2 py-1.5 text-right">PHP 2.00</td>
                  <td className="px-2 py-1.5 text-right">2.0000%</td>
                  <td className="px-2 py-1.5 text-center">90 days</td>
                  <td className="px-2 py-1.5 text-right">PHP 4.00</td>
                </tr>
                <tr>
                  <td colSpan={3}></td>
                  <td className="bg-amber-50 px-2 py-1.5 text-center font-bold">
                    TOTAL
                  </td>
                  <td className="bg-amber-50 px-2 py-1.5 text-right font-bold">
                    PHP 14.00
                  </td>
                  <td></td>
                  <td className="bg-amber-50 px-2 py-1.5 text-right font-bold">
                    TOTAL
                  </td>
                  <td className="bg-amber-50 px-2 py-1.5 text-right font-bold">
                    PHP 14.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Asset Swap Section */}
        <div className="mb-4">
          <h3 className="text-sm font-bold mb-2">Asset Swap</h3>
          <div className="border border-black rounded-lg overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="px-2 py-1.5 text-left">Bundle Number</th>
                  <th className="px-2 py-1.5 text-left">Value Date</th>
                  <th className="px-2 py-1.5 text-left">Maturity Date</th>
                  <th className="px-2 py-1.5 text-left">Currency Pair</th>
                  <th className="px-2 py-1.5 text-left">Underlying Security</th>
                  <th className="px-2 py-1.5 text-right">
                    Security Face Value
                  </th>
                  <th className="px-2 py-1.5 text-right">Security Price</th>
                  <th className="px-2 py-1.5 text-right">FX Rate</th>
                  <th className="px-2 py-1.5 text-right">FX Face Value</th>
                  <th className="px-2 py-1.5 text-right">Asset Swap Yield</th>
                  <th className="px-2 py-1.5 text-right">Total Proceeds</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1.5">111111</td>
                  <td className="px-2 py-1.5">17-Mar-24</td>
                  <td className="px-2 py-1.5">17-Mar-24</td>
                  <td className="px-2 py-1.5">PHP / USD</td>
                  <td className="px-2 py-1.5">XXX</td>
                  <td className="px-2 py-1.5 text-right">PHP 2.00</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right">PHP 2.00</td>
                  <td className="px-2 py-1.5 text-right">2.0000%</td>
                  <td className="px-2 py-1.5 text-right">PHP 2.00</td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="bg-amber-50 px-2 py-1.5 text-right font-bold">
                    TOTAL
                  </td>

                  <td className="bg-amber-50 px-2 py-1.5 text-right font-bold">
                    PHP 14.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Structured Notes Section */}
        <div>
          <h3 className="text-sm font-bold mb-2">Structured Notes</h3>
          <div className="border border-black rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="px-2 py-1.5 text-left">Reference Number</th>
                  <th className="px-2 py-1.5 text-left">Value Date</th>
                  <th className="px-2 py-1.5 text-right">Face Value</th>
                  <th className="px-2 py-1.5 text-left">Maturity Date</th>
                  <th className="px-2 py-1.5 text-left">Security Name</th>
                  <th className="px-2 py-1.5 text-right">Price</th>
                  <th className="px-2 py-1.5 text-right">Market Price</th>
                  <th className="px-2 py-1.5 text-right">Market Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1.5">111111</td>
                  <td className="px-2 py-1.5">17-Mar-24</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5">17-Mar-24</td>
                  <td className="px-2 py-1.5">XXXX</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                </tr>
                <tr>
                  <td colSpan={2}></td>
                  <td className="bg-amber-50 px-2 py-1.5 text-right font-bold">
                    TOTAL
                  </td>
                  <td className="bg-amber-50 px-2 py-1.5 text-right font-bold">
                    14.00
                  </td>
                  <td colSpan={4}></td>
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
