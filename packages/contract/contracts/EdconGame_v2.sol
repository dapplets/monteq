// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.19 <0.9.0;

/**
 * EdCon MonteQ game .
 * just for start.
 *
 * ver 0.2
 **/
contract EdconGame {
    constructor(address[] memory _gameMasters) {
        for (uint n = 0; n < _gameMasters.length; ++n) {
            gameMasters.push(_gameMasters[n]);
        }
        gameMasters.push(msg.sender);
    }

    uint constant LOCKTIME = 1 hours;

    uint constant KARMA_TRANSFER = 10;
    uint constant KARMA_KICKBACK = 3;
    uint constant KARMA_NEW_USER = 30;

    uint8 constant DEFAULT_INITIAL_RANK = 2;

    struct TokenInfo {
        string ticker;
        string tokenName;
        string iconUrl;
        address creator;
    }

    struct LogEntry {
        uint8 tokenId;
        address to;
        uint256 datetime;
    }

    struct KarmaKick {
        address addrTo;
        uint points;
    }

    struct KarmaKicks {
        KarmaKick[] kicks;
        uint8 head;
    }

    mapping(address => mapping(uint => uint)) public box; // who owns what
    mapping(address => mapping(uint => uint)) public karma; // user's giveaway karma
    mapping(address => mapping(uint => uint)) public accountLocks; // mapping(hash(addrTo,addrTo)=>lastDatetime)   - stores the last transaction time for the pair (from,to)
    mapping(address => mapping(uint => KarmaKicks)) public karmaKicks; // user's giveaway karma kickbacks
    mapping(address => mapping(uint => uint8)) public ambassadorRank; // if 0 - regular user
    mapping(address => LogEntry[]) public logs; // transfer log.

    TokenInfo[] public tokenInfos;
    mapping(string => bool) public tokenExists; //mapping(ticker=>bool)
    mapping(address => bool) public userExists;
    mapping(address => mapping(string => bool)) public approvedCreators; //mapping(address,ticker) => true if approved

    address[] public accounts;
    address[] public gameMasters;

    function setAmbassador(
        address addr,
        uint8 tokenId
    ) public ambassadorOnly(tokenId) {
        ambassadorRank[addr][tokenId] = ambassadorRank[msg.sender][tokenId] - 1; // if set to 0 means REGULAR_USER,
    }

    function setAmbassador(
        address addr,
        uint8 tokenId,
        uint8 _ambassadorRank
    ) public ambassadorOnly(tokenId) {
        require(
            msg.sender == tokenInfos[tokenId].creator ||
                ambassadorRank[msg.sender][tokenId] > _ambassadorRank,
            "only creator can increase ambassador rank"
        );
        ambassadorRank[addr][tokenId] = _ambassadorRank; // if set to 0 means REGULAR_USER,
    }

    function transferBatch(
        uint8[] calldata tokenIds,
        uint120[] calldata amounts,
        address to
    ) public {
        require(tokenIds.length == amounts.length, "Length mismatch");
        for (uint n = 0; n < tokenIds.length; ++n) {
            transfer(tokenIds[n], amounts[n], to);
        }
    }

    function transfer(uint8 tokenId, uint120 amount, address to) public {
        if (ambassadorRank[msg.sender][tokenId] == 0) {
            require(box[msg.sender][tokenId] >= amount, "unsufficient funds");
            require(
                getTimeToUnlock(to, tokenId) == 0,
                "destination is still locked for this transfer"
            );

            box[msg.sender][tokenId] -= amount; //reduce amount for REGULAR_USER, ambassador has unlimited supply.

            karma[msg.sender][tokenId] += userExists[to]
                ? KARMA_TRANSFER
                : KARMA_NEW_USER;

            processKarmaKicks(msg.sender, to, tokenId, amount);
        }
        box[to][tokenId] += amount;
        accountLocks[to][tokenId] = block.timestamp; // locks "to" account for incoming transactions with tokenId.
        storeNewAccount(to);
        //store log entry
        logs[msg.sender].push(LogEntry(tokenId, to, block.timestamp));
    }

    function approveCreator(
        address creator,
        string calldata ticker
    ) public gameMastersOnly {
        require(!tokenExists[ticker], "token exists already");
        approvedCreators[creator][ticker] = true;
    }

    //ToDo: prevent spam, implement approvals?
    function addToken(
        string calldata ticker,
        string calldata tokenName,
        string calldata iconUrl,
        uint8 initialRank
    ) public approvedCreatorsOnly(ticker) {
        require(!tokenExists[ticker], "token exists already");
        tokenExists[ticker] = true;
        tokenInfos.push(TokenInfo(ticker, tokenName, iconUrl, msg.sender));
        ambassadorRank[msg.sender][tokenInfos.length - 1] = initialRank > 0
            ? initialRank
            : DEFAULT_INITIAL_RANK;
    }

    function readToken() public view returns (TokenInfo[] memory ti) {
        ti = new TokenInfo[](tokenInfos.length);
        for (uint i = 0; i < ti.length; ++i) {
            ti[i] = tokenInfos[i];
        }
        return ti;
    }

    function getTimeToUnlock(
        address to,
        uint tokenId
    ) public view returns (uint timestampDiff) {
        uint timeDiff = block.timestamp - accountLocks[to][tokenId];
        return timeDiff > LOCKTIME ? 0 : timeDiff;
    }

    function storeNewAccount(address a) private {
        if (!userExists[a]) {
            accounts.push(a);
            userExists[a] = true;
        }
    }

    function balanceOf(
        address a,
        uint tokenId
    ) public view returns (uint amount) {
        return box[a][tokenId];
    }

    function processKarmaKicks(
        address from,
        address to,
        uint tokenId,
        uint amount
    ) private {
        if (ambassadorRank[from][tokenId] == 0) {
            // only REGULAR_USER will get kickbacks
            KarmaKick[] storage kicks = karmaKicks[to][tokenId].kicks;
            if (kicks.length <= 100) {
                //spam protection. prevents kicks array from growing indefinitely.
                kicks.push(KarmaKick(from, amount)); //karma kickback will be fired later, when "to" will spend tokens
            }
        }
        KarmaKicks storage kkFrom = karmaKicks[from][tokenId];
        for (uint a = amount; a > 0; ) {
            if (kkFrom.kicks.length == 0) {
                kkFrom.kicks.push(KarmaKick(address(0), 0)); // ToDo: check if it works right and don't break Karma Kicks workflow
            }
            KarmaKick storage kk = kkFrom.kicks[kkFrom.head];
            if (kk.addrTo == address(0)) break;
            uint p = min(a, kk.points);
            a -= p;
            kk.points -= p;
            karma[kk.addrTo][tokenId] += KARMA_KICKBACK;
            if (kk.points == 0) {
                kk.addrTo = address(0); //clean the storage slot
                if (++kkFrom.head >= kkFrom.kicks.length) {
                    kkFrom.head = 0;
                }
            }
        }
    }

    function max(uint256 a, uint256 b) private pure returns (uint256) {
        return a >= b ? a : b;
    }

    function min(uint256 a, uint256 b) private pure returns (uint256) {
        return a <= b ? a : b;
    }

    modifier ambassadorOnly(uint tokenId) {
        require(
            ambassadorRank[msg.sender][tokenId] != 0 ||
                msg.sender == tokenInfos[tokenId].creator, // creator is a "seed" ambassador, that works always.
            "only Project Ambassador is eligible to mint tokens"
        );
        _;
    }

    modifier gameMastersOnly() {
        uint n = 0;
        for (; n < gameMasters.length; ++n) {
            if (msg.sender == gameMasters[n]) break;
        }
        require(n < gameMasters.length, "only gameMaster can do it");
        _;
    }

    modifier approvedCreatorsOnly(string memory ticker) {
        require(
            approvedCreators[msg.sender][ticker],
            "only pre-approved creators can create token"
        );
        _;
    }
}
