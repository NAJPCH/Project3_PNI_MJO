import { useEffect, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import { Button , Input } from '@chakra-ui/react'

const ProposalList = ({ workflow }) => {
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

  //console.log ("Old" + oldProposal + "New " + desc);

  return (
    <div>
      <h3>Propositions:</h3>
      <ol>
        {desc.map((propos, index) => (
          <li key={index}>
            Proposition : {propos.description} - Nombre de voies:
            : {propos.voteCount}
          </li>
        ))}
      </ol>
      <div>
        {workflow === "1"  && (
          <form onSubmit={handleSubmit}>
            <Input
                type="text"
                value={newProposal}
                onChange={(e) => setNewProposal(e.target.value)}
                placeholder="Saisir une nouvelle proposition"
                width={300} />
            <Button onClick={addNewProposal} m='5' bg='purple.800' _hover={{ bg: 'purple.600'}}>Ajouter une proposition</Button>
          </form>
        )}
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            value={showProposal}
            onChange={(e) => setShowProposal(e.target.value)}
            placeholder="Saisir le numéro de la proposition"
            width={100} 
          />
          <Button onClick={getOneProposal} m='5' bg='purple.800' _hover={{ bg: 'purple.600'}}>Info de cette proposition</Button>
        </form>
        <p>
          La proposition est : {num} Compte des votes :{showVoteCount}
        </p>
      </div>
    </div>
  );
};

export default ProposalList;
