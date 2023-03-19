import AddVoter from "./AddVoter";
import Workflow from "./Workflow";

function OnlyOwner() {
  return (
    <>      
      <hr />
      <h2>Only Owner</h2>
      <AddVoter />
      <Workflow />
    </>
  )
}    

export default OnlyOwner;