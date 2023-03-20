# Projet N°3

# Sommaire
- [Info](#Info)
- [Liens](#Liens)
- [Installation](#Installation)
- [Protection contre une Reentrance](#Protection-contre-une-Reentrance)
- [Protection contre un DoS](#Protection-contre-un-DoS)


# GENERAL
## Info
https://votationsalyra.vercel.app/

## Liens
https://youtu.be/FCkzpNyIIVs

## Installation
npm install --prefix . dotenv
npm install --prefix . @truffle/hdwallet-provider
npm install --prefix . @openzeppelin/contracts @openzeppelin/test-helpers
npm install --prefix . web3

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

