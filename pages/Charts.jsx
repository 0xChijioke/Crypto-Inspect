import dynamic from "next/dynamic";

const CoinPriceChart = dynamic(
  () => {
    return import("../components/CoinPriceChart.jsx");
  },
  { ssr: false }
);

export default function Chart() {
  return (
    <main className=" w-full flex-col text-center items-center self-center">
      <h1 className="text-3xl">Token Price Chart</h1>
      
      <CoinPriceChart />
    </main>
  );
}
