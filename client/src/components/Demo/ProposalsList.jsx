import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

const ProposalList = () => {
  const {
    state: { contract, accounts },
  } = useEth();
  const [proposals, setProposals] = useState([""]);
  const [newProposal, setNewProposal] = useState("");

  const addNewProposal = async () => {
    if (newProposal !== "") {
      await contract.methods
        .addProposal(newProposal)
        .send({ from: accounts[0] });
      setProposals(...proposals, newProposal);
      setNewProposal("");
    }
  };

  return (
    <div>
      <h2>Proposals</h2>
      <ul>
        <li>{proposals}</li>
      </ul>
      <div>
        <input
          type="text"
          value={newProposal}
          onChange={(e) => setNewProposal(e.target.value)}
          placeholder="Enter a new proposal"
        />
        <button onClick={addNewProposal}>Add Proposal</button>
      </div>
    </div>
  );
};

export default ProposalList;
