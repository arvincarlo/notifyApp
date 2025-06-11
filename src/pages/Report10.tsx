import PdfFooter from "@/components/PdfFooter";
import PdfHeader from "@/components/PdfHeader";

export default function Report10({ print }: { print: boolean }) {
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
        <span>Trust Portfolio</span>
      </div>

      {/* Content */}
      <div className="p-4 flex-1">
        {/* PESO Equities Section */}
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-3">Fixed Income (PHP)</h2>
          <div className="border border-black rounded-lg overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="px-2 py-1.5 text-left">Product Description</th>
                  <th className="px-2 py-1.5 text-left">Reference No.</th>
                  <th className="px-2 py-1.5 text-left">Value Date</th>
                  <th className="px-2 py-1.5 text-right">Purchase Amount</th>
                  <th className="px-2 py-1.5 text-right">No. of Shares</th>
                  <th className="px-2 py-1.5 text-right">Dividend Rate</th>
                  <th className="px-2 py-1.5 text-left">
                    Optional Redemption Date
                  </th>
                  <th className="px-2 py-1.5 text-right">Cost Price</th>
                  <th className="px-2 py-1.5 text-right">Market Price</th>
                  <th className="px-2 py-1.5 text-right">Market Value</th>
                  <th className="px-2 py-1.5 text-right">
                    Unrealized Gain/Loss
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1.5">
                    PHP
                    <br />
                    Jollibee Food Corporation
                    <br />
                    Series B - Preferred Shares
                  </td>
                  <td className="px-2 py-1.5">1234566</td>
                  <td className="px-2 py-1.5">17-Mar-24</td>
                  <td className="px-2 py-1.5 text-right">1,000,000.00</td>
                  <td className="px-2 py-1.5 text-right">100</td>
                  <td className="px-2 py-1.5 text-right">1.0000%</td>
                  <td className="px-2 py-1.5">17-Mar-24</td>
                  <td className="px-2 py-1.5 text-right">1.00</td>
                  <td className="px-2 py-1.5 text-right">1.00</td>
                  <td className="px-2 py-1.5 text-right">1.00</td>
                  <td className="px-2 py-1.5 text-right text-red-600">1.00↘</td>
                </tr>
                <tr>
                  <td colSpan={3}></td>
                  <td className="bg-amber-50 px-2 py-1.5 text-right font-bold">
                    14.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* USD Equities Section */}
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-3">Fixed Income (USD)</h2>
          <div className="border border-black rounded-lg overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="px-2 py-1.5 text-left">Product Description</th>
                  <th className="px-2 py-1.5 text-left">Reference No.</th>
                  <th className="px-2 py-1.5 text-left">Value Date</th>
                  <th className="px-2 py-1.5 text-right">Purchase Amount</th>
                  <th className="px-2 py-1.5 text-right">No. of Shares</th>
                  <th className="px-2 py-1.5 text-right">Dividend Rate</th>
                  <th className="px-2 py-1.5 text-left">
                    Optional Redemption Date
                  </th>
                  <th className="px-2 py-1.5 text-right">Cost Price</th>
                  <th className="px-2 py-1.5 text-right">Market Price</th>
                  <th className="px-2 py-1.5 text-right">Market Value</th>
                  <th className="px-2 py-1.5 text-right">
                    Unrealized Gain/Loss
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1.5">
                    PHP
                    <br />
                    Jollibee Food Corporation
                    <br />
                    Series B - Preferred Shares
                  </td>
                  <td className="px-2 py-1.5">1234566</td>
                  <td className="px-2 py-1.5">17-Mar-24</td>
                  <td className="px-2 py-1.5 text-right">1,000,000.00</td>
                  <td className="px-2 py-1.5 text-right">100</td>
                  <td className="px-2 py-1.5 text-right">1.0000%</td>
                  <td className="px-2 py-1.5">17-Mar-24</td>
                  <td className="px-2 py-1.5 text-right">1.00</td>
                  <td className="px-2 py-1.5 text-right">1.00</td>
                  <td className="px-2 py-1.5 text-right">1.00</td>
                  <td className="px-2 py-1.5 text-right text-red-600">1.00↘</td>
                </tr>
                <tr>
                  <td colSpan={3}></td>
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
