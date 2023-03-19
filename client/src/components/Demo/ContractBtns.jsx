import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

function ContractBtns({ setValue, setWorkflow, setFinalWinningProposalID}) {
  const { state: { contract, accounts } } = useEth();
  const [inputValue, setInputValue] = useState("");
  //const [voterAddress, setVoterAddress] = useState("");
  //const [inputVote, setInputVote] = useState("");


  const handleInputChange = e => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setInputValue(e.target.value);
    }
  };
  /*const handleInputChanged = e => {
    if (/^\d+$|^$/.test(e.target.value)) {
      setInputVote(e.target.value);
    }
  };*/

  const read = async () => {
    const value = await contract.methods.read().call({ from: accounts[0] });
    setValue(value);
  };

  const getWorkflowStatus = async () => {
    const currentWorkflow =await contract.methods.workflowStatus().call({ from: accounts[0] });
    setWorkflow(currentWorkflow);
  };

  const getFinalWinningProposalID = async () => {
    const finalWinningProposalID =await contract.methods.finalWinningProposalID().call({ from: accounts[0] });
    setFinalWinningProposalID(finalWinningProposalID);
  };

  const write = async e => {
    if (e.target.tagName === "INPUT") {
      return;
    }
    if (inputValue === "") {
      alert("Please enter a value to write.");
      return;
    }
    const newValue = parseInt(inputValue);
    await contract.methods.write(newValue).send({ from: accounts[0] });
  };

  /*const getVoter = async e => {
    await contract.methods.getVoter().send({ from: accounts[0], value: voterAddress });
  };*/

  return (
    <div className="btns">

      <button onClick={getFinalWinningProposalID}>
      Who win ?
      </button>

      <button onClick={getWorkflowStatus}>
      Refresh Workflow Status
      </button>
 
      <button onClick={read}>
        read()
      </button>

      <div onClick={write} className="input-btn">
        write(<input
          type="text"
          placeholder="uint"
          value={inputValue}
          onChange={handleInputChange}
        />)
      </div>

    </div>
  );
}

export default ContractBtns;
