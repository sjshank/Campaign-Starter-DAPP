import loadWeb3 from "../../loadWeb3";
import Campaign from "../../contracts/Campaign.json";

const buildCampaignContractInstance = async (address) => {
    // retrieve web3 object with active connection running on port
    const web3 = await loadWeb3();
    //populate all the available accounts from local running blockchain
    const _accounts = await web3.eth.getAccounts();
    //get the network id of running blockchain
    const _networkId = await web3.eth.net.getId();
    //get deployed network based on network id for required contract
    const deployedNetwork = await Campaign.networks[_networkId];
    //generate contract instance based on contract address, abi, and web2 from deployed network
    const instance = await new web3.eth.Contract(
        Campaign.abi,
        deployedNetwork && address,
    );

    return {
        instance: instance,
        account: _accounts[0]
    }
}

export { buildCampaignContractInstance };