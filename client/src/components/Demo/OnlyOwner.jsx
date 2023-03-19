import AddVoter from "./AddVoter";
import Workflow from "./Workflow";
//import { useEffect, useState } from "react";

function OnlyOwner({ workflow, setWorkflow}) {
  
  return (
    <div className="Boxed" >
      <h2>Onglet Administrateur</h2>
      <AddVoter workflow={workflow} />
      <Workflow workflow={workflow} setWorkflow={setWorkflow} />
    </div>
  )
}    

export default OnlyOwner;