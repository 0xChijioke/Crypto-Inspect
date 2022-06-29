import { useState } from "react";
import Gasdata from "../components/Gasdata";
import API from "../utils/API";
import { COVALENT_KEY } from "../constants";
import Box from "@mui/material/Box";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function GasCalculator() {
  const [address, setaddress] = useState("");
  const [mainnetdata, setmainnetdata] = useState(null);
  const [polygondata, setpolygondata] = useState(null);
  const [optimismdata, setoptimismdata] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [nooftx, setnooftx] = useState(null);
  const [startDate, setStartDate] = useState();
  const [value, setValue] = (React.useState < Date) | (null > new Date());

  const getdata = async (client) => {
    setLoading(true);
    let responsemainnet = await API.get(
      `https://api.covalenthq.com/v1/1/address/` +
        `${client}` +
        `/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=true&key=${COVALENT_KEY}`
    );

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

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Custom input"
          value={value}
          onChange={(newValue) => {
            setValue(newValue);
          }}
          renderInput={({ inputRef, inputProps, InputProps }) => (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <input ref={inputRef} {...inputProps} />
              {InputProps?.endAdornment}
            </Box>
          )}
        />
      </LocalizationProvider>

      {isLoading ? <p>Loading...</p> : null}

      {!isLoading && mainnetdata && polygondata && optimismdata && (
        <div>
          {
            <Gasdata
              polygondata={polygondata}
              mainnetdata={mainnetdata}
              optimismdata={optimismdata}
              address={address}
            />
          }
        </div>
      )}
    </>
  );
}
