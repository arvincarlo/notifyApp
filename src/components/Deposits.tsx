import React from "react";
import "./Deposits.css";
interface DepositAccount {
  accountName: string;
  branch: string;
  productDescription: string;
  accountNo: string;
  currentBalance: number;
  availableBalance: number;
}

interface CurrencyGroup {
  currency: string;
  accounts: DepositAccount[];
}

const depositData: { [key: string]: CurrencyGroup } = {
  php: {
    currency: "PHP",
    accounts: [
      {
        accountName: "XXX",
        branch: "Makati Main",
        productDescription: "Checking",
        accountNo: "111111",
        currentBalance: 2.0,
        availableBalance: 2.0,
      },
      {
        accountName: "XXX",
        branch: "Makati Main",
        productDescription: "Savings",
        accountNo: "111111",
        currentBalance: 3.0,
        availableBalance: 3.0,
      },
      {
        accountName: "XXX",
        branch: "Makati Main",
        productDescription: "Savings",
        accountNo: "111111",
        currentBalance: 4.0,
        availableBalance: 4.0,
      },
    ],
  },
  usd: {
    currency: "USD",
    accounts: [
      {
        accountName: "XXX",
        branch: "Makati Main",
        productDescription: "Checking",
        accountNo: "111111",
        currentBalance: 2.0,
        availableBalance: 2.0,
      },
      {
        accountName: "XXX",
        branch: "Makati Main",
        productDescription: "Savings",
        accountNo: "111111",
        currentBalance: 3.0,
        availableBalance: 3.0,
      },
      {
        accountName: "XXX",
        branch: "Makati Main",
        productDescription: "Savings",
        accountNo: "111111",
        currentBalance: 4.0,
        availableBalance: 4.0,
      },
    ],
  },
};
const DepositReport = () => {
  return (
    <div className="deposit-container">
      <h2>Deposits</h2>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Account Name</th>
              <th>Branch</th>
              <th>Product Description</th>
              <th>Account / Reference No.</th>
              <th>Current Balance</th>
              <th>Available Balance</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(depositData).map(([key, data]) => (
              <React.Fragment key={key}>
                <tr className="currency-row">
                  <td className="currency-cell">{data.currency}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                {data.accounts.map((account, index) => (
                  <tr key={index}>
                    <td>{account.accountName}</td>
                    <td>{account.branch}</td>
                    <td>{account.productDescription}</td>
                    <td>{account.accountNo}</td>
                    <td className="number">
                      {account.currentBalance.toFixed(2)}
                    </td>
                    <td className="number">
                      {account.availableBalance.toFixed(2)}
                    </td>
                  </tr>
                ))}
                <tr className="total-row">
                  <td colSpan={4} className="total-label">
                    TOTAL
                  </td>
                  <td className="number total-value">
                    {data.accounts
                      .reduce((sum, acc) => sum + acc.currentBalance, 0)
                      .toFixed(2)}
                  </td>
                  <td className="number total-value">
                    {data.accounts
                      .reduce((sum, acc) => sum + acc.availableBalance, 0)
                      .toFixed(2)}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepositReport;
