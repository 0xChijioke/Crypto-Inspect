import debounce from "lodash.debounce";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

import { useStore } from "../store/useStore";

const SearchAddress = () => {
  const [state, dispatch] = useStore();

  // handle address input
  const handleChange = (e) => {
    dispatch({ payload: { searchedAddress: e.target.value } });
  };

  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 1000);
  }, []);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });

  return (
    <>
      <div className="relative mt-6">
        <div className="form-control">
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter Address"
              className="input input-bordered"
              onChange={debouncedResults}
            />
            <button className="btn btn-square">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchAddress;
