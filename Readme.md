# Projet N°3

# Sommaire
- [Protection contre une Reentrance](#Protection-contre-une-Reentrance)
- [Protection contre un DoS](#Protection-contre-un-DoS)
- [Test de la fonction "addVoter"](#test-de-la-fonction-addvoter)
- [Test de la fonction "addProposal"](#test-de-la-fonction-addproposal)
- [Test de la fonction "setVote"](#test-de-la-fonction-setvote)
- [Test de la fonction "startProposalsRegistering"](#test-de-la-fonction-startproposalsregistering)
- [Test de la fonction "endProposalsRegistering"](#test-de-la-fonction-endproposalsregistering)
- [Test de la fonction "startVotingSession"](#test-de-la-fonction-startvotingsession)
- [Test de la fonction "endVotingSession"](#test-de-la-fonction-endvotingsession)
- [Test de la fonction "tallyVotes"](#test-de-la-fonction-tallyvotes)

# SECURITE
## Protection contre une Reentrance
Un attaquant pouvait exploiter cette vulnérabilité en écoutant l'événement Voted et en appelant la fonction setVote() à nouveau avant que la transaction d'origine ne soit terminée.
Ainsi, l'attaquant pouvait donc voter plusieurs fois pour une proposition et manipuler le résultat du vote.
Pour résoudre cette vulnérabilité, nous avons modifié l'ordre des opérations et émettant l'événement Voted seulement après avoir enregistré que l'électeur a voté.

## Protection contre un DoS
Le Smart contract est exposé à une attaque DoS liée à la fonction tallyVotes(). Un attaquant pouvait potentiellement soumettre un grand nombre de propositions en créant de multiple comptes factices avec une proposition chacun. Cela aurait rendu la boucle for de tallyVotes() trop coûteuse en gaz et échouer, ce qui pouvait empêcher le résultat du vote.

Pour résoudre ce problème, nous avons fait un mécanisme différent pour compter les votes et déterminer le gagnant.
Il y a maintenant une distinction entre le gagnant en cours et le gagnant final. Cela permet de suivre durant l'évolution des votes le gagnant.
À la fin des votations et lors du tirage, le gagnant en cours devient le gagnant final. Cela évite de faire une boucle for et protège d'une attaque Dos tout en étant optimal en gaz.


# REGISTRATION
## Test de la fonction "addVoter"

Cette fonction permet d'enregistrer un votant. Les tests effectués sont les suivants :

- :white_check_mark: Vérification de l'enregistrement d'un votant par un Admin
- :white_check_mark: Vérification de l'enregistrement d'un votant par un voteur
- :white_check_mark: Vérification du message d'erreur en cas d'enregistrement déjà effectué
- :white_check_mark: Vérification du message d'erreur en cas d'état du workflow incorrect

# PROPOSAL
## Test de la fonction "addProposal"

Cette fonction permet d'enregistrer une proposition. Les tests effectués sont les suivants :

- :white_check_mark: Vérification de l'enregistrement d'une proposition
- :white_check_mark: Vérification de l'enregistrement d'une proposition par un non voteur
- :white_check_mark: Vérification du message d'erreur en cas de description vide
- :white_check_mark: Vérification du message d'erreur en cas d'état du workflow incorrect

# VOTE
## Test de la fonction "setVote"

Cette fonction permet d'enregistrer un vote. Les tests effectués sont les suivants :

- :white_check_mark: Vérification de l'enregistrement d'un vote
- :white_check_mark: Vérification du message d'erreur en cas de vote déjà enregistré
- :white_check_mark: Vérification du message d'erreur en cas d'ID de proposition invalide
- :white_check_mark: Vérification de l'incrémentation du nombre de votes pour la proposition correspondante

## STATE
## Test de la fonction "startProposalsRegistering"

Cette fonction permet de commencer l'enregistrement des propositions. Les tests effectués sont les suivants :

- :white_check_mark: Vérification du changement d'état du workflow

## Test de la fonction "endProposalsRegistering"

Cette fonction permet de terminer l'enregistrement des propositions. Les tests effectués sont les suivants :

- :white_check_mark: Vérification du changement d'état du workflow
- :white_check_mark: Vérification du message d'erreur en cas d'état du workflow incorrect

## Test de la fonction "startVotingSession"

Cette fonction permet de commencer la session de vote. Les tests effectués sont les suivants :

- :white_check_mark: Vérification du changement d'état du workflow
- :white_check_mark: Vérification du message d'erreur en cas d'état du workflow incorrect

## Test de la fonction "endVotingSession"

Cette fonction permet de terminer la session de vote. Les tests effectués sont les suivants :

- :white_check_mark: Vérification du changement d'état du workflow
- :white_check_mark: Vérification du message d'erreur en cas d'état du workflow incorrect

## Test de la fonction "tallyVotes"

Cette fonction permet de compter les votes et d'identifier la proposition gagnante. Les tests effectués sont les suivants :

- :white_check_mark: Vérification de l'identification de la proposition gagnante
- :white_check_mark: Vérification du changement d'état du workflow
- :white_check_mark: Vérification du message d'erreur en cas d'état du workflow incorrect


# GETTERS - Spécifique
## Test de la fonction "getVoter"
- :white_check_mark: Effectué par le test de la fonction "addVoter"

## Test de la fonction "getOneProposal"
- :white_check_mark: Effectué par le test de la fonction "addProposal"

# AUTRE - Spécifique
## Test de OnlyOwner
- :white_check_mark: Effectué par le test de la fonction "addVoter"

## Test de OnlyVoter
- :white_check_mark: Effectué par le test de la fonction "addProposal"

# Screenshots des coverages
![Coverages](/assets/ScreenShots.png)
