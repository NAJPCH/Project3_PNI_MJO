// Test du Projet 2 PNI
const Voting = artifacts.require("./Voting.sol");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const constants = require('@openzeppelin/test-helpers/src/constants'); 


contract("Voting", accounts => {
  const owner = accounts[0];
  const voter1 = accounts[1];
  const voter2 = accounts[2];
  const voter3 = accounts[3];
  const fakeVoter1 = accounts[4];
  
  let votingInstance;

  context('// ::::::::::::: REGISTRATION ::::::::::::: //', function() {
    describe('Test de la fonction "addVoter"', function() {

      beforeEach(async function () {
        votingInstance = await Voting.new({from: owner});
      })
        
      it('Vérification de l\'enregistrement d\'un votant l\'admin', async () => {
        await votingInstance.addVoter( voter1,{from: owner});
        await votingInstance.addVoter( owner,{from: owner});
        const txGetVoter =  await votingInstance.getVoter.call( voter1,{from: owner});
        expect(txGetVoter.isRegistered).to.equal(true);
      });

      it('Vérification de l\'enregistrement d\'un votant par un voteur', async () => {
        await expectRevert(votingInstance.addVoter(voter1 ,{from: voter1}), "Ownable: caller is not the owner");
      });
      
      it('Require: Double enregistrement', async () => {
        await votingInstance.addVoter( voter1,{from: owner});
        await expectRevert(votingInstance.addVoter(voter1,{from: owner}), "Already registered");
      });

      it('Require: Pas dans le bon workflow', async () => {
        await votingInstance.startProposalsRegistering();
        await expectRevert(votingInstance.addVoter(voter1,{from: owner}), "Voters registration is not open yet");
      });
      
      it('Event: Voteur enregistré', async () => {
        const txAddVoter =  await votingInstance.addVoter( voter1,{from: owner});
        expectEvent(txAddVoter, 'VoterRegistered', { voterAddress: voter1 });
      });

    });
  });

  context('// ::::::::::::: PROPOSAL ::::::::::::: //', function() {
    describe('Test de la fonction "addProposal"', function() {

      beforeEach(async function () {
        votingInstance = await Voting.new({from: owner});
      })
        
      it('Vérification de l\'enregistrement d\'une Proposal', async () => {
        await votingInstance.addVoter( owner,{from: owner});
        await votingInstance.startProposalsRegistering()
        const txAddProposal=  await votingInstance.addProposal("My Proposal",{from: owner});
        let getProposal = await votingInstance.getOneProposal.call(1);
        expect(getProposal.description).to.be.equal("My Proposal"," ECHEC, Attente du mot `My Proposal`  Poposal");
      });

      it('Vérification de l\'enregistrement d\'une Proposal par un non voteur', async () => {
        await votingInstance.addVoter( owner,{from: owner});
        await votingInstance.startProposalsRegistering()
        await expectRevert(votingInstance.addProposal("My Proposal even I can not",{from: fakeVoter1}), "You're not a voter");
      });
      
      it('Require: Vous ne pouvez pas ne rien proposer', async () => {
        await votingInstance.addVoter( owner,{from: owner});
        await votingInstance.startProposalsRegistering()
        await expectRevert(votingInstance.addProposal("",{from: owner}), "Vous ne pouvez pas ne rien proposer");
      });

      it('Require: Pas dans le bon workflow', async () => {
        await votingInstance.addVoter( owner,{from: owner});
        await expectRevert(votingInstance.addProposal("My Proposal",{from: owner}), "Proposals are not allowed yet");
      });
      
      it('Event: Proposal enregistrée', async () => {
        await votingInstance.addVoter( owner,{from: owner});
        await votingInstance.startProposalsRegistering()
        const txAddProposal=  await votingInstance.addProposal("My Proposal",{from: owner});
        let getProposal = await votingInstance.getOneProposal.call(1);
        expectEvent(txAddProposal, 'ProposalRegistered', { proposalId: new BN(1) });
      });

    });
  });


  context('// ::::::::::::: VOTE ::::::::::::: //', function() {
    describe('Test de la fonction "setVote"', function() {

      beforeEach(async function () {
        votingInstance = await Voting.new({from: owner});
      })
        
      it('Vérification de l\'enregistrement d\'un vote', async () => {
        await votingInstance.addVoter( owner,{from: owner});
        await votingInstance.addVoter( voter1,{from: owner});
        await votingInstance.startProposalsRegistering();
        await votingInstance.addProposal( "Proposal 1",{from: owner});
        await votingInstance.endProposalsRegistering();
        await votingInstance.startVotingSession();
        await votingInstance.setVote( new BN(1),{from: voter1});
        const txSetVote2 = await votingInstance.setVote( new BN(1),{from: owner});
        let getProposal = await votingInstance.getOneProposal.call(1);
        expect(getProposal.voteCount).to.be.bignumber.equal(new BN(2)," ECHEC, Cette Poposal aurait du avoir 2 votes");
      });

      it('Require: Double vote', async () => {
        await votingInstance.addVoter( owner,{from: owner});
        await votingInstance.startProposalsRegistering();
        await votingInstance.addProposal( "Proposal 1",{from: owner});
        await votingInstance.addProposal( "Proposal 2",{from: owner});
        await votingInstance.endProposalsRegistering();
        await votingInstance.startVotingSession();
        await votingInstance.setVote( new BN(1),{from: owner});
        await expectRevert(votingInstance.setVote( new BN(2),{from: owner}) , "You have already voted");
      });
      
      it('Require: Proposal not found', async () => {
        await votingInstance.addVoter( owner,{from: owner});
        await votingInstance.startProposalsRegistering();
        await votingInstance.endProposalsRegistering();
        await votingInstance.startVotingSession();
        await expectRevert(votingInstance.setVote(1,{from: owner}), "Proposal not found");
      });

      it('Require: Pas dans le bon workflow', async () => {
        await votingInstance.addVoter( owner,{from: owner});
        await expectRevert(votingInstance.setVote(new BN(1),{from: owner}), "Voting session havent started yet");
      });
      
      it('Event: Vote enregistrée', async () => {
        await votingInstance.addVoter( owner,{from: owner});
        await votingInstance.startProposalsRegistering();
        await votingInstance.addProposal( "Proposal 1",{from: owner});
        await votingInstance.endProposalsRegistering();
        await votingInstance.startVotingSession();
        const txSetVote = await votingInstance.setVote( new BN(1),{from: owner});
        expectEvent(txSetVote, 'Voted', { voter: owner,  proposalId: new BN(1) });
      });

    });
  });

  context('// ::::::::::::: STATE ::::::::::::: //', function() {
    describe('Test de la fonction "startProposalsRegistering"', function() {

      beforeEach(async function () {
        votingInstance = await Voting.new({from: owner});
        await votingInstance.addVoter( owner,{from: owner});
      })
        
      it('Require: Registering proposals cant be started now', async () => {
        await votingInstance.startProposalsRegistering();
        await votingInstance.endProposalsRegistering();
        await expectRevert(votingInstance.startProposalsRegistering(), "Registering proposals cant be started now");
      });


      it('Vérification de la proposal GENESIS', async () => {
        const txStartProposalsRegistering =  await votingInstance.startProposalsRegistering();
        let getGenesisProposal = await votingInstance.getOneProposal.call(0);
        expect(getGenesisProposal.description).to.be.equal("GENESIS"," ECHEC, Attente du mot GENESIS en prepière Poposal");
      });
      
      
      it('Enum: Vérificion du changement d\'état du workflow', async () => {
        const txStartProposalsRegistering =  await votingInstance.startProposalsRegistering();
        expectEvent(txStartProposalsRegistering, 'WorkflowStatusChange', { previousStatus: new BN(0), newStatus: new BN(1)  });
      });

    });

    describe('Test de la fonction "endProposalsRegistering"', function() {

      beforeEach(async function () {
        votingInstance = await Voting.new({from: owner});
      })
        
      it('Require: Registering proposals havent started yet', async () => {
        await expectRevert(votingInstance.endProposalsRegistering(), "Registering proposals havent started yet");
      });
      
      it('Enum: Vérificion du changement d\'état du workflow', async () => {
        await votingInstance.startProposalsRegistering();
        const txEndProposalsRegistering =  await votingInstance.endProposalsRegistering();
        await expectEvent(txEndProposalsRegistering, 'WorkflowStatusChange', { previousStatus: new BN(1), newStatus: new BN(2)  });
      });

    });

    describe('Test de la fonction "startVotingSession"', function() {

      beforeEach(async function () {
        votingInstance = await Voting.new({from: owner});
      })
        
      it('Require: Registering proposals phase is not finished', async () => {
        await expectRevert(votingInstance.startVotingSession(), "Registering proposals phase is not finished");
      });
      
      it('Enum: Vérificion du changement d\'état du workflow', async () => {
        await votingInstance.startProposalsRegistering();
        await votingInstance.endProposalsRegistering();
        const txStartVotingSession =  await votingInstance.startVotingSession();
        await expectEvent(txStartVotingSession, 'WorkflowStatusChange', { previousStatus: new BN(2), newStatus: new BN(3)  });
      });

    });

    describe('Test de la fonction "startVotingSession"', function() {

      beforeEach(async function () {
        votingInstance = await Voting.new({from: owner});
      })
        
      it('Require: Voting session havent started yet', async () => {
        await expectRevert(votingInstance.endVotingSession(), "Voting session havent started yet");
      });
      
      it('Enum: Vérificion du changement d\'état du workflow', async () => {
        await votingInstance.startProposalsRegistering();
        await votingInstance.endProposalsRegistering();
        await votingInstance.startVotingSession();
        const txEndVotingSession =  await votingInstance.endVotingSession();
        await expectEvent(txEndVotingSession, 'WorkflowStatusChange', { previousStatus: new BN(3), newStatus: new BN(4)  });
      });

    });

    describe('Test de la fonction "tallyVotes"', function() {

      beforeEach(async function () {
        votingInstance = await Voting.new({from: owner});
      })

      it('Vérification de la Proposal gagnante', async () => {
        await votingInstance.addVoter( owner,{from: owner});
        await votingInstance.addVoter( voter1,{from: owner});
        await votingInstance.addVoter( voter2,{from: owner});
        await votingInstance.addVoter( voter3,{from: owner});
        await votingInstance.startProposalsRegistering();
        await votingInstance.addProposal( "Proposal 1",{from: owner});
        await votingInstance.addProposal( "Proposal 2",{from: voter1});
        await votingInstance.addProposal( "Proposal 3",{from: voter3});
        await votingInstance.endProposalsRegistering();
        await votingInstance.startVotingSession();
        await votingInstance.setVote( new BN(2),{from: voter1});
        await votingInstance.setVote( new BN(2),{from: voter2});
        await votingInstance.setVote( new BN(2),{from: voter3});
        await votingInstance.setVote( new BN(1),{from: owner});
        await votingInstance.endVotingSession();
        await votingInstance.tallyVotes({from: owner});
        const FinalWinningProposalID = await votingInstance.winningProposalID();
        expect(FinalWinningProposalID).to.be.bignumber.equal( new BN(2)," ECHEC, La `Poposal 2` aurait du gagner avec 2 votes");
      });
        
      it('Require: Current status is not voting session ended', async () => {
        await expectRevert(votingInstance.tallyVotes(), "Current status is not voting session ended");
      });
      
      it('Enum: Vérificion du changement d\'état du workflow', async () => {
        await votingInstance.startProposalsRegistering();
        await votingInstance.endProposalsRegistering();
        await votingInstance.startVotingSession();
        await votingInstance.endVotingSession();
        const txTallyVotes =  await votingInstance.tallyVotes();
        await expectEvent(txTallyVotes, 'WorkflowStatusChange', { previousStatus: new BN(4), newStatus: new BN(5)  });
      });

    });
  });

});

