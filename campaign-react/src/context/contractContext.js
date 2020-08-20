import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { withRouter } from 'react-router-dom';
import loadWeb3 from "../loadWeb3";
import CampaignFactory from "../contracts/CampaignFactory.json";


const ContractContext = React.createContext(null);

const ContractContextProvider = (props) => {

    const [contractInst, setContractInstance] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        try {
            setShowSpinner(prevSpinner => !prevSpinner);
            const connectToBlockchain = async () => {
                // retrieve web3 object with active connection running on port
                const web3 = await loadWeb3();
                //populate all the available accounts from local running blockchain
                const _accounts = await web3.eth.getAccounts();
                //get the network id of running blockchain
                const _networkId = await web3.eth.net.getId();
                //get deployed network based on network id for required contract
                const deployedNetwork = CampaignFactory.networks[_networkId];
                //generate contract instance based on contract address, abi, and web2 from deployed network
                let instance = null;
                if (deployedNetwork) {
                    instance = new web3.eth.Contract(
                        CampaignFactory.abi,
                        deployedNetwork && deployedNetwork.address,
                    );
                } else {
                    toast.warning("Make sure you have logged in to Blockchain Network");
                }
                //Populate state object
                await setContractInstance(instance);
                await setAccounts(_accounts);

                setShowSpinner(prevSpinner => !prevSpinner);
            };

            connectToBlockchain();
        } catch (err) {
            toast.error("Something went wrong ! Please try after sometime");
        }

    }, []);

    const createCampaign = (minimumCont) => {
        setShowSpinner(prevSpinner => !prevSpinner);
        if (contractInst && contractInst.methods) {
            contractInst.methods.createCampaign(minimumCont).send({
                from: accounts[0]
            })
                .then((response) => {
                    toast.success("Campaign has been created successfully !");
                    props.history.push("/");
                    setShowSpinner(prevSpinner => !prevSpinner);
                })
                .catch(err => {
                    setShowSpinner(prevSpinner => !prevSpinner);
                    toast.error(err.message ? err.message : "Something went wrong ! Please try after sometime.")
                });
        } else {
            setShowSpinner(false);
            toast.warning("Make sure you have logged in to Blockchain Network");
        }
    }

    return (
        <ContractContext.Provider value={{
            contractInst,
            accounts,
            showSpinner,
            createCampaign
        }}>
            <ToastContainer />
            {props.children}
        </ContractContext.Provider>
    );
}
const ContractProvider = withRouter(ContractContextProvider);

export { ContractContext, ContractProvider };