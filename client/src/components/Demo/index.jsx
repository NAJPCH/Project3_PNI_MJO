import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import AddVoter from "./AddVoter";
import Voter from "./Voter";
import Cta from "./Cta";
import Contract from "./Contract";
import ContractBtns from "./ContractBtns";
import Desc from "./Desc";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";
import ProposalList from "./ProposalList";

function Demo() {
  const { state } = useEth();
  const [value, setValue] = useState("?");
  const [vote, setVote] = useState("?");
  const [workflowStatus, setWorkflow] = useState("??");
  const [finalWinningProposalID, setFinalWinningProposalID] = useState("??");
  const [currentWinningProposalID] = useState("??");
  const [highestVoteCount] = useState("??");

  const demo =
    <>
      <Cta />

      <div className="contract-container">
        <Contract value={value} finalWinningProposalID={finalWinningProposalID} currentWinningProposalID={currentWinningProposalID} highestVoteCount={highestVoteCount} workflowStatus={workflowStatus} />
        <ContractBtns setValue={setValue} setVote={setVote} setWorkflow={setWorkflow} setFinalWinningProposalID={setFinalWinningProposalID}  />
      </div>
      <Desc />
      <AddVoter />
      <ProposalList />
      <Voter />
    </>;

  return (
    <div className="demo">
      <Title />
      {
        !state.artifact ? <NoticeNoArtifact /> :
          !state.contract ? <NoticeWrongNetwork /> :
            demo
      }
    </div>
  );
}

export default Demo;
