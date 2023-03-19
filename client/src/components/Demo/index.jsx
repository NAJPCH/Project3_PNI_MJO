import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

import OnlyOwner from "./OnlyOwner";
import OnlyVoter from "./OnlyVoter";

import Contract from "./Contract";
import ContractBtns from "./ContractBtns";

import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";
import ProposalList from "./ProposalsList";


function Demo() {
  const { state } = useEth();
  const [value, setValue] = useState("?");
  const [vote, setVote] = useState("?");
  const [workflowStatus, setWorkflow] = useState("??");
  const [finalWinningProposalID, setFinalWinningProposalID] = useState("??");

  const [currentWinningProposalID] = useState("??");
  const [highestVoteCount] = useState("??");

  const demo = (
    <>
      <div className="contract-container">
        <Contract value={value} finalWinningProposalID={finalWinningProposalID} currentWinningProposalID={currentWinningProposalID} highestVoteCount={highestVoteCount} workflowStatus={workflowStatus} />
        <ContractBtns setValue={setValue} setVote={setVote} setWorkflow={setWorkflow} setFinalWinningProposalID={setFinalWinningProposalID}  />
      </div>
      
      <OnlyOwner />
      <OnlyVoter />
      
    </>;

  return (
    <div className="demo">
      <h2>Public</h2>
      {
        !state.artifact ? <NoticeNoArtifact /> :
          !state.contract ? <NoticeWrongNetwork /> :
            demo
      }

    </div>
  );
}

export default Demo;

