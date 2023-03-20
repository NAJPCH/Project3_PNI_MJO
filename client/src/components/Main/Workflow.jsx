import { useEffect, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";
import { Button, CheckCircleIcon } from '@chakra-ui/react'


const Workflow = ({ workflow, setWorkflow}) => {
    const { state: { contract , accounts, txhash, web3} } = useEth();
    const [newEvents, setNewEvents] = useState([]);
    

    const workflowStatusNames = [
        "Inscription des électeurs",
        "Enregistrement des propositions commencé",
        "Enregistrement des propositions terminé",
        "Session de vote commencée",
        "Session de vote terminée",
        "Votes comptabilisés"
    ];

    const getWorkflowStatus = async () => {
        const currentWorkflow =await contract.methods.workflowStatus().call({ from: accounts[0] });
        setWorkflow(currentWorkflow);
    };

    const startProposalsRegistering = async e => {
        await contract.methods.startProposalsRegistering().send({ from: accounts[0] });
    };

    const endProposalsRegistering = async e => {
        await contract.methods.endProposalsRegistering().send({ from: accounts[0] });
    };

    const startVotingSession = async e => {
        await contract.methods.startVotingSession().send({ from: accounts[0] });
    };
    const endVotingSession = async e => {
        await contract.methods.endVotingSession().send({ from: accounts[0] });
    };
    const tallyVotes = async e => {
        await contract.methods.tallyVotes().send({ from: accounts[0] });
    };

    useEffect(() => {
        async function getPastEvent() {
            const deployTx = await web3.eth.getTransaction(txhash);
            const results = await contract.getPastEvents("WorkflowStatusChange", { fromBlock: deployTx.blockNumber, toBlock: "latest" });
            
            const pastWorkflowEvents = results.map((workflowEvent) => {
                let pastE = {previousStatus: null, newStatus: null};
                pastE.previousStatus = workflowEvent.returnValues.previousStatus;
                pastE.newStatus = workflowEvent.returnValues.newStatus;
                return pastE;
            });
            setNewEvents(pastWorkflowEvents);
        }
        getPastEvent();

        contract.events.WorkflowStatusChange({ fromBlock: "latest" })
            .on("data", (event) => {
                let newEvent = {previousStatus: null, newStatus: null};
                newEvent.previousStatus = event.returnValues.previousStatus;
                newEvent.newStatus = event.returnValues.newStatus;
                
                let events = newEvents;
                events.push(newEvent);
                setNewEvents(events)
                console.log(newEvents);
            });
    }, [contract , accounts, txhash, web3, workflow]);

    getWorkflowStatus();

    return (
        <>
            <div className="btns">
                { workflow === "0"  && (
                    <Button onClick={startProposalsRegistering} bg='purple.800' _hover={{ bg: 'purple.600' }}>Démarrage des enregistrement des Propositions </Button>
                )}
                {newEvents.length > 0 && newEvents[newEvents.length - 1].newStatus === "1" && (
                    <Button onClick={endProposalsRegistering} bg='purple.800' _hover={{ bg: 'purple.600' }}>Fin d'enregistrement des propositions</Button>
                )}
                {newEvents.length > 0 && newEvents[newEvents.length - 1].newStatus === "2" && (
                   <Button onClick={startVotingSession} bg='purple.800' _hover={{ bg: 'purple.600' }}>Début de la session de vote</Button>
                )}
                {newEvents.length > 0 && newEvents[newEvents.length - 1].newStatus === "3" && (
                    <Button onClick={endVotingSession} bg='purple.800' _hover={{ bg: 'purple.600' }}>Fin de la session de vote</Button>
                )}
                {newEvents.length > 0 && newEvents[newEvents.length - 1].newStatus === "4" && (
                    <Button onClick={tallyVotes} bg='purple.800' _hover={{ bg: 'purple.600' }}>Comptabiliser les votes </Button>
                )}
                {newEvents.length > 0 && newEvents[newEvents.length - 1].newStatus === "5" && (
                    <p>Le vote est terminé <CheckCircleIcon/></p>
                )}
            </div>
            {/*<h2>Historique du workflow</h2>
            <table>
                <thead>
                    <tr>
                        <th></th>
                        <th>Événement #</th>
                        <th>Previous Status</th>
                        <th>New Status</th>
                    </tr>
                </thead>
                <tbody>
                    {newEvents.map((event, index) => (
                        <tr key={index}>
                            <td>#</td>
                            <td>{index + 1}</td>
                            <td>{event.previousStatus}</td>
                            <td>{event.newStatus}</td>
                        </tr>
                    ))}
                </tbody>
                    </table>*/}
            
        </>
    );
};

export default Workflow;
