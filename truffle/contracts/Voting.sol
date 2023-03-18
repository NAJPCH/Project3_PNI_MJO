// SPDX-License-Identifier: MIT

/// @title ALYRA Projet N3 Votation
/// @author PNI & MJO NatSpec en Pair Programming
/// @notice Réalisation d'une première Dapp de votation sur la base du projet N2 Voting
/// @dev Utilisation des librairies d'OpenZeppelin 
/// @custom:experimental Ce contract est experimental.

pragma solidity 0.8.18;
import "../node_modules/@OpenZeppelin/contracts/access/Ownable.sol";


contract Voting is Ownable {
    // Temporaire Pour des tests
    uint256 value;
    function read() onlyOwner public view returns (uint256) { return value; }
    function write(uint256 newValue) onlyOwner public { value = newValue; emit valueChanged(newValue);  }
    //*constructor() {addVoter(msg.sender); }
    event valueChanged (uint _val);


    /// @dev modification du gagnant final
    uint public finalWinningProposalID;
    /// @dev mise en place d'un gagnant temporaire
    uint public currentWinningProposalID;
    uint public highestVoteCount;

    /// @custom:struct Voter
    /// @notice Cette structure représente un électeur enregistré et indique s'il a voté et pour quelle proposition
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    /// @custom:struct Proposal
    /// @notice Cette structure représente une proposition avec sa description et son nombre de votes
    struct Proposal {
        string description;
        uint voteCount;
    }

    /// @custom:struct WorkflowStatus
    /// @notice Cette énumération définit les différents états du processus de vote
    enum  WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    WorkflowStatus public workflowStatus;
    Proposal[] proposalsArray;
    mapping (address => Voter) voters;
    
    /// @notice Cet événement est émis lorsqu'un électeur est enregistré
    /// @param voterAddress L'adresse de l'électeur enregistré
    event VoterRegistered(address voterAddress); 

    /// @notice Cet événement est émis lorsqu'il y a un changement d'état dans le processus de vote
    /// @param previousStatus L'état précédent avant le changement
    /// @param newStatus L'état après le changement
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);

    /// @notice Cet événement est émis lorsqu'une nouvelle proposition est enregistrée
    /// @param proposalId L'ID de la nouvelle proposition enregistrée
    event ProposalRegistered(uint proposalId);

    /// @notice Cet événement est émis lorsqu'un électeur vote pour une proposition
    /// @param voter L'adresse de l'électeur qui a voté
    /// @param proposalId L'ID de la proposition pour laquelle l'électeur a voté
    event Voted (address voter, uint proposalId);
    
    /// @notice Modifier pour restreindre l'accès aux électeurs enregistrés
    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }


    // ::::::::::::: GETTERS ::::::::::::: //
    /// @notice Cette fonction permet de récupérer les informations d'un électeur enregistré
    /// @param _addr L'adresse de l'électeur dont on souhaite récupérer les informations
    /// @return Voter Les informations de l'électeur
    function getVoter(address _addr) external onlyVoters view returns (Voter memory) {
        return voters[_addr];
    }
    
    /// @notice Cette fonction permet de récupérer les informations d'une proposition enregistrée
    /// @param _id L'ID de la proposition dont on souhaite récupérer les informations
    /// @return Proposal Les informations de la proposition
    function getOneProposal(uint _id) external onlyVoters view returns (Proposal memory) {
        return proposalsArray[_id];
    }
 
    // ::::::::::::: REGISTRATION ::::::::::::: // 
    /// @notice Cette fonction permet à l'administrateur d'ajouter un électeur à la liste des électeurs enregistrés
    /// @param _addr L'adresse de l'électeur à ajouter
    function addVoter(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Voters registration is not open yet');
        require(voters[_addr].isRegistered != true, 'Already registered');
    
        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }
 

    // ::::::::::::: PROPOSAL ::::::::::::: // 
    /// @notice Cette fonction permet à un électeur enregistré d'ajouter une proposition à la liste des propositions enregistrées
    /// @param _desc La description de la proposition à ajouter
    function addProposal(string calldata _desc) external onlyVoters {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Proposals are not allowed yet');
        require(keccak256(abi.encode(_desc)) != keccak256(abi.encode("")), 'Vous ne pouvez pas ne rien proposer'); // facultatif
        // voir que desc est different des autres

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length-1);
    }

    // ::::::::::::: VOTE ::::::::::::: //
    /// @notice Cette fonction permet à un électeur enregistré de voter pour une proposition
    /// @param _id L'ID de la proposition pour laquelle l'électeur souhaite voter
    function setVote( uint _id) external onlyVoters {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        require(voters[msg.sender].hasVoted != true, 'You have already voted');
        require(_id < proposalsArray.length, 'Proposal not found'); // pas obligé, et pas besoin du >0 car uint
       
        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedProposalId = _id;

        proposalsArray[_id].voteCount++;

        if (proposalsArray[_id].voteCount > highestVoteCount) {
            highestVoteCount = proposalsArray[_id].voteCount;
            currentWinningProposalID = _id;
        }

        emit Voted(msg.sender, _id);
    }

    // ::::::::::::: STATE ::::::::::::: //
    /// @notice Cette fonction permet à l'administrateur de commencer la période d'enregistrement des propositions
    function startProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, 'Registering proposals cant be started now');
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        
        Proposal memory proposal;
        proposal.description = "GENESIS";
        proposalsArray.push(proposal);
        
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    /// @notice Cette fonction permet à l'administrateur de mettre fin à la période d'enregistrement des propositions
    function endProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, 'Registering proposals havent started yet');
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    /// @notice Cette fonction permet à l'administrateur de commencer la période de vote
    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, 'Registering proposals phase is not finished');
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    /// @notice Cette fonction permet à l'administrateur de clore la période de vote
    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, 'Voting session havent started yet');
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    /// @notice Cette fonction permet à l'administrateur de déterminer le gagnant
    function tallyVotes() external onlyOwner {
       require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");
       finalWinningProposalID = currentWinningProposalID;
    
       workflowStatus = WorkflowStatus.VotesTallied;
       emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }

}