import { useMemo, useRef, useState } from "react";
import "./summary.css";
import { ReportProps } from "@/pages/Report";
import { formatMoney, generatePercentage } from "@/lib/utils";
import DonutChart from "./Donut";

export default function Summary(
  reportDetail: ReportProps = {
    moneyMarketValue: "",
    fixedIncomeValue: "",
    equitiesValue: "",
    structuredProductsValue: "",
    unitTrustsValue: "",
    month: "",
    year: "",
    accountName: "",
  },
  percentages: any
) {
  const total = useMemo(() => {
    if (reportDetail.moneyMarketValue === undefined) return 0;
    return (
      reportDetail.moneyMarketValue +
      reportDetail.fixedIncomeValue +
      reportDetail.equitiesValue +
      reportDetail.structuredProductsValue +
      reportDetail.unitTrustsValue
    );
  }, [
    reportDetail.moneyMarketValue,
    reportDetail.fixedIncomeValue,
    reportDetail.equitiesValue,
    reportDetail.structuredProductsValue,
    reportDetail.unitTrustsValue,
  ]);

  const data = [
    {
      name: "Money Market",
      value: reportDetail.moneyMarketP,
      color: "#F8A5A5",
    },
    { name: "Equities", value: reportDetail.equitiesP, color: "#8B1818" },
    {
      name: "Fixed Income",
      value: reportDetail.fixedIncomeP,
      color: "#D32F2F",
    },
    {
      name: "Unit Trusts",
      value: reportDetail.unitTrustsP,
      color: "#FFCDD2",
    },
    {
      name: "Structured Products & Other Investments",
      value: reportDetail.structuredProductsP,
      color: "#7B1818",
    },
  ];
  const data1 = [
    {
      name: "Money Market",
      value: reportDetail.moneyMarketP,
      color: "#F8A5A5",
    },
    { name: "Equities", value: reportDetail.equitiesP, color: "#8B1818" },
    {
      name: "Fixed Income",
      value: reportDetail.fixedIncomeP,
      color: "#D32F2F",
    },
    {
      name: "Unit Trusts",
      value: reportDetail.unitTrustsP,
      color: "#FFCDD2",
    },
    {
      name: "Structured Products & Other Investments",
      value: reportDetail.structuredProductsP,
      color: "#7B1818",
    },
  ];
  return (
    <>
      <div className="document-title">Portfolio Holdings Statement</div>
      <div>
        as of {reportDetail.month}, {reportDetail.year} for
      </div>
      <div className="summay-full-name uppercase">
        {reportDetail.accountName}
      </div>
      <div className="flex gap-10px">
        <div className="summary-cards">
          <div className="summay-card">
            <div className="summay-card-header flex items-center bg-primary">
              Total AUM This Month
            </div>
            <div className="summay-card-content-total-aum width-full summay-card-content border-bottom">
              <div className="height-full flex items-center">
                <div>
                  <div className="currency font-weight-600">PHP</div>
                  <div className="amount font-weight-600">600,000,000.00</div>
                </div>
              </div>
            </div>
            <div className="summay-card-subheader summay-card-content width-full flex items-center font-weight-600 border-bottom">
              Total AUM Last Month*
            </div>
            <div className="summay-card-content flex items-center border-bottom">
              <div>
                <div className="currency font-weight-600">PHP</div>
                <div className="amount font-weight-600">525,400,032.96</div>
                <div className="report-note text-primary font-weight-500">
                  *Based on last month’s report
                </div>
              </div>
            </div>
            <div className="summay-card-subheader summay-card-content flex items-center font-weight-600 border-bottom">
              AUM Change
            </div>
            <div className="summay-card-content flex items-center">
              <div>
                <div className="currency font-weight-600">PHP</div>
                <div className="amount font-weight-600">525,400,032.96</div>
                <div className="change">
                  <div className="font-weight-600">% Change</div>
                  <div className="font-weight-600">+9.5% &#9650;</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="summary-breakdown">
          <table className="summary-table">
            <tbody className="font-weight-600">
              <tr className="summary-table-header bg-primary text-white">
                <td className="summary-table-heading-1">Portfolio Summary</td>
                <td className="summary-table-heading-2" colspan="6">
                  Current Value in Original Currency
                </td>
              </tr>
              <tr>
                <td className="summary-table-label"></td>
                <td className="text-primary">PHP</td>
                <td className="text-primary">
                  USD<sup>1</sup>
                </td>
                <td className="text-primary">
                  EUR<sup>2</sup>
                </td>
                <td className="text-primary">
                  CNY<sup>3</sup>
                </td>
                <td className="text-primary">
                  JPY<sup>4</sup>
                </td>
                <td className="text-primary">Others</td>
              </tr>
              <tr>
                <td className="summary-table-label text-primary">
                  Total Bank Portfolio
                </td>
                <td>12,000,000.00</td>
                <td>10,000.00</td>
                <td>10,000.00</td>
                <td>10,000.00</td>
                <td>10,000.00</td>
                <td>10,000.00</td>
              </tr>
              <tr>
                <td className="summary-table-label text-primary">
                  Total Trust Portfolio
                </td>
                <td>3,000,000.00</td>
                <td>5,000.00</td>
                <td>5,000.00</td>
                <td>5,000.00</td>
                <td>5,000.00</td>
                <td>5,000.00</td>
              </tr>
              <tr>
                <td className="summary-table-label text-primary">
                  Total CBC Securities Portfolio
                </td>
                <td>9,000,000.00</td>
                <td>13,000.00</td>
                <td>13,000.00</td>
                <td>13,000.00</td>
                <td>13,000.00</td>
                <td>13,000.00</td>
              </tr>
              <tr>
                <td className="summary-table-label text-primary uppercase font-weight-700">
                  Grand Total
                </td>
                <td>24,000,000.00</td>
                <td>28,000.00</td>
                <td>28,000.00</td>
                <td>28,000.00</td>
                <td>28,000.00</td>
                <td>28,000.00</td>
              </tr>
            </tbody>
          </table>
          <div className="flex gap-30px">
            <div className="summary-portfolio-holdings">
              <div className="flex">
                <div className="chart-container">
                  <div className="donut-chart-title font-weight-600">
                    Product Holdings
                  </div>
                  <div className="flex align-center justify-center">
                    <DonutChart data={data1} containerId="chart1" />
                  </div>
                </div>
                <div className="chart-breakdown-container">
                  <table className="chart-breakdown-table width-full">
                    <tbody>
                      <tr className="chart-breakdown-header">
                        <td className="chart-breakdown-heading text-white text-center font-weight-700 bg-primary">
                          Product className
                        </td>
                        <td className="chart-breakdown-heading text-white text-center font-weight-700 bg-primary">
                          Current Value
                          <br />
                          in PHP
                        </td>
                        <td className="chart-breakdown-heading text-white text-center font-weight-700 bg-primary">
                          % of Portfolio
                        </td>
                      </tr>
                      <tr>
                        <td className="chart-breakdown-label padding-10px text-primary font-weight-600">
                          Money Market
                        </td>
                        <td className="text-center">
                          {formatMoney(reportDetail.moneyMarketValue)}
                        </td>
                        <td className="text-center">
                          {Number(reportDetail.moneyMarketValue) / Number(total)
                            ? generatePercentage(
                                Number(reportDetail.moneyMarketValue),
                                Number(total)
                              )
                            : 0}
                          %
                        </td>
                      </tr>
                      <tr>
                        <td className="chart-breakdown-label padding-10px text-primary font-weight-600">
                          Fixed Income
                        </td>
                        <td className="text-center">
                          {formatMoney(reportDetail.fixedIncomeValue)}
                        </td>
                        <td className="text-center">
                          {" "}
                          {Number(reportDetail.fixedIncomeValue) / Number(total)
                            ? generatePercentage(
                                Number(reportDetail.fixedIncomeValue),
                                Number(total)
                              )
                            : 0}
                          %
                        </td>
                      </tr>
                      <tr>
                        <td className="chart-breakdown-label padding-10px text-primary font-weight-600">
                          Equities
                        </td>
                        <td className="text-center">
                          {formatMoney(reportDetail.equitiesValue)}
                        </td>
                        <td className="text-center">
                          {" "}
                          {Number(reportDetail.equitiesValue) / Number(total)
                            ? generatePercentage(
                                Number(reportDetail.equitiesValue),
                                Number(total)
                              )
                            : 0}
                          %
                        </td>
                      </tr>
                      <tr>
                        <td className="chart-breakdown-label padding-10px text-primary font-weight-600">
                          Structured Products
                          <br />& Other Investments
                        </td>
                        <td className="text-center">
                          {formatMoney(reportDetail.structuredProductsValue)}
                        </td>
                        <td className="text-center">
                          {" "}
                          {Number(reportDetail.structuredProductsValue) /
                          Number(total)
                            ? generatePercentage(
                                Number(reportDetail.structuredProductsValue),
                                Number(total)
                              )
                            : 0}
                          %
                        </td>
                      </tr>
                      <tr>
                        <td className="chart-breakdown-label padding-10px text-primary font-weight-600">
                          Unit Trusts
                        </td>
                        <td className="text-center">
                          {formatMoney(reportDetail.unitTrustsValue)}
                        </td>
                        <td className="text-center">
                          {" "}
                          {Number(reportDetail.unitTrustsValue) / Number(total)
                            ? generatePercentage(
                                Number(reportDetail.unitTrustsValue),
                                Number(total)
                              )
                            : 0}
                          %
                        </td>
                      </tr>
                      <tr>
                        <td className="chart-breakdown-label padding-10px uppercase text-primary font-weight-600">
                          Total
                        </td>
                        <td className="text-center">{formatMoney(total)}</td>
                        <td className="text-center">100%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="legend-container">
              <div className="font-weight-600">Currency</div>
              <div className="flex">
                <div className="margin-top">
                  <div className="legend-label flex">
                    <div className="square-indicator php"></div>
                    &nbsp;PHP
                  </div>
                  <div className="legend-label flex">
                    <div className="square-indicator usd"></div>
                    &nbsp;USD<sup>1</sup>
                  </div>
                  <div className="legend-label flex">
                    <div className="square-indicator eur"></div>
                    &nbsp;EUR<sup>2</sup>
                  </div>
                  <div className="legend-label flex">
                    <div className="square-indicator cny"></div>
                    &nbsp;CNY<sup>3</sup>
                  </div>
                  <div className="legend-label flex">
                    <div className="square-indicator jpy"></div>
                    &nbsp;JPY<sup>4</sup>
                  </div>
                </div>
                <div className="flex align-center justify-center -mt-10 -ml-2">
                  <DonutChart data={data} containerId="chart1" />
                </div>
              </div>
              <div className="summary-appendix-container">
                <div className="summary-appendix text-primary">
                  <div>
                    Foreign Currency Exchange Rates as of April 23, 2024
                  </div>
                  <div>1 USD - 58.00</div>
                  <div>2 EUR - 67.00</div>
                  <div>3 CNY - 45.00</div>
                  <div>4 JPY - 50.00</div>
                </div>
                <img className="footer-logo" src="./images/footer-logo.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
