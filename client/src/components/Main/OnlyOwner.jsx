import AddVoter from "./AddVoter";
import Workflow from "./Workflow";
import { useEffect, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import { Card, CardHeader, CardBody, Heading } from '@chakra-ui/react'

function OnlyOwner({ workflow, setWorkflow, connected, setConnected, oldEvents, setApproved, approved, voterAddress, setVoterAddress}) {
  
  const {
    state: { web3 },
  } = useEth();

  return (
     <Card color='white'  maxW='700px' bg='blackAlpha.500' boxShadow='2xl' m='5' rounded='md'>
        <CardHeader>
          <Heading  size='md' >Onglet Administrateur</Heading>
        </CardHeader>

        <CardBody  >
          <AddVoter workflow={workflow} voterAddress={voterAddress} setVoterAddress={setVoterAddress} />
          <Workflow workflow={workflow} setWorkflow={setWorkflow} />
        </CardBody>
      </Card>

  )
}    

export default OnlyOwner;