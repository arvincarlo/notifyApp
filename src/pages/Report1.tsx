import PdfFooter from "@/components/PdfFooter";
import PdfHeader from "@/components/PdfHeader";

export default function Report1({ print }: { print: boolean }) {
  return (
    <>
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

        <div className="p-3 bg-white">
        <div className="border border-black border-300 rounded-lg p-2 mb-4 mt-2">
          <table className="w-[60%] text-sm">
            <thead>
              <tr>
                <th className="text-left py-1">Account Name</th>
                <th className="text-left py-1">Branch</th>
                <th className="text-left py-1">Product Description</th>
                <th className="text-left py-1">Account / Reference No.</th>
                <th className="text-right py-1">Current Balance</th>
                <th className="text-right py-1">Available Balance</th>
              </tr>
            </thead>
            {/* Table body remains the same but with reduced padding */}
            <tbody className="text-sm">
              {/* PHP Section */}
              <tr>
                <td colSpan={6} className="py-1 font-bold">
                  PHP
                </td>
              </tr>
              {[
                { branch: "Makati Main", type: "Checking", amount: "2.00" },
                { branch: "Makati Main", type: "Savings", amount: "3.00" },
                { branch: "Makati Main", type: "Savings", amount: "4.00" },
              ].map((item, index) => (
                <tr key={`php-${index}`}>
                  <td>XXX</td>
                  <td>{item.branch}</td>
                  <td>{item.type}</td>
                  <td>111111</td>
                  <td className="text-right">{item.amount}</td>
                  <td className="text-right">{item.amount}</td>
                </tr>
              ))}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td className="bg-[#fff9e6] font-bold">TOTAL</td>
                <td className="bg-[#fff9e6] text-right font-bold">14.00</td>
                <td className="bg-[#fff9e6] text-right font-bold">14.00</td>
              </tr>

              {/* USD Section */}
              <tr>
                <td colSpan={6} className="py-1 font-bold">
                  USD
                </td>
              </tr>
              {[
                { branch: "Makati Main", type: "Checking", amount: "2.00" },
                { branch: "Makati Main", type: "Savings", amount: "3.00" },
                { branch: "Makati Main", type: "Savings", amount: "4.00" },
              ].map((item, index) => (
                <tr key={`usd-${index}`}>
                  <td>XXX</td>
                  <td>{item.branch}</td>
                  <td>{item.type}</td>
                  <td>111111</td>
                  <td className="text-right">{item.amount}</td>
                  <td className="text-right">{item.amount}</td>
                </tr>
              ))}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td className="bg-[#fff9e6] font-bold">TOTAL</td>
                <td className="bg-[#fff9e6] text-right font-bold">14.00</td>
                <td className="bg-[#fff9e6] text-right font-bold">14.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Time Deposits Section */}
        <div className="border border-black rounded-lg p-2">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-1">Account Name</th>
                <th className="text-left py-1">Branch</th>
                <th className="text-left py-1">Product Description</th>
                <th className="text-left py-1">Account / Reference No.</th>
                <th className="text-left py-1">Value Date</th>
                <th className="text-right py-1">Principal Amount</th>
                <th className="text-right py-1">Interest Rate</th>
                <th className="text-center py-1">Term</th>
                <th className="text-center py-1">Maturity Date</th>
                <th className="text-right py-1">Maturity Value</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {/* PHP Section */}
              <tr>
                <td colSpan={10} className="py-1 font-bold">
                  PHP
                </td>
              </tr>
              {[
                { type: "Time Deposit", date: "17-Mar-24", amount: "2.00" },
                { type: "PSA", date: "18-Mar-24", amount: "3.00" },
              ].map((item, index) => (
                <tr key={`php-td-${index}`}>
                  <td>XXX</td>
                  <td>Makati Main</td>
                  <td>{item.type}</td>
                  <td>111111</td>
                  <td>{item.date}</td>
                  <td className="text-right">{item.amount}</td>
                  <td className="text-right">2.0000%</td>
                  <td className="text-center">180 days</td>
                  <td className="text-center">{item.date}</td>
                  <td className="text-right">{item.amount}</td>
                </tr>
              ))}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td className="font-bold bg-[#fff9e6]">TOTAL</td>
                <td className="text-right font-bold bg-[#fff9e6]">14.00</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className="text-right font-bold bg-[#fff9e6]">14.00</td>
              </tr>

              {/* USD Section */}
              <tr>
                <td colSpan={10} className="py-1 font-bold">
                  USD
                </td>
              </tr>
              {[
                { date: "17-Mar-24", amount: "2.00" },
                { date: "18-Mar-24", amount: "3.00" },
              ].map((item, index) => (
                <tr key={`usd-td-${index}`}>
                  <td>XXX</td>
                  <td>Makati Main</td>
                  <td>Time Deposit</td>
                  <td>111111</td>
                  <td>{item.date}</td>
                  <td className="text-right">{item.amount}</td>
                  <td className="text-right">2.0000%</td>
                  <td className="text-center">180 days</td>
                  <td className="text-center">{item.date}</td>
                  <td className="text-right">{item.amount}</td>
                </tr>
              ))}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td className="font-bold bg-[#fff9e6]">TOTAL</td>
                <td className="text-right font-bold bg-[#fff9e6]">14.00</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td className="text-right font-bold bg-[#fff9e6]">14.00</td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>
        <PdfFooter />
      </div>
    </>
  );
}
