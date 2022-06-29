import { useState } from "react";

import Gasdata from "../components/Gasdata";
import API from "../utils/API";
import { COVALENT_KEY } from "../constants";
import DateRangePicker from "@wojtekmaj/react-daterange-picker/dist/entry.nostyle";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";
import { useStore } from "../store/useStore";

export default function GasCalculator() {
  const [address, setaddress] = useState("");
  const [mainnetdata, setmainnetdata] = useState(null);
  const [polygondata, setpolygondata] = useState(null);
  const [optimismdata, setoptimismdata] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [nooftx, setnooftx] = useState(null);
  const [dateRange, setDateRange] = useState([false, false]);

  const [state, dispatch] = useStore();

  const getdata = async (address) => {
    setLoading(true);
    let responsemainnet = await API.get(
      `https://api.covalenthq.com/v1/1/address/` +
        `${address}` +
        `/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=true&key=${COVALENT_KEY}`
    );
    console.log("responesemainnet", responsemainnet);

    let itemsdatamainnet = responsemainnet.data;
    // console.log("itemsdatamainnet: ", itemsdatamainnet);
    setmainnetdata(itemsdatamainnet);
    setLoading(false);
    setnooftx(mainnetdata?.length);

    let responsepolygon = await API.get(
      `https://api.covalenthq.com/v1/137/address/` +
        `${address}` +
        `/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=true&key=${COVALENT_KEY}`
    );

    let itemsdatapolygon = responsepolygon.data;
    setpolygondata(itemsdatapolygon);
    setLoading(false);
    setnooftx(polygondata?.length);

    let responseoptimism = await API.get(
      `https://api.covalenthq.com/v1/10/address/` +
        `${address}` +
        `/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=true&key=${COVALENT_KEY}`
    );

    let itemsdataoptimism = responseoptimism.data;
    setoptimismdata(itemsdataoptimism);
    setLoading(false);
    setnooftx(optimismdata?.length);
  };
  let accountAddress = state.searchedAddress ? state.searchedAddress : state.address;

  return (
    <>
      {/* <h1 className="text-3xl font-medium rounded-md bg-violet-300 px-6 py-2 ">Gas Guzzler</h1> */}
      {/* <input
        className="border-black-300 margin-10 px-4 py-2 rounded-md m-10"
        placeholder="Enter your address"
        value={address}
        onChange={(e) => setaddress(e.target.value)}
      /> */}

      {/* <button
        className="rounded-none bg-violet-400 hover:bg-sky-400 px-5 text-2xl "
        onClick={() => {
          console.log(address);
          getdata(address);
        }}>
        Lifetime gas Paid
      </button>

      <div>
        <DateRangePicker
          onChange={(dateRange) => {
            setDateRange(dateRange);
          }}
          value={dateRange}
        />
      </div>

      <button
        className="rounded-none bg-violet-400 hover:bg-sky-400 px-5 text-2xl "
        onClick={() => {
          getdata(address);
        }}>
        Gas Data for this range
      </button> */}

      {/* header actions */}
      <div className="divider- text-center opacity-90 text-2xl">Gas Guzzler</div>
      <div className="flex  justify-start items-center my-2">
        <div className="flex flex-col">
          <span className="opacity-70">calculate gas in date range</span>
          <DateRangePicker
            onChange={(dateRange) => {
              setDateRange(dateRange);
            }}
            value={dateRange}
            onCalendarClose={() => {
              getdata(accountAddress);
            }}
          />
        </div>
        <button className="btn btn-outline btn-primary btn-sm self-end mx-2" onClick={() => getdata(accountAddress)}>
          Overall gas paid
        </button>
      </div>

      {!isLoading && mainnetdata && polygondata && optimismdata && (
        <div>
          <Gasdata
            polygondata={polygondata}
            mainnetdata={mainnetdata}
            optimismdata={optimismdata}
            address={accountAddress}
            range={dateRange}
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center mt-16">
          <progress className="progress w-52 progress-primary "></progress>
        </div>
      ) : null}
    </>
  );
}
