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

  const startProposalsRegistering = async e => {
    await contract.methods.startProposalsRegistering().send({ from: accounts[0] });
  };

  const endProposalsRegistering = async e => {
    await contract.methods.endProposalsRegistering().send({ from: accounts[0] });
  };

  const startVotingSession = async e => {
    await contract.methods.startVotingSession().send({ from: accounts[0] });
  };
  const endVotingSession = async e => {
    await contract.methods.endVotingSession().send({ from: accounts[0] });
  };
  const tallyVotes = async e => {
    await contract.methods.tallyVotes().send({ from: accounts[0] });
  };
  
  /*const getVoter = async e => {
    await contract.methods.getVoter().send({ from: accounts[0], value: voterAddress });
  };*/

  /*const setVote = async e => {
    if (e.target.tagName === "INPUT") {
      return;
    }
    if (inputVote === "") {
      alert("Please enter a value to write.");
      return;
    }
    const newVote = parseInt(inputVote);
    await contract.methods.setVote(newVote).send({ from: accounts[0] });
  };*/


  return (
    <div className="btns">

      <button onClick={getFinalWinningProposalID}>
      get Final Winning Proposal ID
      </button>

      <button onClick={getWorkflowStatus}>
      get Workflow Status
      </button>
      
      <button onClick={startProposalsRegistering}>
      start Proposals Registering
      </button>

      <button onClick={endProposalsRegistering}>
      end Proposals Registering
      </button>

      <button onClick={startVotingSession}>
      start Voting Session
      </button>

      <button onClick={endVotingSession}>
      end Voting Session
      </button>

      <button onClick={tallyVotes}>
      tally Votes  
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
