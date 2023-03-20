import Vote from "./Vote";
import ProposalList from "./ProposalList";
import { Card, CardHeader, CardBody, Heading } from '@chakra-ui/react'

function OnlyVoter({ workflow }) {
  return (
    <Card color='white'  maxW='700px' bg='blackAlpha.500' boxShadow='2xl' m='5' rounded='md'>
        <CardHeader>
          <Heading size='md' >Onglet Voteur</Heading>
        </CardHeader>

        <CardBody>
          <ProposalList workflow={workflow} />
          <Vote workflow={workflow} />
      </CardBody>
    </Card>
  );
}

export default OnlyVoter;
