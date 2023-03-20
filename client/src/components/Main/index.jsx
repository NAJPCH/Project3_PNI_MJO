import { useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import OnlyOwner from "./OnlyOwner";
import OnlyVoter from "./OnlyVoter";
import Contract from "./Contract";
import NoticeNoArtifact from "./NoticeNoArtifact";
import NoticeWrongNetwork from "./NoticeWrongNetwork";
import { Card, CardHeader, CardBody, Heading, Grid , GridItem } from '@chakra-ui/react'



function Main( connected, setConnected ) {
  const { state } = useEth();
  const [vote, setVote] = useState();
  const [workflow, setWorkflow] = useState();
  const [finalWinningProposalID, setFinalWinningProposalID] = useState();
  const [currentWinningProposalID] = useState();
  const [highestVoteCount] = useState();
  const [approved, setApproved] = useState(false);
  const [authorised, setAuthorised] = useState("");

  const main =
  <Grid  templateRows='repeat(2, 1fr)' templateColumns='repeat(4, 1fr)' gap={0}>
    <GridItem rowSpan={3} colSpan={2} minH='700px' >
      <Card color='white'  maxW='700px' bg='blackAlpha.500' boxShadow='2xl' m='5' rounded='md'>
        <CardHeader>
          <Heading size='md' >Données publiques</Heading>
        </CardHeader>

        <CardBody >
        <Contract vote={vote} 
                  finalWinningProposalID={finalWinningProposalID} 
                  currentWinningProposalID={currentWinningProposalID} 
                  highestVoteCount={highestVoteCount} 
                  workflow={workflow} setVote={setVote} 
                  setWorkflow={setWorkflow} 
                  setFinalWinningProposalID={setFinalWinningProposalID} />
        </CardBody>
        </Card>         
    </GridItem>
    <GridItem rowSpan={1} colSpan={2} ><OnlyOwner workflow={workflow} setWorkflow={setWorkflow} connected={connected} setConnected={setConnected} authorised={authorised} approved={approved}/></GridItem>
    <GridItem rowSpan={1} colSpan={2} ><OnlyVoter workflow={workflow} /></GridItem>
    </Grid>

  return (
    <div>
      
      {
        !state.artifact ? <NoticeNoArtifact /> :
          !state.contract ? <NoticeWrongNetwork /> :
            main
      }
    </div>
  );
}

export default Main;

/*

*/