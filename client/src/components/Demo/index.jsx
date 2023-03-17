import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import Title from "./Title";
import Cta from "./Cta";
import Contract from "./Contract";
import ContractBtns from "./ContractBtns";
import Desc from "./Desc";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";

function Demo() {
  const { state } = useEth();
  const [value, setValue] = useState("?");
  const [finalWinningProposalID] = useState("??");
  const [ currentWinningProposalID] = useState("??");
  const [highestVoteCount] = useState("??");

  const demo =
    <>
      <Cta />
      <div className="contract-container">
        <Contract value={value} finalWinningProposalID={finalWinningProposalID} currentWinningProposalID={currentWinningProposalID} highestVoteCount={highestVoteCount} />
        <ContractBtns setValue={setValue} />
      </div>
      <Desc />
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