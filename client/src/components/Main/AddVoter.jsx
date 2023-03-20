import React, { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import { Button , Input} from '@chakra-ui/react'

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
          
            <Input type="text"
            value={voterAddress}
            onChange={(e) => setVoterAddress(e.target.value)}
            placeholder="Adresse de l'électeur"
            width={400} />
            <Button onClick={addVoter} m='5' bg='purple.800' _hover={{ bg: 'purple.600'}}>Ajouter un électeur</Button>
          </>
        )}
      </div>
    );
};

export default AddVoter;

