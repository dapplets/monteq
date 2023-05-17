/**
 * EdCon MonteQ game . 
 * just for start. 
 *
 * ver 0.2
**/
contract EdconGame {

    uint constant LOCKTIME = 1 hours; 

    uint constant USER_NOT_EXIST = 0;
    uint constant REGULAR_USER = 1;

    struct TokenInfo {
        string ticker;
        string tokenName;
        bytes32 ipfsIconURI;
        address creator;
    }

    struct LogEntry {
        uint8 tokenId;
        address to;
        uint256 datetime;
    }

    mapping(address=>mapping(uint=>uint)) public box; // who owns what
    mapping(address=>mapping(uint=>uint)) public performance; // user's giveaway performance
    mapping(address=>uint) public accountType; 
    mapping(bytes32=>uint) public fromToTimestamps; // mapping(hash(addrTo,addrTo)=>lastDatetime)   - stores the last transaction time for the pair (from,to)
    mapping(address=>LogEntry[]) public logs; // transfer log.
    
    TokenInfo[] public tokenInfos;
    address[] accounts;

    function mint(uint8 tokenId, uint120 amount, address to) 
    public 
    ambassadorOnly(tokenId) {
        box[to][tokenId] += amount;
        storeAccount(to,tokenId + 2);    // 0 - NOT_EXIST, 1 - REGULAR_USER, 2+ - AMBASSADOR for tokenId (starts from '0')
    }

    function transfer(uint8 tokenId, uint120 amount, address to) public {
        assertUnlocked(to, tokenId);
        box[msg.sender][tokenId] -= amount;
        box[to][tokenId] += amount;
        storeAccount(to,REGULAR_USER); // 0 - NOT_EXIST, 1 - REGULAR_USER, 2+ - AMBASSADOR for tokenId (starts from '0')
        log(tokenId, msg.sender);
    }
    
    function transferBatch(uint8[] calldata tokenIds, uint120[] calldata amounts, address to) public {
        require(tokenIds.length == amounts.length, "Length mismatch");
        for(uint n=0;n<tokenIds.length;++n) {
            transfer(tokenIds[n], amounts[n], to);
        }
    }

    function giveAway(uint8 tokenId, uint120 amount, address to) public {
        require(accountType[msg.sender]==tokenId+2); //2 is a type index offset.
        box[msg.sender][tokenId] -= amount;
        box[to][tokenId] += amount;
        storeAccount(to,REGULAR_USER); // 0 - NOT_EXIST, 1 - REGULAR_USER, 2+ - AMBASSADOR for tokenId (starts from '0')
        log(tokenId, msg.sender);
    }

    function assertUnlocked(address to, uint tokenId) private {
        require(getTimeToUnlock(to, tokenId) == 0,"destination is still locked for this transfer");
        //save timestamp for transfer to lock token transfers for  1hrs.
        fromToTimestamps[ txKey(to, tokenId) ] = block.timestamp;  // locks "to" account for incoming transactions with tokenId.
    }

    //ToDo: prevent spam, implement approvals? 
    function addToken(string calldata ticker, string calldata tokenName, bytes32 ipfsIconURI) public {
       tokenInfos.push(TokenInfo(ticker, tokenName,  ipfsIconURI, msg.sender));
    }

    function readToken() public view returns (TokenInfo[] memory ti) {
        ti = new TokenInfo[](tokenInfos.length);
        for(uint i=0;i<ti.length;++i){
            ti[i]=tokenInfos[i];
        }
        return ti;
    }

    function getTimeToUnlock(address to, uint tokenId) public view returns (uint timestampDiff){
        bytes32 key = txKey(to, tokenId);  // calculate key 
        uint timeDiff = block.timestamp - fromToTimestamps[key];
        return timeDiff > LOCKTIME ? 0 : timeDiff;
    }

    function txKey(address to, uint tokenId) private pure returns(bytes32) {
        return sha256(abi.encodePacked(to, tokenId));  // calculate key 
    }
 
    function log(uint8 tokenId, address to) private {
        //store performance data
        performance[msg.sender][tokenId]+=1;
        
        //store log entry
        logs[msg.sender].push(LogEntry(tokenId,to,block.timestamp));
    }

    function storeAccount(address a, uint typ) private {
        if (accountType[a]==USER_NOT_EXIST) {
            accountType[a] = typ;
            accounts.push(a); 
        }
    }

    modifier ambassadorOnly(uint tokenId) {
        require(   accountType[msg.sender]==tokenId+2
                || msg.sender == tokenInfos[tokenId].creator   // creator is a "seed" ambassador, that works always.
                ,  "only Project Ambassador is eligible to mint tokens" );
        _;
    }
}
