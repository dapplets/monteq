/**
 * EdCon MonteQ game . 
 * just for start. 
 *
 * ver 0.1
**/
contract EdconGame {

    uint constant LOCKTIME = 1 hours; 

    struct Balance {
        uint8 tokenId;
        uint120 amount;
    }

    struct Performance {
        uint8 tokenId;
        uint56 amount;
    }

    struct TokenInfo {
        string ticker;
        string tokenName;
        bytes32 ipfsIconURI;
    }

    struct LogEntry {
        uint8 tokenId;
        address to;
        uint256 datetime;
    }

    mapping(address=>Balance[]) public box; // who owns what
    mapping(address=>Performance[]) public performance; // user's giveaway performance
    mapping(bytes32=>uint) public fromToTimestamps; // mapping(hash(addrTo,addrTo)=>lastDatetime)   - stores the last transaction time for the pair (from,to)
    mapping(address=>LogEntry[]) public logs; // transfer log.
    
    TokenInfo[] public tokenInfos;
    address[] users;

    //ToDo: prevent spam, implement approvals? 
    function mint(Balance calldata p, address to) public {
        add(p,to);
    }

    function transfer(Balance calldata p, address to) public {
        require(getTimeToUnlock(to) == 0,"destination is locked for this transfer");
        log(p, msg.sender);
        sub(p,msg.sender);
        add(p,to);
    }

    //ToDo: prevent spam, implement approvals? 
    function addToken(string calldata ticker, string calldata tokenName, bytes32 ipfsIconURI) public {
       tokenInfos.push(TokenInfo(ticker, tokenName,  ipfsIconURI));
    }

    function readToken() public view returns (TokenInfo[] memory ti) {
        ti = new TokenInfo[](tokenInfos.length);
        for(uint i=0;i<ti.length;++i){
            ti[i]=tokenInfos[i];
        }
        return ti;
    }

    function add(Balance memory p, address to) private {
        Balance[] storage toPos = box[to];
         for(uint n=0;n<toPos.length;++n) {
            if (toPos[n].tokenId == p.tokenId) {
                toPos[n].amount += p.amount;
                return;
            }
            toPos.push(p);
        }
    }

    function sub(Balance memory p, address to) private {
        Balance[] storage toPos = box[to];
         for(uint n=0;n<toPos.length;++n) {
            if (toPos[n].tokenId == p.tokenId) {
                require(toPos[n].amount >= p.amount, "unsufficient funds"); //ToDo: add address and token ticker for better message
                if (toPos[n].amount > p.amount) {
                    toPos[n].amount -= p.amount;
                    return;
                } else {
                    toPos[n] = toPos[toPos.length-1]; // for the length==1 effectively does nothing (copies [0]=>[0])
                    toPos.pop();
                }
            }
        }
    }

    function getTimeToUnlock(address to) public view returns (uint timestampDiff){
        bytes32 key = getFromToKey(to, msg.sender);  // calculate key for REVERSE direction
        uint timeDiff = block.timestamp - fromToTimestamps[key];
        return timeDiff > LOCKTIME ? 0 : timeDiff;
    }

    function getFromToKey(address from, address to) private pure returns(bytes32) {
        return sha256(abi.encodePacked(from,to));
    }
 
    function log(Balance memory p, address to) private {

        //store performance data
        Performance[] storage toPerf = performance[to];
         for(uint n=0;n<toPerf.length;++n) {
            if (toPerf[n].tokenId == p.tokenId) {
                toPerf[n].amount += 1;
                return;
            }
            toPerf.push(Performance(p.tokenId,1));
        }
        
        //save timestamp for transfer from->to address.
        bytes32 fromToKey = getFromToKey(msg.sender, to);
        fromToTimestamps[fromToKey] = block.timestamp;

        //store log entry
        logs[msg.sender].push(LogEntry(p.tokenId,to,block.timestamp));
    }

}
