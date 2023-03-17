
function Contract({ value, finalWinningProposalID, currentWinningProposalID, highestVoteCount }) {

  return (
    <code>
      {`Simple Storage value = `}
      <span className="secondary-color" ><strong>{value}</strong></span>

      {`finalWinningProposalID = `}
      <span className="secondary-color" ><strong>{finalWinningProposalID}</strong></span>

      {`currentWinningProposalID = `}
      <span className="secondary-color" ><strong>{currentWinningProposalID}</strong></span>
      
      {`highestVoteCount = `}
      <span className="secondary-color" ><strong>{highestVoteCount}</strong></span>

    </code>

  );
}

export default Contract;
