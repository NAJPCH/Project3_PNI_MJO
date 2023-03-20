import AddVoter from "./AddVoter";
import Workflow from "./Workflow";
import { useEffect, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import { Card, CardHeader, CardBody, Heading } from '@chakra-ui/react'

function OnlyOwner({ workflow, setWorkflow, connected, setConnected, oldEvents, setApproved, approved, voterAddress, setVoterAddress}) {
  
  const {
    state: { web3 },
  } = useEth();

  //const [voterAddress, setVoterAddress] = useState([]);
  //const [authorised, setAuthorised] = useState("");

  /*useEffect(() => {
    (async function () {
      getConnectedAccount();
      for (let i = 0; i < oldEvents.length; i++) {
        if (oldEvents[i] == connected) {
          console.log("Addresse autorisée");
          setApproved(true);
          //setAuthorised(connected);
          console.log("approved:"+approved);
          return;
        }
      }
    })();
  }, []); //[connected, setApproved, oldEvents]

  async function getConnectedAccount() {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
      setConnected(accounts[0]);
      //console.log("Adresse du compte connecté :", accounts[0]);
    } else {
      console.error("Aucun compte connecté");
    }
  }*/

  //getConnectedAccount();
  
  /*useEffect(() => {
  (async function () {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
      setConnected(accounts[0]);
      console.log("Adresse connectée :", accounts[0]);
    } else {
      console.error("Aucun compte connecté");
    }

    let isApproved = false;
    for (let i = 0; i < oldEvents.length; i++) {
      if (oldEvents[i] === accounts[0]) {
        console.log("Addresse autorisée");
        isApproved = true;
        break;
      }
    }

    console.log("approved:" + isApproved);
    setApproved(isApproved);
  })();
}, [oldEvents]); // Ajout de oldEvents comme dépendance*/


  return (
     <Card color='white'  maxW='700px' bg='blackAlpha.500' boxShadow='2xl' m='5' rounded='md'>
        <CardHeader>
          <Heading  size='md' >Onglet Administrateur</Heading>
        </CardHeader>

        <CardBody  >
          <h2>{approved ? "Autorisé" : "Non autorisé"}</h2>
          <AddVoter workflow={workflow} voterAddress={voterAddress} setVoterAddress={setVoterAddress} />
          <Workflow workflow={workflow} setWorkflow={setWorkflow} />
        </CardBody>
      </Card>

  )
}    

export default OnlyOwner;