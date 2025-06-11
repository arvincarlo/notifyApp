import "./TrustPortfolioPdf.css";
export default function TrustPortfolioPdf() {
  return (
    <div>
      <div className="tables-label flex items-center text-white font-weight-700 padding-10px">
        Trust Portfolio
      </div>
      <div className="table-container">
        <h2>Fixed Deposits</h2>
        <table>
          <thead>
            <tr>
              <th>Account Name</th>
              <th>Product Description</th>
              <th>Reference No.</th>
              <th>Value Date</th>
              <th>Principal Amount</th>
              <th>Interest Rate</th>
              <th>Term</th>
              <th>Maturity Date</th>
              <th>Maturity Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>XX</td>
              <td></td>
              <td>1234567</td>
              <td>17-Mar-24</td>
              <td>2.00</td>
              <td>2.0000%</td>
              <td>30 days</td>
              <td>17-Mar-24</td>
              <td>2.00</td>
            </tr>
            <tr>
              <td>XX</td>
              <td></td>
              <td>1234567</td>
              <td>17-Mar-24</td>
              <td>2.00</td>
              <td>2.0000%</td>
              <td>30 days</td>
              <td>17-Mar-24</td>
              <td>2.00</td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td className="highlight-total">TOTAL</td>
              <td className="highlight-total">14.00</td>
              <td></td>
              <td></td>
              <td></td>
              <td className="highlight-total">14.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
