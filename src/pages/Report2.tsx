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
          {/* Fixed Income Section */}
          <div>
            <h2 className="text-lg font-bold mb-2">Fixed Income</h2>

            {/* NOCD Account Section */}
            <div className="mb-3">
              <p className="mb-1 text-sm">NOCD Account Name:</p>
              <div className="border border-black rounded-lg p-2">
                <table className="w-full text-xs [&_tr]:h-8">
                  <thead>
                    <tr>
                      <th className="text-left py-1">Product Description</th>
                      <th className="text-left py-1">Reference No.</th>
                      <th className="text-left py-1">Value Date</th>
                      <th className="text-left py-1">Face Value</th>
                      <th className="text-left py-1">Interest Rate</th>
                      <th className="text-left py-1">Maturity Date</th>
                      <th className="text-left py-1">Next Coupon Date</th>
                      <th className="text-right py-1">Cost Price</th>
                      <th className="text-right py-1">Market Price</th>
                      <th className="text-right py-1">Accrued Interest</th>
                      <th className="text-right py-1">Market Value</th>
                      <th className="text-right py-1">Unrealized Gain/Loss</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* PHP Section */}
                    <tr>
                      <td colSpan={12} className="py-1 font-bold">
                        PHP
                      </td>
                    </tr>
                    <tr>
                      <td>SMC Global Power Bonds 2024</td>
                      <td>ISIN</td>
                      <td>17-Mar-24</td>
                      <td>2.00</td>
                      <td>2.0000%</td>
                      <td>17-Mar-24</td>
                      <td>17-Mar-24</td>
                      <td className="text-right">1.00</td>
                      <td className="text-right">1.00</td>
                      <td className="text-right">1.00</td>
                      <td className="text-right">1.00</td>
                      <td className="text-right text-green-600">1.00↗</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td className="bg-[#fff9e6] font-bold">TOTAL</td>
                      <td className="bg-[#fff9e6] font-bold">14.00</td>
                      <td colSpan={8}></td>
                    </tr>

                    {/* USD Section */}
                    <tr>
                      <td colSpan={12} className="py-1 font-bold">
                        USD
                      </td>
                    </tr>
                    <tr>
                      <td>SMC Global Power Bonds 2024</td>
                      <td>ISIN</td>
                      <td>17-Mar-24</td>
                      <td>2.00</td>
                      <td>2.0000%</td>
                      <td>17-Mar-24</td>
                      <td>17-Mar-24</td>
                      <td className="text-right">1.00</td>
                      <td className="text-right">1.00</td>
                      <td className="text-right">1.00</td>
                      <td className="text-right">1.00</td>
                      <td className="text-right text-green-600">1.00↗</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td className="bg-[#fff9e6] font-bold">TOTAL</td>
                      <td className="bg-[#fff9e6] font-bold">14.00</td>
                      <td colSpan={8}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* NROSS Account Section */}
            <div>
              <p className="mb-1 text-sm">NROSS Account Name:</p>
              <div className="border border-black rounded-lg p-2">
                <table className="w-full text-xs [&_tr]:h-8">
                  <thead>
                    <tr>
                      <th className="text-left py-1">Product Description</th>
                      <th className="text-left py-1">Reference No.</th>
                      <th className="text-left py-1">Value Date</th>
                      <th className="text-left py-1">Face Value</th>
                      <th className="text-left py-1">Interest Rate</th>
                      <th className="text-left py-1">Maturity Date</th>
                      <th className="text-left py-1">Next Coupon Date</th>
                      <th className="text-right py-1">Cost Price</th>
                      <th className="text-right py-1">Market Price</th>
                      <th className="text-right py-1">Accrued Interest</th>
                      <th className="text-right py-1">Market Value</th>
                      <th className="text-right py-1">Unrealized Gain/Loss</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* PHP Section */}
                    <tr>
                      <td colSpan={12} className="py-1 font-bold">
                        PHP
                      </td>
                    </tr>
                    <tr>
                      <td>SMC Global Power Bonds 2024</td>
                      <td>ISIN</td>
                      <td>17-Mar-24</td>
                      <td>2.00</td>
                      <td>2.0000%</td>
                      <td>17-Mar-24</td>
                      <td>17-Mar-24</td>
                      <td className="text-right">1.00</td>
                      <td className="text-right">1.00</td>
                      <td className="text-right">1.00</td>
                      <td className="text-right">1.00</td>
                      <td className="text-right text-green-600">1.00↗</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td></td>
                      <td className="bg-[#fff9e6] font-bold">TOTAL</td>
                      <td className="bg-[#fff9e6] font-bold">14.00</td>
                      <td colSpan={8}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <PdfFooter />
      </div>
    </>
  );
}
