function Link({ uri, text }) {
  return <a href={uri} target="_blank" rel="noreferrer">{text}</a>;
}

function Footer() {
  return (
    <footer>
      <hr />
      <h2>Info</h2>
      <Link uri={"https://github.com/NAJPCH/Project3_PNI_MJO"} text={"GitHub"} />
      <Link uri={"https://www.alyra.fr/formations/decouvrir-la-formation-developpeur-blockchain-alyra"} text={"Projet de formation Alyra"} />
      <Link uri={"https://https://www.google.fr/"} text={"Vidéo de présentation"} />
    </footer >
  );
}

export default Footer;
