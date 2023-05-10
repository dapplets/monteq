// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract MonteQ {
    struct BusinessInfo {
        string id;
        address payable owner;
        string name;
    }

    struct HistoryRecord {
        string businessId;
        address payer;
        uint currencyReceipt;
        uint receiptAmount;
        uint tipAmount;
        uint timestamp; // amount of SECONDS since midnight of January 1, 1970 (Unix time)
    }

    HistoryRecord[] _history;

    mapping(address => uint256[]) _historyByPayer; // mapping(payer.address => IDs of the HistoryRecords in the History)
    mapping(string => uint256[]) _historyByBusiness; // mapping(BusinessId => IDs of the HistoryRecords in the History)

    mapping(string => BusinessInfo) public businessInfos; // mapping(BusinessId => BusinessInfo)
    mapping(address => string[]) public businessIdsByOwner; // mapping(owner => BusinessIds)
    mapping(string => uint) public credits; // mapping(BusinessId => BusinessCredit)

    function getBusinessInfosByOwner(
        address owner
    ) public view returns (BusinessInfo[] memory infos) {
        string[] memory ids = businessIdsByOwner[owner];
        infos = new BusinessInfo[](ids.length);
        for (uint256 i = 0; i < ids.length; ++i) {
            infos[i] = businessInfos[ids[i]];
        }
    }

    function getHistoryByPayer(
        address payer,
        uint256 offset,
        uint256 limit,
        bool reverse
    ) public view returns (HistoryRecord[] memory history, uint256 total) {
        return _paginate(_historyByPayer[payer], offset, limit, reverse);
    }

    function getHistoryByBusiness(
        string calldata businessId,
        uint256 offset,
        uint256 limit,
        bool reverse
    ) public view returns (HistoryRecord[] memory history, uint256 total) {
        return
            _paginate(_historyByBusiness[businessId], offset, limit, reverse);
    }

    function payReceipt(
        string calldata businessId,
        uint currencyReceipt,
        uint amountReceipt
    ) public payable {
        uint amountTips = msg.value - amountReceipt;
        address payable owner = businessInfos[businessId].owner;

        if (owner == address(0)) {
            credits[businessId] += msg.value;
        } else {
            owner.transfer(msg.value);
        }

        HistoryRecord memory newRecord = HistoryRecord(
            businessId,
            msg.sender,
            currencyReceipt, // CAUTION: cannot check
            amountReceipt,
            amountTips,
            block.timestamp
        );

        _history.push(newRecord);
        uint256 recordId = _history.length - 1;
        _historyByPayer[msg.sender].push(recordId);
        _historyByBusiness[businessId].push(recordId);
    }

    function addBusiness(
        string calldata businessId,
        string calldata name
    ) public {
        // ToDo: anyone can link a business
        require(
            businessInfos[businessId].owner == address(0),
            "The business already exists."
        );
        businessInfos[businessId] = BusinessInfo(
            businessId,
            payable(msg.sender),
            name
        );
        businessIdsByOwner[msg.sender].push(businessId);
        if (credits[businessId] > 0) {
            payable(msg.sender).transfer(credits[businessId]);
            delete credits[businessId];
        }
    }

    function removeBusiness(string calldata businessId) public {
        require(
            msg.sender == businessInfos[businessId].owner,
            "Only the business owner can remove it."
        );

        delete businessInfos[businessId];

        // ToDo: out of gas is possible
        string[] storage ids = businessIdsByOwner[msg.sender];
        for (uint256 i = 0; i < ids.length; ++i) {
            if (
                keccak256(abi.encodePacked(ids[i])) ==
                keccak256(abi.encodePacked(businessId))
            ) {
                if (ids.length > 1) {
                    ids[i] = ids[ids.length - 1];
                }

                ids.pop();
                break;
            }
        }
    }

    function _paginate(
        uint256[] memory indexes,
        uint256 offset,
        uint256 limit,
        bool reverse
    ) internal view returns (HistoryRecord[] memory history, uint256 total) {
        total = indexes.length;
        if (limit > total - offset) {
            limit = total - offset;
        }
        history = new HistoryRecord[](limit);
        for (uint256 i = 0; i < limit; ++i) {
            uint256 idx = (reverse) ? (total - offset - 1 - i) : (offset + i);
            history[i] = _history[indexes[idx]];
        }
    }
}
