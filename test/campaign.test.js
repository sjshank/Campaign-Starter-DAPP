const Campaign = require("../build/contracts/Campaign.json");
const CampaignFactory = artifacts.require("CampaignFactory");

contract("Campaign", (accounts) => {

    let CampaignFactoryInstance;
    let CampaignInstance;
    let manager;

    beforeEach(async () => {
        CampaignFactoryInstance = await CampaignFactory.deployed();
        await CampaignFactoryInstance.createCampaign('100', { from: accounts[0] });
        const deployedAddresses = await CampaignFactoryInstance.getDeployedContracts();
        CampaignInstance = await new web3.eth.Contract(Campaign.abi, deployedAddresses[0]);
    });

    it("should deploy both CampaignFactory & Campaign contract", () => {
        assert(CampaignFactoryInstance.address != '');
        assert(CampaignInstance.address != '');
    });

    it("should create campaign contract and populate deployed addresses of campaign", async () => {
        let deployedAddress = await CampaignFactoryInstance.getDeployedContracts();
        console.log(deployedAddress);
        assert.equal(3, deployedAddress.length);
    });

    it("Campaign contract should contain 1 ether as minimum contribution, manager populated", async () => {
        const managerAddress = await CampaignInstance.methods.manager().call();
        manager = managerAddress;
        assert.equal(managerAddress, accounts[0]);
        const minContribution = await CampaignInstance.methods.minimumContribution().call();
        console.log(minContribution);
        assert.equal(100, minContribution);
    });

    it("Should contribute to campaign and populate approver count", async () => {
        await CampaignInstance.methods.contribute().send({
            from: accounts[1],
            value: '101',
            gas: '1000000'
        });
        const approvers = await CampaignInstance.methods.approvers(accounts[1]).call();
        assert.equal(1, approvers);
        await CampaignInstance.methods.contribute().send({
            from: accounts[2],
            value: '104',
            gas: '1000000'
        });
        const approversCount = await CampaignInstance.methods.approversCount().call();
        assert.equal(2, approversCount);
    });

    it("only manager should create request", async () => {
        await CampaignInstance.methods.createRequest("Buy Material", '50', accounts[5]).send({
            from: manager,
            gas: '1000000'
        });
        await CampaignInstance.methods.createRequest("Buy Bio-Chemical", '20', accounts[5]).send({
            from: manager,
            gas: '1000000'
        });
        const request = await CampaignInstance.methods.requests(0).call();
        assert.equal(request.description, "Buy Material");
        assert.equal(request.value, "50");
        assert.equal(request.recipient, accounts[5]);
        assert.equal(request.complete, false);
        assert.equal(request.approvalCount, 0);
    });

    it("should approve request", async () => {
        await CampaignInstance.methods.approveRequest(0).send({
            from: accounts[1],
            gas: '1000000'
        });
        const request = await CampaignInstance.methods.requests(0).call();
        assert.equal(request.approvalCount, 1);
        await CampaignInstance.methods.approveRequest(0).send({
            from: accounts[2],
            gas: '1000000'
        });
        const request1 = await CampaignInstance.methods.requests(0).call();
        assert.equal(request1.approvalCount, 2);
    });

    it("only manager can finalize request", async () => {
        try {
            await CampaignInstance.methods.finalizeRequest(0).send({
                from: accounts[1],
                gas: '1000000'
            });
        } catch (err) {
            assert(err);
        }
    });

    it("should update request and populate recipient balance", async () => {
        const initBalance = await web3.eth.getBalance(accounts[5]);
        await CampaignInstance.methods.finalizeRequest(0).send({
            from: manager,
            gas: '1000000'
        });
        const updatedBalance = await web3.eth.getBalance(accounts[5]);
        const request = await CampaignInstance.methods.requests(0).call();
        assert.equal(request.complete, true);
        assert.notEqual(initBalance, updatedBalance);
    });


    it("should execute E2E test", async () => {
        await CampaignInstance.methods.contribute().send({
            from: accounts[6],
            value: '200',
            gas: '1000000'
        });
        const approvers = await CampaignInstance.methods.approvers(accounts[6]).call();
        assert.equal(1, approvers);

        await CampaignInstance.methods.createRequest("Buy Steel", '40', accounts[7]).send({
            from: manager,
            gas: '1000000'
        })
        const request = await CampaignInstance.methods.requests(2).call();
        assert.equal(request.description, "Buy Steel");

        await CampaignInstance.methods.approveRequest(2).send({
            from: accounts[6],
            gas: '1000000'
        });
        const updatedApprovers = await CampaignInstance.methods.approvers(accounts[6]).call();
        assert.equal(2, updatedApprovers);
        const updatedRequest = await CampaignInstance.methods.requests(2).call();
        assert.equal(updatedRequest.approvalCount, 1);

        await CampaignInstance.methods.approveRequest(2).send({
            from: accounts[1],
            gas: '1000000'
        });
        const initBalance = await web3.eth.getBalance(accounts[7]);
        await CampaignInstance.methods.finalizeRequest(2).send({
            from: manager,
            gas: '1000000'
        });
        const updatedBalance = await web3.eth.getBalance(accounts[5]);
        const finalRequest = await CampaignInstance.methods.requests(2).call();
        assert.equal(finalRequest.complete, true);
        assert(updatedBalance > initBalance);
    });
});