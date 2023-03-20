import React, { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import { Button, Input } from '@chakra-ui/react'

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
          <>
          <Input
            type="text"
            placeholder="ID de la proposition"
            value={inputVote}
            onChange={handleInputChanged}
            width='50'/>
          
          <Button onClick={setVote} m='10' bg='purple.800' _hover={{ bg: 'purple.600'}}>Voter</Button>
          </>
        )}
    </div>
  );
};

export default Voter;

 
