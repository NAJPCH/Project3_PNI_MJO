import Vote from "./Vote";
import ProposalList from "./ProposalList";

function OnlyVoter() {
  return (
    <>
      <hr />
      <h2>Only Voters</h2>
      <ProposalList />
      <Vote />
    </>
  );
}

export default OnlyVoter;
