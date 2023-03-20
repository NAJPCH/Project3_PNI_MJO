import { WarningTwoIcon } from '@chakra-ui/icons'

function NoticeNoArtifact() {
  return (
    <>
      <WarningTwoIcon/>
      <p>Impossible de trouver l'artefact du contrat <span className="code">Voting</span>.</p>
    </>
  );
}

export default NoticeNoArtifact;
