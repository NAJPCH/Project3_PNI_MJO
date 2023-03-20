import { useEffect, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import { CircularProgress, CircularProgressLabel } from '@chakra-ui/react'
import { Grid, GridItem, Button, Divider, Checkbox, Stack, Heading} from '@chakra-ui/react'

function Public({ finalWinningProposalID, currentWinningProposalID, highestVoteCount, workflow , setWorkflow, setFinalWinningProposalID, oldEvents, setOldEvents}) {
  const [EventValue, setEventValue] = useState("");

 
  const { state: { contract, txhash,accounts, web3 } } = useEth();

  /*const workflowStatusNames = [
    "Inscription des électeurs",
    "Enregistrement des propositions commencé",
    "Enregistrement des propositions terminé",
    "Session de vote commencée",
    "Session de vote terminée",
    "Votes comptabilisés"
  ];  */

  const getWorkflowStatus = async () => {
    const currentWorkflow =await contract.methods.workflowStatus().call({ from: accounts[0] });
    setWorkflow(currentWorkflow);
  };

  const getFinalWinningProposalID = async () => {
    const finalWinningProposalID =await contract.methods.finalWinningProposalID().call({ from: accounts[0] });
    setFinalWinningProposalID(finalWinningProposalID);
  };

  useEffect(() => {
    (async function () {
        const deployTx = await web3.eth.getTransaction(txhash);
        
        let oldEvents= await contract.getPastEvents('VoterRegistered', {
          fromBlock: deployTx.blockNumber,
          toBlock: 'latest'
        });

        let oldies=[];
        oldEvents.forEach(event => {
            oldies.push(event.returnValues.voterAddress);
        });

        setOldEvents(oldies);
 
        await contract.events.VoterRegistered({fromBlock:"earliest"})
        .on('data', event => {
          let lesevents = event.returnValues.voterAddress;
          setEventValue(lesevents);
        })          
        .on('changed', changed => console.log(changed))
        .on('error', err => console.log(err))
        .on('connected', str => console.log(str))

    })();
  }, [contract])
  
  return (
    <>
      <Grid templateAreas={`"nav bar main"`}>

        <GridItem  pl='10' area={'nav'}>
          <CircularProgress color='purple.800' value={workflow*20} size='140px'>
            <CircularProgressLabel>{workflow}/5</CircularProgressLabel>
          </CircularProgress>
        </GridItem>

        <GridItem  pl='10' area={'bar'}>
          <Divider orientation='vertical' />  
        </GridItem>
        <GridItem pl='10'  area={'main'}>
        {/*<Heading size='md' pb='10' >Statut en cours: {workflow}/5 <br/> {workflowStatusNames[workflow]}</Heading>*/}
          <Stack spacing={5} pb='10' direction='column'>
            <Checkbox isDisabled isChecked={workflow >= "0"} > 0. Inscription des électeurs</Checkbox> 
            <Checkbox isDisabled isChecked={workflow >= "1"} > 1. Enregistrement des propositions commencé</Checkbox>
            <Checkbox isDisabled isChecked={workflow >= "2"} > 2. Enregistrement des propositions terminé</Checkbox>
            <Checkbox isDisabled isChecked={workflow >= "3"} > 3. Session de vote commencée</Checkbox>
            <Checkbox isDisabled isChecked={workflow >= "4"} > 4. Session de vote terminée</Checkbox>
            <Checkbox isDisabled isChecked={workflow >= "5"} > 5. Votes comptabilisés</Checkbox>
          </Stack>
          {workflow >= "4"  && (
            <p>Gagnant en cours: {currentWinningProposalID}</p>
          )}
          {workflow === "5"  && (
            <p>Gagnant: {finalWinningProposalID}</p>
          )}
          <p>highestVoteCount: {highestVoteCount}</p>

          {/** <p>Events arriving: {EventValue} </p>
          <p> Old events: {oldEvents}</p> */}
            <div>
              <ul>
                {oldEvents.map((events, index) => (
                  <li key={index}>
                    {index + 1} : {events}
                  </li>
                ))}
              </ul>
              <Button onClick={getFinalWinningProposalID} m='5' bg='purple.800' _hover={{ bg: 'purple.600' }}>Gagnant ?</Button>
              <Button onClick={getWorkflowStatus} m='5' bg='purple.800' _hover={{ bg: 'purple.600' }}>Actualiser</Button>
            </div>
        </GridItem>
      </Grid>
   </>

  );
}

export default Public;
