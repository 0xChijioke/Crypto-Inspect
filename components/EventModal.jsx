import { ethers } from "ethers";

const EventModal = ({ decodedData, isOpen, setToggleModal }) => {
  console.log(decodedData);
  return (
    <>
      <input type="checkbox" id="my-modal" className="modal-toggle" checked={isOpen} onChange={() => null} />
      <div className="modal  w-full ">
        <div className="modal-box relative w-[100%]">
          <label
            htmlFor="my-modal-3"
            className="btn btn-sm btn-circle absolute right-2 top-2"
            onClick={() => setToggleModal(!isOpen)}>
            ✕
          </label>

          
          <div className="my-2">
            
              <>
              
                <div
                  tabIndex="0"
                  className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box m-2">
                  <div className="collapse-title text-xl font-medium flex justify-between ">
                   
                    <div className="w-7">{decodedData.name}</div>
                  </div>
                  {/* collapse content */}
                  <div className="collapse-content">
                    <div className="overflow-x-auto">   
                                                         
                        <table className="table w-full">                          
                          <tbody>
                            <tr>
                              <td>Name</td>
                              <td>{decodedData.name}</td>
                            </tr>
                            <tr>
                              <td>Signature</td>
                              <td className="flex flex-wrap">{decodedData.signature}</td>
                            </tr>
                            {decodedData.params &&
                              decodedData.params.map((item, index) => {
                                console.log("value: ", item.type === "uint256", item.value, item.name);
                                return (
                                  <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>
                                      {item.type === "uint256" && item.value !== null
                                        ? Number(ethers.utils.formatEther(item.value)).toFixed(2)
                                        : item.value}
                                    </td>
                                  </tr>
                                );
                              })}
                          </tbody>
                        </table>
                      

                      {!decodedData && (
                        <>
                          <div className="alert alert-warning shadow-lg">No event data !!</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </>
            
          </div>
        </div>
      </div>
    </>
  );
};
export default EventModal;