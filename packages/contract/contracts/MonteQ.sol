// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract MonteQ {
    struct BusinessInfo {
        address payable owner;
        string name;
    }

    struct HistoryRecord {
        string businessId;
        address payer;
        string currencyType;
        uint currencyReceipt;
        uint currencyTip;
        uint receiptAmount;
        uint tipAmount;
        uint timestamp;
    }

    HistoryRecord[] _history;

    mapping(address => uint256[]) public historyByPayer;
    mapping(string => uint256[]) public historyByBusiness;

    // ToDo Public or private data???
    mapping(address => uint) public payerSpentForBills; // store spent bills amount by payer
    mapping(address => uint) public payerSpentForTips; // store spent tips amount by payer
    mapping(string => uint) public businessGetBills; // store get bills amount by business id
    mapping(string => uint) public businessGetTips; // store get tips amount by business id

    mapping(string => BusinessInfo) public businessInfos; // mapping(BusinessId=>Business)
    mapping(string => uint) _credits; // mapping(BusinessId=>BusinessCredit)

    function getHistoryByPayer(
        address payer,
        uint256 offset,
        uint256 limit,
        bool reverse
    ) public view returns (uint256[] memory history, uint256 total) {
        total = historyByPayer[payer].length;
        require(
            offset < total,
            "The offset is equal to or greater than the total number of records."
        );
        if (limit > total - offset) {
            limit = total - offset;
        }
        history = new uint256[](limit);
        for (uint256 i = 0; i < limit; ++i) {
            uint256 idx = (reverse) ? (total - offset - 1 - i) : (offset + i);
            history[i] = historyByPayer[payer][idx];
        }
    }

    function getHistoryByBusiness(
        string memory businessId,
        uint256 offset,
        uint256 limit,
        bool reverse
    ) public view returns (uint256[] memory history, uint256 total) {
        total = historyByBusiness[businessId].length;
        require(
            offset < total,
            "The offset is equal to or greater than the total number of records."
        );
        if (limit > total - offset) {
            limit = total - offset;
        }
        history = new uint256[](limit);
        for (uint256 i = 0; i < limit; ++i) {
            uint256 idx = (reverse) ? (total - offset - 1 - i) : (offset + i);
            history[i] = historyByBusiness[businessId][idx];
        }
    }

    function payReceipt(
        string calldata businessId,
        string calldata currencyType,
        uint currencyReceipt,
        uint currencyTip,
        uint amountReceipt
    ) public payable {
        require(
            amountReceipt <= msg.value,
            "The amount of the receipt is higher than the amount of attached tokens."
        );
        uint amountTips = msg.value - amountReceipt;

        address payable owner = businessInfos[businessId].owner;
        if (owner == address(0)) {
            _credits[businessId] += msg.value;
        } else {
            owner.transfer(msg.value);
        }

        HistoryRecord memory newRecord = HistoryRecord(
            businessId,
            msg.sender,
            currencyType,
            currencyReceipt,
            currencyTip,
            amountReceipt,
            amountTips,
            block.timestamp
        );
        _history.push(newRecord);
        uint256 recordId = _history.length - 1;
        historyByPayer[msg.sender].push(recordId);
        historyByBusiness[businessId].push(recordId);
        payerSpentForBills[msg.sender] += amountReceipt;
        payerSpentForTips[msg.sender] += amountTips;
        businessGetBills[businessId] += amountReceipt;
        businessGetTips[businessId] += amountTips;
    }

    // ToDo Do we really need to set as the owner some another address?  So why only this owner can delete business but not the address that created it?
    function addBusiness(
        string calldata businessId,
        address payable owner,
        string calldata name
    ) public {
        require(
            businessInfos[businessId].owner == address(0),
            "The business already exists."
        );
        businessInfos[businessId] = BusinessInfo(owner, name);
        if (_credits[businessId] > 0) {
            owner.transfer(_credits[businessId]);
            delete _credits[businessId];
        }
    }

    function removeBusiness(string calldata businessId) public {
        require(
            msg.sender == businessInfos[businessId].owner,
            "Only the business owner can remove it."
        );
        delete businessInfos[businessId];
    }
}
