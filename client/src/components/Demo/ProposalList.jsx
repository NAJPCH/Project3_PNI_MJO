import { useEffect, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";

const ProposalList = () => {
  const {
    state: { contract, accounts },
  } = useEth();
  const [proposals, setProposals] = useState("");
  const [newProposal, setNewProposal] = useState("");

  /// TEST ///
  const [oldProposal, setOldProposal] = useState([]);
  const [EventValue, setEventValue] = useState(1);
  const [desc, setDesc] = useState([]);
  const [showProposal, setShowProposal] = useState();
  const [num, setNum] = useState();
  const [showVoteCount, setShowVoteCount] = useState();

  
  ///
  const addNewProposal = async () => {
    if (newProposal !== "") {
      let proposition = await contract.methods
        .addProposal(newProposal)
        .send({ from: accounts[0] });
      setProposals(...proposals, proposition);
      // setDesc(desc.length + 1);
      // getOneProposal();
      // setLength(length + 1);
      setNewProposal("");
    }
  };

  // TEST AVEC USEEFECT ///

  useEffect(() => {
    (async function () {
      let oldProposal = await contract.getPastEvents("ProposalRegistered", {
        fromBlock: 0,
        toBlock: "latest",
      });

      let oldies = [];
      oldProposal.forEach((event) => {
        oldies.push(event.returnValues.proposalId);
      });

      setOldProposal(oldies);

      let descriptions = [];
      for (let id of oldies) {
        let description = await contract.methods
          .getOneProposal(id)
          .call({ from: accounts[0] });
        descriptions.push(description);
      }
      setDesc(descriptions);

      await contract.events
        .ProposalRegistered({ fromBlock: "earliest" })
        .on("data", (event) => {
          let lesevents = event.returnValues.proposalId;
          setEventValue(lesevents);
        });
      // .on("changed", (changed) => console.log(changed))
      // .on("error", (err) => console.log(err))
      // .on("connected", (str) => console.log(str));
    })();
  }, [contract, accounts, EventValue]);

  // useEffect(() => {
  //   if (desc.length <= 0) {
  //     alert("PAS DE PROPOSITION");
  //   } else {
  //     // console.log(desc.length);
  //   }
  // }, [desc]);

  const getOneProposal = async (e) => {
    e.preventDefault();
    if (showProposal !== Number) {
      let proposition = await contract.methods
        .getOneProposal(showProposal)
        .call({ from: accounts[0] });
      setNum(proposition[0]);
      setShowVoteCount(proposition[1]);
    }
    setShowProposal("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  console.log("Le vieux " + oldProposal);
  console.log("Le nouveau " + desc);

  return (
    <div>
      <h2>Proposals</h2>
      <ul>
        {desc.map((propos, index) => (
          <li key={index}>
            La proposition : {propos.description} -------- Le comptage des votes
            : {propos.voteCount}
          </li>
        ))}
      </ul>
      <div>
        <form onSubmit={handleSubmit}>
        <input
            type="text"
            value={newProposal}
            onChange={(e) => setNewProposal(e.target.value)}
            placeholder="Enter a new proposal"
          />
          <button onClick={addNewProposal}>Add Proposal</button>
        </form>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={showProposal}
            onChange={(e) => setShowProposal(e.target.value)}
            placeholder="Enter the number of the proposal"
          />
          <button onClick={getOneProposal}>Get One Proposal</button>
        </form>
        <h3>
          La proposition est : {num} Compte des votes :{showVoteCount}
        </h3>
      </div>
    </div>
  );
};

export default ProposalList;
