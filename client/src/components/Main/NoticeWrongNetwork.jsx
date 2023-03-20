import { WarningTwoIcon } from '@chakra-ui/icons'

function NoticeWrongNetwork() {
  return (
    <>
      <WarningTwoIcon/>
      <p> MetaMask n'est pas connecté au même réseau que celui sur laquelle l'application est déployée.</p>
    </>
  );
}

export default NoticeWrongNetwork;
