import { useEffect, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";


function Contract({ finalWinningProposalID, currentWinningProposalID, highestVoteCount, workflow }) {
  const [EventValue, setEventValue] = useState("");
  const [oldEvents, setOldEvents] = useState();
 
  const { state: { contract, txhash, web3 } } = useEth();

  
  const workflowStatusNames = [
    "Inscription des électeurs",
    "Enregistrement des propositions commencé",
    "Enregistrement des propositions terminé",
    "Session de vote commencée",
    "Session de vote terminée",
    "Votes comptabilisés"
];

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
      <p>Statut actuel du workflow: {workflow}/5  {workflowStatusNames[workflow]}</p>
      <div className="progress-bar">
        <div className="progress" style={{ width: (workflow * 20) + '%' }}></div>
      </div>
      {workflow >= "4"  && (
        <p>Gagnant en cours: {currentWinningProposalID}</p>
      )}
      {workflow === "5"  && (
        <p>Gagnant: {finalWinningProposalID}</p>
      )}
      <p>highestVoteCount: {highestVoteCount}</p>
      
      {/** <p>Events arriving: {EventValue} </p>
      <p> Old events: {oldEvents}</p> */}
   </>

  );
}

export default Contract;
