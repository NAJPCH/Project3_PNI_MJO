import { Flex, Spacer, Heading, Box, Image } from '@chakra-ui/react'

function Header(connected) {
  return (
  <Flex h='10'>
    <Box boxSize='100px'>
      <Image src='https://images.typeform.com/images/k2fUR6ER8DwM' alt='ALYRA' />
    </Box>
    <Spacer />
    <Box><Heading>Votations ALYRA</Heading></Box>
    <Spacer />
    <Box><h2>connected</h2></Box>
  </Flex>
  );
}

export default Header;
