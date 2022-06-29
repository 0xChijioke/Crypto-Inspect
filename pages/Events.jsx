import moment from 'moment';
import React, { startTransition, useEffect, useRef, useState } from 'react';
import { COVALENT_KEY } from "../constants";
import API from "../utils/API";
import { useTheme } from "next-themes";
import { BsUnlockFill } from 'react-icons/bs';
import EventModal from '../components/EventModal';

export default function TranscactionsPage() {
  const [events, setEvents] = useState();
  const [decodedData, setDecodedData] = useState();
  const [start, setStart] = useState(12500000);
  const [end, setEnd] = useState(12500100);
  const [contractAdd, setContractAdd] = useState("0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9");
  const [toggleModal, setToggleModal] = useState(false);
  const [topic, setTopic] = useState("0x804c9b842b2748a22bb64b345453a3de7ca54a6ca45ce00d415894979e22897a")
  const [chainId, setChainId] = useState(1);
  const [resError, setResError] = useState(false);
    
    //TODO:make it dynamic from page
    const DEFAULT_PAGE_SIZE = 10;

  
    
    const fetchTxData = async () => {
      try {
       
        // console.log("load tx data for  ", address, chainId);
        let response = await API.get(`/${chainId}/events/topics/${topic}/?starting-block=${start}&ending-block=${end}&sender-address=${contractAdd}&key=${COVALENT_KEY}`
        );
        setResError(response.data.data.erorr)
        let txItems = response.data.data.items;
        setEvents(txItems);
        console.log("txItems: ", txItems[0]);
        let hasData = response.data.data.pagination.has_more;
       setIsLoading(false);
    } catch (error) {
        //setResError(true);
    }
};

function handleEvent(){
  if(start && end && topic > 30 && contractAdd > 10){
  
   fetchTxData();
  } else{
    setResError(true)
    setEvents();
  }


};
  
return (
    <>
     {/* event log modal view */}
     {toggleModal && (
        <EventModal isOpen={toggleModal} decodedData={decodedData} setToggleModal={setToggleModal} />
      )}

      <div className="relative mt-6">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"></path>
          </svg>
        </span>
        <input
          type="text"
          className="w-full py-2 pl-10 pr-4 bg-transparent border rounded-md dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
          placeholder="Enter contract Address"
          onChange={e => setContractAdd(e.target.value)}
          
        />
      </div>
      <div className="relative mt-6">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"></path>
          </svg>
        </span>
        <input
          type="text"
          className="w-full py-2 pl-10 pr-4 bg-transparent rounded-md dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
          placeholder="Enter Topic"
          onChange={e => setTopic(e.target.value)}
        />
      </div>
      <div className="relative mt-6 justify-center flex">
        <input
          type="number"
          className="w-1/4 py-2 pl-10 pr-4 bg-transparent border rounded-md dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
          placeholder="Starting Block"
          onChange={e => setStart(e.target.value)}
        />
        <input
          type="number"
          className="w-1/4 py-2 mx-10 pl-10 pr-4 border rounded-md bg-transparent dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
          placeholder="Ending Block"
          onChange={e => setEnd(e.target.value)}
          
        />
        <input
          type="number"
          className="w-1/4 py-2 pl-10 pr-4 border rounded-md bg-transparent dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
          placeholder="Chain ID 1 by default"
          onChange={e => setChainId(e.target.value)}
        />
      </div>
      <div className=" py-10 flex justify-center">
        <button onClick={handleEvent} className={"btn btn-primary"}>Button</button>
      </div>
      
      <div className="overflow-x-auto w-full   lg:flex lg:justify-center lg:items-end lg:flex-col">
        {resError === true? <div className='alert alert-error flex justify-center shadow-lg'>Error: Something is not right</div> : null}
        
        <table className={`table w-full  table-normal`}>
          <thead>
            <tr>
              <th></th>
              <th>tx hash</th>
              <th>sender</th>
              <th>block height</th>
              <th>tx offset</th>
              <th>log offset</th>
              <th>timestamp</th>
              <th>Decoded</th>
              {/* <th>decoded</th> */}
            </tr>
          </thead>
          <tbody>
            {events?.length > 0 &&
              events.map(
                (
                  { tx_hash, tx_offset, log_offset, sender_address, block_height, block_signed_at, decoded },
                  index
                ) => {
                  return (
                    <React.Fragment key={index}>
                      <tr>
                        <th>{index + 1}</th>
                        <td>
                          <span className="badge border-none badge-lg bg-slate-300 text-black">
                            {tx_hash.slice(0, 4) + ".." + tx_hash.slice(-4)}
                          </span>
                        </td>
                        <td>
                          <span className="badge border-none badge-lg bg-slate-400 text-black">
                            {sender_address.slice(0, 4) + ".." + sender_address.slice(-4)}
                          </span>
                        </td>
                        <td>{block_height}</td>
                        <td>
                          <span className="badge border-none badge-lg bg-slate-400 text-black">
                            {tx_offset}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`badge border-none badge-lg bg-slate-400 text-black`}>
                            {log_offset}
                          </span>
                        </td>
                        <td>{moment(block_signed_at).format("YYYY-MM-DD HH:mm:ss")}</td>
                        <td
                          onClick={() => {
                            setDecodedData(decoded);
                            setToggleModal(!toggleModal);
                          }}>
                          <BsUnlockFill
                            className={` text-xl ${
                              decoded.length === 0
                                ? " text-gray-500 cursor-not-allowed"
                                : " text-green-600 cursor-pointer"
                            }`}
                          />
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                }
              )}
          </tbody>
        </table>

       
      </div>
    </>
  );
};

