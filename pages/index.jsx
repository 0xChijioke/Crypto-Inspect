import { useEffect, useState } from "react";
import { COVALENT_KEY } from "../constants";
import { useStore } from "../store/useStore";
import API from "../utils/API";
import ChainDetails from "../components/ChainDetails";

import Link from "next/link";

export default function Home() {
  const [chainItemsData, setChainItemsData] = useState([]);
  const [state, dispatch] = useStore();

  const fetchAllChains = async () => {
    let response = await API.get(`/chains/status/?&key=${COVALENT_KEY}`);
    let chainItems = response.data.data.items;
    setChainItemsData(chainItems);
  };

  useEffect(() => {
    void fetchAllChains();
  }, []);

  return (
    <div>
      <div className="text-2xl flex justify-center  w-auto mt-1">
        <h1 className="font-bold">All Chains</h1>
      </div>

      {chainItemsData.length === 0 && (
        <div className="flex justify-center w-full mt-10">
          <progress className="progress w-1/2 progress-primary " />
        </div>
      )}
      <ChainDetails chainItems={chainItemsData} />
    </div>
  );
}
