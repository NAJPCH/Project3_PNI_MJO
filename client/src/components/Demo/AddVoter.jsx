import React, { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";


const AddVoter = ({workflow}) => {
    const {
        state: { contract, accounts },
    } = useEth();
    const [voterAddress, setVoterAddress] = useState("");


  const addVoter = async () => {
    try {
      await contract.methods.addVoter(voterAddress).send({
        from: accounts[0],
      });
      alert("Voter ajouté avec succès !");
      setVoterAddress("");
    } catch (error) {
      alert("Erreur lors de l'ajout de l'électeur.");
    }
  };


    return (
      <div> 
        { workflow === "0"  && (
          <>
            <input type="text"
            value={voterAddress}
            onChange={(e) => setVoterAddress(e.target.value)}
            placeholder="Adresse de l'électeur" /><button onClick={addVoter}>Ajouter un électeur</button>
          </>
        )}
      </div>
    );
};

export default AddVoter;

