import React, { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

const Voter = ({ workflow }) => {
    const [inputVote, setInputVote] = useState("");
  
  const {
    state: { contract, accounts },
  } = useEth();
  
  const handleInputChanged = e => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setInputVote(e.target.value);
    }
  };

  const setVote = async e => {
    if (e.target.tagName === "INPUT") {
      return;
    }
    if (inputVote === "") {
      alert("Please enter a value to write.");
      return;
    }
    const newVote = parseInt(inputVote);
    await contract.methods.setVote(newVote).send({ from: accounts[0] });
  };

  return (
    <div>
        {workflow === "3"  && (
          <><input
            type="text"
            placeholder="ID de la proposal"
            value={inputVote}
            onChange={handleInputChanged}/>
          <button onClick={setVote}>Set Vote</button></>
        )}
    </div>
  );
};

export default Voter;

 
