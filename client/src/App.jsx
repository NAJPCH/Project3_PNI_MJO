import { EthProvider } from "./contexts/EthContext";
import Header from "./components/Header";
import Main from "./components/Main";
import Footer from "./components/Footer";
import { Grid, GridItem } from '@chakra-ui/react'
import React from "react";
import { useEffect, useState } from "react";


function App(){

  const [connected, setConnected] = useState([""]);
    
  return (
    <EthProvider >
      <Grid templateAreas={`"header" " main" " footer"`} 
            wrap="wrap"
            backgroundImage="url('https://images.typeform.com/images/U9fg8PdXKZz4/background/large')"
            color="white"
            width={{ base: "100%", md: "auto" }}>
        <GridItem p='2' bg='RGBA(0, 0, 0, 0.16)'  area={'header'}>
          <Header connected={connected} />
        </GridItem>
        <GridItem p='2' area={'main'}>
          <Main connected={connected}  setConnected={setConnected} />
        </GridItem>
        <GridItem p='2' bg='RGBA(0, 0, 0, 0.16)' area={'footer'}>
          <Footer />
        </GridItem>
      </Grid>

    </EthProvider>
  );
}

export default App;
