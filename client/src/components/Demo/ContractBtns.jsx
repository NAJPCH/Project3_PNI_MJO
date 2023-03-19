//import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function ContractBtns({  setWorkflow, setFinalWinningProposalID}) {
  const { state: { contract, accounts } } = useEth();

  const getWorkflowStatus = async () => {
    const currentWorkflow =await contract.methods.workflowStatus().call({ from: accounts[0] });
    setWorkflow(currentWorkflow);
  };

  const getFinalWinningProposalID = async () => {
    const finalWinningProposalID =await contract.methods.finalWinningProposalID().call({ from: accounts[0] });
    setFinalWinningProposalID(finalWinningProposalID);
  };

  return (
    <div className="btns">
      <button onClick={getFinalWinningProposalID}>
      Who win ?
      </button>

      <button onClick={getWorkflowStatus}>
      Refresh Workflow Status
      </button>
    </div>
  );
}

export default ContractBtns;
