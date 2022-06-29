import { useState } from "react";
import Gasdata from "../components/Gasdata";
import API from "../utils/API";
import { COVALENT_KEY } from "../constants";
import DateRangePicker from "@wojtekmaj/react-daterange-picker/dist/entry.nostyle";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";
export default function GasCalculator() {
  const [address, setaddress] = useState("");
  const [mainnetdata, setmainnetdata] = useState(null);
  const [polygondata, setpolygondata] = useState(null);
  const [optimismdata, setoptimismdata] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [nooftx, setnooftx] = useState(null);
  const [value, onChange] = useState([new Date(), new Date()]);
  console.log("onchange", value);
  const getdata = async (client) => {
    setLoading(true);
    let responsemainnet = await API.get(
      `https://api.covalenthq.com/v1/1/address/` +
        `${client}` +
        `/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=true&key=${COVALENT_KEY}`
    );
    console.log("responesemainnet", responsemainnet);

    let itemsdatamainnet = responsemainnet.data;
    setmainnetdata(itemsdatamainnet);
    setLoading(false);
    setnooftx(mainnetdata?.length);

    let responsepolygon = await API.get(
      `https://api.covalenthq.com/v1/137/address/` +
        `${client}` +
        `/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=true&key=${COVALENT_KEY}`
    );

    let itemsdatapolygon = responsepolygon.data;
    setpolygondata(itemsdatapolygon);
    setLoading(false);
    setnooftx(polygondata?.length);

    let responseoptimism = await API.get(
      `https://api.covalenthq.com/v1/10/address/` +
        `${client}` +
        `/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=true&key=${COVALENT_KEY}`
    );

    let itemsdataoptimism = responseoptimism.data;
    setoptimismdata(itemsdataoptimism);
    setLoading(false);
    setnooftx(optimismdata?.length);
  };

  return (
    <>
      <h1 className="text-3xl font-medium rounded-md bg-violet-300 px-6 py-2 ">Gas Guzzler</h1>
      <input
        className="border-black-300 margin-10 px-4 py-2 rounded-md m-10"
        placeholder="Enter your address"
        value={address}
        onChange={(e) => setaddress(e.target.value)}
      />

      <button
        className="rounded-none bg-violet-400 hover:bg-sky-400 px-5 text-2xl "
        onClick={() => {
          console.log(address);
          getdata(address);
        }}>
        Lifetime gas Paid
      </button>

      <div>
        <DateRangePicker format="y-m-dd" onChange={onChange} value={value} />
      </div>

      <button
        className="rounded-none bg-violet-400 hover:bg-sky-400 px-5 text-2xl "
        onClick={() => {
          getdata(address);
        }}>
        Gas Data for this range
      </button>
      {isLoading ? <p>Loading...</p> : null}

      {!isLoading && mainnetdata && polygondata && optimismdata && (
        <div>
          {
            <Gasdata
              polygondata={polygondata}
              mainnetdata={mainnetdata}
              optimismdata={optimismdata}
              address={address}
              range={value}
            />
          }
        </div>
      )}
    </>
  );
}
