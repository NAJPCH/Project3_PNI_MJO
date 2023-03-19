import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

import OnlyOwner from "./OnlyOwner";
import OnlyVoter from "./OnlyVoter";

import Contract from "./Contract";
import ContractBtns from "./ContractBtns";

import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";


function Demo() {
  const { state } = useEth();
  const [vote, setVote] = useState();
  const [workflow, setWorkflow] = useState();
  const [finalWinningProposalID, setFinalWinningProposalID] = useState();
  const [currentWinningProposalID] = useState();
  const [highestVoteCount] = useState();

  const demo =
    <>
      <div className="contract-container Boxed">
        <h2>Données publiques</h2>
        <Contract vote={vote} finalWinningProposalID={finalWinningProposalID} currentWinningProposalID={currentWinningProposalID} highestVoteCount={highestVoteCount} workflow={workflow} />
        <ContractBtns setVote={setVote} setWorkflow={setWorkflow} setFinalWinningProposalID={setFinalWinningProposalID}  />
      </div>
      <OnlyOwner workflow={workflow} setWorkflow={setWorkflow}/>
      <OnlyVoter workflow={workflow} />
    </>;

  return (
    <div>
      {
        !state.artifact ? <NoticeNoArtifact /> :
          !state.contract ? <NoticeWrongNetwork /> :
            demo
      }
    </div>
  );
}

export default Demo;