import PdfFooter from "@/components/PdfFooter";
import PdfHeader from "@/components/PdfHeader";

export default function Report6({ print }: { print: boolean }) {
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
        {/* PESO Deposits Section */}
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-3">PESO Deposits</h2>
          <div className="border border-black rounded-lg overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="px-2 py-1.5 text-left">Account Name</th>
                  <th className="px-2 py-1.5 text-left">Product Description</th>
                  <th className="px-2 py-1.5 text-left">Reference No.</th>
                  <th className="px-2 py-1.5 text-left">Value Date</th>
                  <th className="px-2 py-1.5 text-right">Principal Amount</th>
                  <th className="px-2 py-1.5 text-right">Interest Rate</th>
                  <th className="px-2 py-1.5 text-center">Term</th>
                  <th className="px-2 py-1.5 text-left">Maturity Date</th>
                  <th className="px-2 py-1.5 text-right">Maturity Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1.5">XX</td>
                  <td className="px-2 py-1.5"></td>
                  <td className="px-2 py-1.5">1234567</td>
                  <td className="px-2 py-1.5">17-Mar-24</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right">2.0000%</td>
                  <td className="px-2 py-1.5 text-center">30 days</td>
                  <td className="px-2 py-1.5">17-Mar-24</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                </tr>
                <tr>
                  <td className="px-2 py-1.5">XX</td>
                  <td className="px-2 py-1.5"></td>
                  <td className="px-2 py-1.5">1234567</td>
                  <td className="px-2 py-1.5">17-Mar-24</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right">2.0000%</td>
                  <td className="px-2 py-1.5 text-center">30 days</td>
                  <td className="px-2 py-1.5">17-Mar-24</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                </tr>
                <tr>
                  <td colSpan={4}></td>
                  <td className="bg-amber-50 px-2 py-1.5 text-right font-bold">
                    14.00
                  </td>
                  <td colSpan={3}></td>
                  <td className="bg-amber-50 px-2 py-1.5 text-right font-bold">
                    14.00
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* US Dollar Deposits Section */}
        <div className="mb-4">
          <h2 className="text-lg font-bold mb-3">US Dollar Deposits</h2>
          <div className="border border-black rounded-lg overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="px-2 py-1.5 text-left">Account Name</th>
                  <th className="px-2 py-1.5 text-left">Product Description</th>
                  <th className="px-2 py-1.5 text-left">Reference No.</th>
                  <th className="px-2 py-1.5 text-left">Value Date</th>
                  <th className="px-2 py-1.5 text-right">Principal Amount</th>
                  <th className="px-2 py-1.5 text-right">Interest Rate</th>
                  <th className="px-2 py-1.5 text-center">Term</th>
                  <th className="px-2 py-1.5 text-left">Maturity Date</th>
                  <th className="px-2 py-1.5 text-right">Maturity Value</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-1.5">XX</td>
                  <td className="px-2 py-1.5"></td>
                  <td className="px-2 py-1.5">1234567</td>
                  <td className="px-2 py-1.5">17-Mar-24</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right">2.0000%</td>
                  <td className="px-2 py-1.5 text-center">30 days</td>
                  <td className="px-2 py-1.5">17-Mar-24</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                </tr>
                <tr>
                  <td className="px-2 py-1.5">XX</td>
                  <td className="px-2 py-1.5"></td>
                  <td className="px-2 py-1.5">1234567</td>
                  <td className="px-2 py-1.5">17-Mar-24</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right">2.0000%</td>
                  <td className="px-2 py-1.5 text-center">30 days</td>
                  <td className="px-2 py-1.5">17-Mar-24</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                </tr>
                <tr>
                  <td colSpan={4}></td>
                  <td className="bg-amber-50 px-2 py-1.5 text-right font-bold">
                    14.00
                  </td>
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
