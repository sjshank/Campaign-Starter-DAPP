pragma solidity >=0.5.0 <0.8.0;
pragma experimental ABIEncoderV2;

contract CampaignFactory {
    address[] public deployedCampaignContracts;

    function createCampaign(uint256 minimum) public {
        address contractAddress = address(new Campaign(minimum, msg.sender));
        deployedCampaignContracts.push(contractAddress);
    }

    function getDeployedContracts() public view returns (address[] memory) {
        return deployedCampaignContracts;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        uint256 approvalCount;
    }

    Request[] public requests;
    address public manager;
    uint256 public minimumContribution;
    //address[] public approvers;
    mapping(address => uint256) public approvers;
    uint256 public approversCount;

    modifier _onlyManager() {
        require(msg.sender == manager, "Only manager has access");
        _;
    }

    constructor(uint256 _minimum, address _owner) public {
        manager = _owner;
        minimumContribution = _minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution, "Require minimum amount");
        // approvers.push(msg.sender);
        approvers[msg.sender] = 1;
        approversCount++;
    }

    function createRequest(
        string memory _description,
        uint256 _value,
        address payable _recipient
    ) public payable {
        Request memory newReq = Request({
            description: _description,
            value: _value,
            recipient: _recipient,
            complete: false,
            approvalCount: 0
        });

        requests.push(newReq);
    }

    function approveRequest(uint256 index) public payable {
        require(
            msg.sender != manager,
            "Manager doesn't have rights to approve request."
        );
        // require(
        //     approvers[msg.sender] == 1,
        //     "It seems you have already approved request."
        // );

        Request storage request = requests[index];
        request.approvalCount++;
        approvers[msg.sender] = 2;
    }

    function finalizeRequest(uint256 index) public payable _onlyManager {
        Request storage request = requests[index];

        require(
            request.approvalCount > (approversCount / 2),
            "Require more number of approvals."
        );
        require(!request.complete, "It seems request already been finalized.");

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getCampaignSummary()
        public
        view
        returns (
            uint256,
            uint256,
            uint256,
            uint256,
            address,
            bool
        )
    {
        bool isManager = manager == msg.sender;
        return (
            minimumContribution,
            address(this).balance,
            requests.length,
            approversCount,
            manager,
            isManager
        );
    }

    function getAllRequest() public view returns (Request[] memory) {
        return requests;
    }

    function getRequestCount() public view returns (uint256) {
        return requests.length;
    }
}
