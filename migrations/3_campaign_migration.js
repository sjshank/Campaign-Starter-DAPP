const CampaignFactory = artifacts.require("CampaignFactory");
const Campaign = artifacts.require("Campaign");


module.exports = function (deployer, network, accounts) {
  deployer.deploy(Campaign, '200', accounts[0]);
  //campaign = await new web3.eth.Contract(Campaign.abi, campaignAddresses[0]);
};
