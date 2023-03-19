import Vote from "./Vote";
import ProposalList from "./ProposalList";

function OnlyVoter({ workflow }) {
  return (
    <div className="Boxed" >
      <h2>Onglet Voteur</h2>
      <ProposalList workflow={workflow} />
      <Vote workflow={workflow} />
    </div>
  );
}

export default OnlyVoter;
