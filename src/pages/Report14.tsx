import PdfFooter from "@/components/PdfFooter";
import PdfHeader from "@/components/PdfHeader";

export default function Report14({ print }: { print: boolean }) {
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
        <span>Cash Transaction History</span>
      </div>

      {/* Content */}
      <div className="p-4 flex-1">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="font-bold">Account Name:</div>
            <div className="font-bold">Account Number:</div>
          </div>

          <div className="space-y-1">
            <div>
              <span className="font-bold">Beginning Balance:</span>
              <span className="bg-[#FFFFE0] px-2 py-1 inline-block min-w-[100px]"></span>
            </div>
            <div>
              <span className="font-bold">Closing Balance:</span>
              <span className="bg-[#FFFFE0] px-2 py-1 inline-block min-w-[100px]"></span>
            </div>
          </div>

          <div className="space-y-1">
            <div>
              <span className="font-bold">Current Balance:</span>
              <span className="bg-[#FFFFE0] px-2 py-1 inline-block min-w-[100px]"></span>
            </div>
            <div>
              <span className="font-bold">Available Balance:</span>
              <span className="bg-[#FFFFE0] px-2 py-1 inline-block min-w-[100px]"></span>
            </div>
          </div>
        </div>
        {/* PESO Equities Section */}
        <div className="mb-4">
          <h2 className="text-sm font-bold mb-3">PHP</h2>
          <div className="border border-black w-[85%] rounded-lg overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="px-2 py-1.5 text-left font-bold">
                    Value Date
                  </th>
                  <th className="px-2 py-1.5 text-left font-bold">
                    Description
                  </th>
                  <th className="px-2 py-1.5 text-right font-bold">Debit</th>
                  <th className="px-2 py-1.5 text-right font-bold">Credit</th>
                  <th className="px-2 py-1.5 text-right font-bold">
                    Running Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-2 py-1.5">17-Mar-24</td>
                  <td className="px-2 py-1.5"></td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right"></td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-1.5"></td>
                  <td className="px-2 py-1.5"></td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right"></td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-1.5"></td>
                  <td className="px-2 py-1.5"></td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right"></td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-1.5"></td>
                  <td className="px-2 py-1.5"></td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right"></td>
                </tr>
                <tr>
                  <td className="px-2 py-1.5"></td>
                  <td className="px-2 py-1.5"></td>
                  <td className="px-2 py-1.5 text-right bg-amber-50 font-bold">
                    TOTAL
                  </td>
                  <td className="px-2 py-1.5 text-right bg-amber-50 font-bold">
                    14.00
                  </td>
                  <td className="px-2 py-1.5 text-right font-bold"></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* USD Equities Section */}
        <div className="mb-4">
          <h2 className="text-sm font-bold mb-3">USD</h2>
          <div className="border border-black w-[85%] rounded-lg overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="px-2 py-1.5 text-left font-bold">
                    Value Date
                  </th>
                  <th className="px-2 py-1.5 text-left font-bold">
                    Description
                  </th>
                  <th className="px-2 py-1.5 text-right font-bold">Debit</th>
                  <th className="px-2 py-1.5 text-right font-bold">Credit</th>
                  <th className="px-2 py-1.5 text-right font-bold">
                    Running Balance
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-2 py-1.5">17-Mar-24</td>
                  <td className="px-2 py-1.5"></td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right"></td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-1.5"></td>
                  <td className="px-2 py-1.5"></td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right"></td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-1.5"></td>
                  <td className="px-2 py-1.5"></td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right"></td>
                </tr>
                <tr className="border-b">
                  <td className="px-2 py-1.5"></td>
                  <td className="px-2 py-1.5"></td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right">2.00</td>
                  <td className="px-2 py-1.5 text-right"></td>
                </tr>
                <tr>
                  <td className="px-2 py-1.5"></td>
                  <td className="px-2 py-1.5"></td>
                  <td className="px-2 py-1.5 text-right bg-amber-50 font-bold">
                    TOTAL
                  </td>
                  <td className="px-2 py-1.5 text-right bg-amber-50 font-bold">
                    14.00
                  </td>
                  <td className="px-2 py-1.5 text-right"></td>
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
