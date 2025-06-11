import PdfHeader from "@/components/PdfHeader";
import Summary from "@/components/summary";
import { useMemo } from "react";

const portfolioData = [
  { name: "Money Market", value: 30, color: "#F4A7A7" },
  { name: "Fixed Income", value: 15, color: "#D32F2F" },
  { name: "Equities", value: 15, color: "#6B1515" },
  {
    name: "Structured Products & Other Investments",
    value: 30,
    color: "#8B0000",
  },
  { name: "Unit Trusts", value: 10, color: "#FFCDD2" },
];

const currencyData = [
  { name: "PHP", value: 30, color: "#FFB6B6" },
  { name: "USD", value: 30, color: "#8B0000" },
  { name: "EUR", value: 15, color: "#CD5C5C" },
  { name: "CNY", value: 15, color: "#FF0000" },
  { name: "JPY", value: 10, color: "#DC143C" },
];

type PortfolioData = {
  portfolio: string;
  php: string;
  usd: string;
  eur: string;
  cny: string;
  jpy: string;
  others: string;
};

const portfolioData1: PortfolioData[] = [
  {
    portfolio: "Total Bank Portfolio",
    php: "12,000,000.00",
    usd: "10,000.00",
    eur: "10,000.00",
    cny: "10,000.00",
    jpy: "10,000.00",
    others: "10,000.00",
  },
  {
    portfolio: "Total Trust Portfolio",
    php: "3,000,000.00",
    usd: "5,000.00",
    eur: "5,000.00",
    cny: "5,000.00",
    jpy: "5,000.00",
    others: "5,000.00",
  },
  {
    portfolio: "Total CBC Securities Portfolio",
    php: "9,000,000.00",
    usd: "13,000.00",
    eur: "13,000.00",
    cny: "13,000.00",
    jpy: "13,000.00",
    others: "13,000.00",
  },
  {
    portfolio: "GRAND TOTAL",
    php: "24,000,000.00",
    usd: "28,000.00",
    eur: "28,000.00",
    cny: "28,000.00",
    jpy: "28,000.00",
    others: "28,000.00",
  },
];

const portfolioData2 = [
  {
    name: "Money Market",
    value: 30,
    amount: "250,000,000.00",
    color: "#F4A7A7",
  },
  { name: "Equities", value: 15, amount: "23,000,000.00", color: "#6B1515" },
  {
    name: "Fixed Income",
    value: 15,
    amount: "250,000,000.00",
    color: "#D32F2F",
  },
  { name: "Unit Trusts", value: 10, amount: "3,000,000.00", color: "#FFCDD2" },
  {
    name: "Structured Products & Other Investments",
    value: 30,
    amount: "12,000,000.00",
    color: "#8B0000",
  },
];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  index,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  index: number;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const item = portfolioData2[index];
  const lines = item.name.split(" & ")[0].split(" ");

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="14"
    >
      <tspan x={x} dy="-1.2em" fontWeight="bold">{`${item.value}%`}</tspan>
      {lines.map((line, i) => (
        <tspan x={x} dy="1.2em" key={i}>
          {line}
        </tspan>
      ))}
    </text>
  );
};

const renderCurrencyLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  index,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  index: number;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  const item = currencyData[index];

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="middle"
      fontSize="14"
    >
      <tspan x={x} dy="-0.5em" fontWeight="bold">{`${item.value}%`}</tspan>
      <tspan x={x} dy="1.2em">
        {item.name}
      </tspan>
    </text>
  );
};
export interface ReportProps {
  moneyMarketP: any;
  structuredProductsP: any;
  unitTrustsP: any;
  fixedIncomeP: any;
  equitiesP: any;
  month: string;
  year: string;
  accountName: string;
  unitTrustsValue?: string;
  structuredProductsValue?: string;
  equitiesValue?: string;
  fixedIncomeValue?: string;
  moneyMarketValue?: string;
}

export function Report(reportDetail: ReportProps) {
  const total = useMemo(() => {
    return (
      Number(reportDetail.unitTrustsValue || 0) +
      Number(reportDetail.structuredProductsValue || 0) +
      Number(reportDetail.equitiesValue || 0) +
      Number(reportDetail.fixedIncomeValue || 0) +
      Number(reportDetail.moneyMarketValue || 0)
    );
  }, [reportDetail]);
  const percentages = useMemo(() => {
    if (total === 0)
      return {
        unitTrustsP: 0,
        structuredProductsP: 0,
        equitiesP: 0,
        fixedIncomeP: 0,
        moneyMarketP: 0,
      };

    return {
      unitTrustsP: Number(
        ((Number(reportDetail.unitTrustsValue || 0) / total) * 100).toFixed(2)
      ),
      structuredProductsP: Number(
        (
          (Number(reportDetail.structuredProductsValue || 0) / total) *
          100
        ).toFixed(2)
      ),
      equitiesP: Number(
        ((Number(reportDetail.equitiesValue || 0) / total) * 100).toFixed(2)
      ),
      fixedIncomeP: Number(
        ((Number(reportDetail.fixedIncomeValue || 0) / total) * 100).toFixed(2)
      ),
      moneyMarketP: Number(
        ((Number(reportDetail.moneyMarketValue || 0) / total) * 100).toFixed(2)
      ),
    };
  }, [reportDetail, total]);

  return (
    <>
      <div
        style={{
          position: "relative",
          minHeight: "110vh",
          height: "auto",
        }}
      >
        <PdfHeader />
        <div
          style={{
            height: ` calc(100vh - 151px);`,
            overflowY: "auto",
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <Summary {...{ ...reportDetail, ...percentages }} />
        </div>
      </div>
    </>
  );
}
