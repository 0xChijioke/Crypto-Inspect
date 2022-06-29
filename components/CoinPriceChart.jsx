import moment from "moment";
import { createChart } from "lightweight-charts";
import { useEffect, useRef, useState } from "react";
import { COVALENT_KEY } from "../constants";
import API from "../utils/API";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";

const tokenAddresses = {
  BNB: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
  LINK: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
  MATIC: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
  DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  UNI: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
  GRT: "0xc944E90C64B2c07662A292be6244BDf05Cda44a7",
  USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  SHIB: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
  WBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  WCELO: "0xE452E6Ea2dDeB012e20dB73bf5d3863A3Ac8d77a",
  GALA: "0x15D4c048F83bd7e37d49eA4C83a07267Ec4203dA",
  AAVE: "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9",
  MKR: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2",
  KCS: "0xf34960d9d60be18cC1D5Afc1A6F012A723a28811",
  WFIL: "0x6e1A19F235bE7ED8E3369eF73b196C07257494DE",
  WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  GTC: "0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F",
  CQT: "0xD417144312DbF50465b1C641d016962017Ef6240",
};

const CoinPriceChart = () => {
  const [tokenPrice, setTokenPrice] = useState();
  const [tokenChart, setTokenChart] = useState(tokenAddresses.DAI);
  const [chartData, setChartData] = useState([]);
  const [count, setCount] = useState(false);
  const { theme } = useTheme();
  const elRef = useRef(null);
  const chartRef = useRef(null);

  /**----------------------
   *Get todays date
   * ---------------------*/
  let date = new Date();
  let today = moment(date).format("YYYY-MM-DD");

  /**---------------------------------
   * Get date 5 years ago(60 months)
   * -------------------------------*/

  let sixtyMA = new Date();
  sixtyMA.setMonth(date.getMonth() - 60);
  let sixtyMonthsAgo = moment(sixtyMA).format("YYYY-MM-DD");

  const fetchTokenPrice = async () => {
    let response = await API.get(
      `/pricing/historical_by_addresses_v2/1/USD/${tokenChart}/?&from=${sixtyMonthsAgo}&to=${today}&prices-at-asc=true&key=${COVALENT_KEY}`
    );
    let price = response.data.data[0];
    setTokenPrice(price);
  };

  useEffect(() => {
    fetchTokenPrice();
  }, [tokenChart]);

  useEffect(() => {
    const chart = tokenPrice?.prices?.map((item) => ({ time: item.date, value: item.price }));
    setChartData(chart);
    console.log(1 + 1);

    if (elRef.current != null) {
      chartRef.current?.remove();
      const container = elRef.current;

      if (theme != "light") {
        const chart = createChart(container, {
          margin: "auto",
          width: "1000",
          height: "500",
          layout: { background: { color: "#ccccc" }, textColor: "#cccccc" },
          grid: { vertLines: { color: "#ccccccc" }, horzLines: { color: "#ccccc" } },
        });
        // Make Chart Responsive with screen resize
        new ResizeObserver((entries) => {
          if (entries.length === 0 || entries[0].target !== container) {
            return;
          }
          const newRect = entries[0].contentRect;
          chart.applyOptions({ height: newRect.height, width: newRect.width });
        }).observe(container);
        chartRef.current = chart;
      } else {
        const chart = createChart(container, {
          margin: "auto",
          width: "900",
          height: "500",
          layout: { background: { color: "#ffffff" }, textColor: "#ccccc" },
          grid: { vertLines: { color: "#ffffff" }, horzLines: { color: "#ffffff" } },
        });
        // Make Chart Responsive with screen resize
        new ResizeObserver((entries) => {
          if (entries.length === 0 || entries[0].target !== container) {
            return;
          }
          const newRect = entries[0].contentRect;
          chart.applyOptions({ height: newRect.height, width: newRect.width });
        }).observe(container);
        chartRef.current = chart;
      }

      const lineSeries = chartRef.current.addLineSeries();

      {
        chartData?.length > 300 && lineSeries.setData(chartData);
      }
    }
    return () => {
      chartRef.current?.remove();
      chartRef.current = null;
      setCount(!count);
    };
  }, [tokenPrice, count]);

  const btn =
    "active:bg-gradient-to-r active:from-purple-500 active:via-purple-600 active:to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 font-medium rounded-full text-sm px-5 py-2.5 text-center mr-2 mb-2";

  return (
    <div className="w-full self-center items-center content-center flex-col">
      <div className="flex lg:mt-7 my-10  flex-wrap items-center justify-center text-center">
        <button type="button" className={btn} onClick={() => setTokenChart(tokenAddresses.DAI)}>
          DAI
        </button>
        <button type="button" className={btn} onClick={() => setTokenChart(tokenAddresses.BNB)}>
          BNB
        </button>
        <button type="button" className={btn} onClick={() => setTokenChart(tokenAddresses.MATIC)}>
          MATIC
        </button>
        <button type="button" className={btn} onClick={() => setTokenChart(tokenAddresses.GRT)}>
          GRT
        </button>
        <button type="button" className={btn} onClick={() => setTokenChart(tokenAddresses.UNI)}>
          UNI
        </button>
        <button type="button" className={btn} onClick={() => setTokenChart(tokenAddresses.CQT)}>
          CQT
        </button>
        <button type="button" className={btn} onClick={() => setTokenChart(tokenAddresses.USDT)}>
          USDT
        </button>
        <button type="button" className={btn} onClick={() => setTokenChart(tokenAddresses.WBTC)}>
          WBTC
        </button>
        <button type="button" className={btn} onClick={() => setTokenChart(tokenAddresses.WETH)}>
          WETH
        </button>
        <button type="button" className={btn} onClick={() => setTokenChart(tokenAddresses.GTC)}>
          GTC
        </button>
        <button type="button" className={btn} onClick={() => setTokenChart(tokenAddresses.GALA)}>
          GALA
        </button>
        <button type="button" className={btn} onClick={() => setTokenChart(tokenAddresses.MKR)}>
          MKR
        </button>
        <button type="button" className={btn} onClick={() => setTokenChart(tokenAddresses.KCS)}>
          KCS
        </button>
        <button type="button" className={btn} onClick={() => setTokenChart(tokenAddresses.AAVE)}>
          AAVE
        </button>
        <button type="button" className={btn} onClick={() => setTokenChart(tokenAddresses.SHIB)}>
          SHIB
        </button>
        <button type="button" className={btn} onClick={() => setTokenChart(tokenAddresses.LINK)}>
          LINK
        </button>
        <button type="button" className={btn} onClick={() => setTokenChart(tokenAddresses.WFIL)}>
          WFIL
        </button>
        <button type="button" className={btn} onClick={() => setTokenChart(tokenAddresses.WCELO)}>
          WCELO
        </button>
        <button type="button" className={btn} onClick={() => setTokenChart(tokenAddresses.USDC)}>
          USDC
        </button>
      </div>
      <div className="relative flex flex-col h-full p-5 bg--white rounded-sm lg:items-center lg:flex-row">
        <div className="mb-6 mr-6 lg:mb-0">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-base-300 lg:w-32 lg:h-32">
            {tokenPrice && <Image src={tokenPrice.logo_url} height={250} width={250} alt={tokenPrice.contract_name} />}
          </div>
        </div>
        <div className="flex flex-col  justify-between flex-grow">
          <input
            disabled
            onChange={() => setCount(!count)}
            className="mb-2 font-semibold bg-transparent leading-5 first-letter:capitalize"
            value={tokenPrice?.contract_name.split("-").join(" ")}></input>
          <div className="mb-2 text-sm ">
            <div className=" flex flex-col justify-around my-2 items-start">
              <span className="my-1 ">
                Quote Currency :{" "}
                <span className="badge badge-sm badge-ghost mx-2 text-xs">{tokenPrice?.quote_currency}</span>
              </span>
              <span className="my-1 ">
                Official Site :{" "}
                <span className="badge badge-sm badge-ghost mx-2 text-xs">
                  {tokenChart == tokenAddresses.DAI && (
                    <Link href={"https://makerdao.com/"}>https://makerdao.com/</Link>
                  )}
                  {tokenChart == tokenAddresses.BNB && (
                    <Link href={"https://www.binance.com/"}>https://www.binance.com/</Link>
                  )}
                  {tokenChart == tokenAddresses.USDC && (
                    <Link href={"https://www.centre.io/"}>https://www.centre.io/</Link>
                  )}
                  {tokenChart == tokenAddresses.USDT && <Link href={"https://tether.to/"}>https://tether.to/</Link>}
                  {tokenChart == tokenAddresses.GRT && (
                    <Link href={"https://thegraph.com/"}>https://thegraph.com/</Link>
                  )}
                  {tokenChart == tokenAddresses.WBTC && (
                    <Link href={"https://www.wbtc.network/"}>https://www.wbtc.network/</Link>
                  )}
                  {tokenChart == tokenAddresses.WETH && <Link href={"https://weth.io/"}>https://weth.io/</Link>}
                  {tokenChart == tokenAddresses.KCS && (
                    <Link href={"https://www.kucoin.com/"}>hhttps://www.kucoin.com/</Link>
                  )}
                  {tokenChart == tokenAddresses.GTC && (
                    <Link href={"https://gitcoin.co/quadraticlands/"}>https://gitcoin.co/quadraticlands/</Link>
                  )}
                  {tokenChart == tokenAddresses.MKR && (
                    <Link href={"https://makerdao.com/"}>https://makerdao.com/</Link>
                  )}
                  {tokenChart == tokenAddresses.GALA && <Link href={"https://gala.games/"}>https://gala.games/</Link>}
                  {tokenChart == tokenAddresses.SHIB && (
                    <Link href={"https://shibatoken.com/"}>https://shibatoken.com/</Link>
                  )}
                  {tokenChart == tokenAddresses.MATIC && (
                    <Link href={"https://polygon.technology/"}>https://polygon.technology/</Link>
                  )}
                  {tokenChart == tokenAddresses.LINK && <Link href={"https://chain.link/"}>https://chain.link/</Link>}
                  {tokenChart == tokenAddresses.UNI && <Link href={"https://uniswap.org/"}>https://uniswap.org/</Link>}
                  {tokenChart == tokenAddresses.WFIL && (
                    <Link href={"https://www.wrapped.com/"}>hhttps://www.wrapped.com/</Link>
                  )}
                  {tokenChart == tokenAddresses.CQT && (
                    <Link href={"https://www.covalenthq.com/"}>https://www.covalenthq.com/</Link>
                  )}
                  {tokenChart == tokenAddresses.WCELO && (
                    <Link href={"https://www.wrapped.com/"}>https://www.wrapped.com/</Link>
                  )}
                  {tokenChart == tokenAddresses.AAVE && <Link href={"https://aave.com/"}>https://aave.com/</Link>}
                </span>
              </span>
              <span className="my-1">
                Updated At :
                <span className="badge badge-sm badge-ghost mx-2 text-xs">
                  {moment(tokenPrice?.updated_at).format("YYYY-MM-DD HH:mm:ss")}
                </span>
              </span>
            </div>
          </div>
        </div>
        <div className="text-md flex-end flex lg:w-1/2 p-10 flex-wrap">
          <p className="text-left">
            {tokenChart == tokenAddresses.CQT &&
              "Covalent aggregates information from across dozens of sources including nodes, chains, and data feeds. Covalent returns this data in a rapid and consistent manner, incorporating all relevant data within one API interface."}
            {tokenChart == tokenAddresses.BNB &&
              "Binance aims to build a world-class crypto exchange, powering the future of crypto finance."}
            {tokenChart == tokenAddresses.USDT &&
              "Tether gives you the joint benefits of open blockchain technology and traditional currency by converting your cash into a stable digital currency equivalent."}
            {tokenChart == tokenAddresses.USDC &&
              "USDC is a fully collateralized US Dollar stablecoin developed by CENTRE, the open source project with Circle being the first of several forthcoming issuers."}
            {tokenChart == tokenAddresses.SHIB &&
              "SHIBA INU is a 100% decentralized community experiment with it claims that 1/2 the tokens have been sent to Vitalik and the other half were locked to a Uniswap pool and the keys burned."}
            {tokenChart == tokenAddresses.WBTC &&
              "Wrapped Bitcoin (WBTC) is an ERC20 token backed 1:1 with Bitcoin. Completely transparent. 100% verifiable. Community led."}
            {tokenChart == tokenAddresses.MATIC &&
              "Matic Network brings massive scale to Ethereum using an adapted version of Plasma with PoS based side chains. Polygon is a well-structured, easy-to-use platform for Ethereum scaling and infrastructure development."}
            {tokenChart == tokenAddresses.LINK &&
              "A blockchain-based middleware, acting as a bridge between cryptocurrency smart contracts, data feeds, APIs and traditional bank account payments."}
            {tokenChart == tokenAddresses.DAI &&
              "Multi-Collateral Dai, brings a lot of new and exciting features, such as support for new CDP collateral types and Dai Savings Rate."}
            {tokenChart == tokenAddresses.UNI &&
              "UNI token served as governance token for Uniswap protocol with 1 billion UNI have been minted at genesis. 60% of the UNI genesis supply is allocated to Uniswap community members and remaining for team, investors and advisors."}
            {tokenChart == tokenAddresses.MKR &&
              "Maker is a Decentralized Autonomous Organization that creates and insures the dai stablecoin on the Ethereum blockchain"}
            {tokenChart == tokenAddresses.GRT &&
              "The Graph is an indexing protocol and global API for organizing blockchain data and making it easily accessible with GraphQL."}
            {tokenChart == tokenAddresses.GALA &&
              "Gala Games is dedicated to decentralizing the multi-billion dollar gaming industry by giving players access to their in-game items. Coming from the Co-founder of Zynga and some of the creative minds behind Farmville 2, Gala Games aims to revolutionize gaming."}
            {tokenChart == tokenAddresses.AAVE &&
              "Aave is an Open Source and Non-Custodial protocol to earn interest on deposits & borrow assets. It also features access to highly innovative flash loans, which let developers borrow instantly and easily; no collateral needed. With 16 different assets, 5 of which are stablecoins."}
            {tokenChart == tokenAddresses.WCELO &&
              "Wrapped Celo is a 1:1 equivalent of Celo. Celo is a utility and governance asset for the Celo community, which has a fixed supply and variable value. With Celo, you can help shape the direction of the Celo Platform."}
            {tokenChart == tokenAddresses.GTC &&
              "GTC is a governance token with no economic value. GTC governs Gitcoin, where they work to decentralize grants, manage disputes, and govern the treasury."}
            {tokenChart == tokenAddresses.KCS &&
              "KCS performs as the key to the entire KuCoin ecosystem, and it will also be the native asset on KuCoin’s decentralized financial services as well as the governance token of KuCoin Community."}
            {tokenChart == tokenAddresses.WFIL && "Wrapped Filecoin is an Ethereum based representation of Filecoin."}
            {tokenChart == tokenAddresses.WETH && 'wETH is "wrapped ETH"'}
          </p>
        </div>
      </div>
      <h1 className="text-xl text-center p-4">{tokenPrice?.contract_name} Price Chart</h1>
      <div
        className="justify-center flex margin-auto"
        ref={elRef}
        id="container"

        // key={theme}
      ></div>
    </div>
  );
};

export default CoinPriceChart;
