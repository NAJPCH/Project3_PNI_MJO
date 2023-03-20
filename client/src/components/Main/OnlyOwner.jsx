import AddVoter from "./AddVoter";
import Workflow from "./Workflow";
import { useEffect, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import { Card, CardHeader, CardBody, Divider, Heading } from '@chakra-ui/react'

function OnlyOwner({ workflow, setWorkflow, connected, setConnected, oldEvents, setApproved}) {
  
  const [voterAddress, setVoterAddress] = useState([]);
  const [authorised, setAuthorised] = useState(""); //doute ici 

  const {  state: { web3 }, } = useEth();

  useEffect(() => {
    (async function () {
      getConnectedAccount();
      for (let i = 0; i < oldEvents.length; i++) {
        if (oldEvents[i] == connected) {
          console.log("`" + oldEvents[i] + "`" + connected + "`");
          setApproved(true);
          setAuthorised(connected);
        }
        return;
      }
    })();
  }, [connected, setApproved, oldEvents]);

  async function getConnectedAccount() {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length > 0) {
      setConnected(accounts[0]);
      // console.log("Adresse du compte connecté :", accounts[0]);
    } else {
      console.log("Aucun compte connecté");
    }
  }

  getConnectedAccount();

  return (

     <Card color='white'  maxW='700px' bg='blackAlpha.500' boxShadow='2xl' m='5' rounded='md'>
        <CardHeader>
          <Heading  size='md' >Onglet Administrateur</Heading>
        </CardHeader>

        <CardBody  >
          <h2>{}</h2>
          <AddVoter workflow={workflow} />
          <Workflow workflow={workflow} setWorkflow={setWorkflow} />
        </CardBody>
      </Card>

  )
}    

export default OnlyOwner;