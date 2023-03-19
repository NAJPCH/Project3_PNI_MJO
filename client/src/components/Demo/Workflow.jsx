import { useEffect, useState } from "react";
import useEth from "../../contexts/EthContext/useEth";


const Workflow = () => {
    const { state: { contract , accounts, txhash, web3} } = useEth();
    const [newEvents, setNewEvents] = useState([]);
    const [testNewE, setTestNewE] = useState(false);
    const [workflow, setWorkflow] = useState(null);

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
        getWorkflowStatus();

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
                // Mettre à jour l'état avec un nouvel événement
                setTestNewE(true);
                
                // Créez un nouvel objet pour stocker les valeurs previousStatus et newStatus
                let newEvent = {previousStatus: null, newStatus: null};
                
                // Récupérez les valeurs de l'événement et stockez-les dans l'objet
                newEvent.previousStatus = event.returnValues.previousStatus;
                newEvent.newStatus = event.returnValues.newStatus;
                
                // Mettez à jour la liste des événements et l'état du composant
                let events = newEvents;
                events.push(newEvent);
                setNewEvents(events)
                console.log(newEvents);
            });
    //});
    }, []);

    return (
        <div>
            <div className="btns">
                <button onClick={startProposalsRegistering}>
                start Proposals Registering
                </button>

                <button onClick={endProposalsRegistering}>
                end Proposals Registering
                </button>

                <button onClick={startVotingSession}>
                start Voting Session
                </button>

                <button onClick={endVotingSession}>
                end Voting Session
                </button>

                <button onClick={tallyVotes}>
                tally Votes  
                </button>
            </div>
            <h2>Historique du workflow</h2>
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
            </table>
            <div>
                <h2>Statut actuel du workflow</h2>
                  <p>{newEvents.length > 0 ? (workflowStatusNames[newEvents[newEvents.length - 1].newStatus]) : (workflowStatusNames[0])}</p>

            </div>
        </div>
    );
};


export default Workflow;