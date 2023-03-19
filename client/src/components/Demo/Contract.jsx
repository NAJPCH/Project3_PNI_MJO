import { useEffect, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";


function Contract({ value, finalWinningProposalID, currentWinningProposalID, highestVoteCount, workflowStatus }) {
  const [EventValue, setEventValue] = useState("");
  const [oldEvents, setOldEvents] = useState();
 
  const { state: { contract, txhash, web3 } } = useEth();

  

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
    <code>
      {`
      Simple Storage value = `}
      <span className="secondary-color" ><strong>{value}</strong></span>

      {`
      finalWinningProposalID = `}
      <span className="secondary-color" ><strong>{finalWinningProposalID}</strong></span>

      {`
      currentWinningProposalID = `}
      <span className="secondary-color" ><strong>{currentWinningProposalID}</strong></span>
      
      {`
      highestVoteCount = `}
      <span className="secondary-color" ><strong>{highestVoteCount}</strong></span>
      
      {`
      workflowStatus = `}
      <span className="secondary-color" ><strong>{workflowStatus}</strong></span>
    

      {`
      Events arriving: `} {EventValue} 
      {`
      Old events: `} {oldEvents}
   </code>

  );
}

export default Contract;
