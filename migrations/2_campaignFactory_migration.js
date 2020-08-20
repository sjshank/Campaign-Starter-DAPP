const CampaignFactory = artifacts.require("CampaignFactory");
const Campaign = artifacts.require("Campaign");

module.exports = function (deployer, network, accounts) {
  deployer.deploy(CampaignFactory).then(async (factoryInstance) => {
    const campaignAddresses = await factoryInstance.createCampaign('200', { from: accounts[0], gas: '2060000' });
    campaign = await new web3.eth.Contract(Campaign.abi, campaignAddresses[0]);
  });
};

