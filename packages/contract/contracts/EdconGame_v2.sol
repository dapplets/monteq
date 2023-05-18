// SPDX-License-Identifier: GPL-3.0
/**
 * EdCon MonteQ game .
 * just for start.
 *
 * ver 0.2
 **/
contract EdconGame {
    uint constant LOCKTIME = 1 hours;

    uint constant KARMA_TRANSFER = 10;
    uint constant KARMA_KICKBACK = 1;
    uint constant KARMA_NEW_USER = 50;

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

    mapping(address => mapping(uint => uint)) public box; // who owns what
    mapping(address => mapping(uint => uint)) public karma; // user's giveaway karma
    mapping(address => mapping(uint => uint)) public accountLocks; // mapping(hash(addrTo,addrTo)=>lastDatetime)   - stores the last transaction time for the pair (from,to)
    //mapping(address=>mapping(uint=>uint)) public karmaKicks; // user's giveaway karma kickbacks
    mapping(address => mapping(uint => uint8)) public ambassadorRank; // if 0 - regular user
    mapping(address => LogEntry[]) public logs; // transfer log.

    TokenInfo[] public tokenInfos;
    mapping(address => bool) public userExists;
    address[] accounts;

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

            box[msg.sender][tokenId] -= amount; //reduce amount for regular sender, but ambassador has unlimited supply.
            //save timestamp for transfer to lock token transfers for 1hrs.
            accountLocks[to][tokenId] = block.timestamp; // locks "to" account for incoming transactions with tokenId.
            karma[msg.sender][tokenId] += userExists[to]
                ? KARMA_TRANSFER
                : KARMA_NEW_USER;
        }
        box[to][tokenId] += amount;
        storeNewAccount(to);
        //store log entry
        logs[msg.sender].push(LogEntry(tokenId, to, block.timestamp));
    }

    //ToDo: prevent spam, implement approvals?
    function addToken(
        string calldata ticker,
        string calldata tokenName,
        string calldata iconUrl
    ) public {
        tokenInfos.push(TokenInfo(ticker, tokenName, iconUrl, msg.sender));
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

    modifier ambassadorOnly(uint tokenId) {
        require(
            ambassadorRank[msg.sender][tokenId] != 0 ||
                msg.sender == tokenInfos[tokenId].creator, // creator is a "seed" ambassador, that works always.
            "only Project Ambassador is eligible to mint tokens"
        );
        _;
    }
}