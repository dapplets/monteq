/**
 * naive and simple implementation supporting ether only. 
 * just for start. 
 *
**/
contract MonteQ {

    struct BusinessInfo{
        address payable owner;
        string name;
    }

    mapping(string=>BusinessInfo) BUs; // mapping(BusinessId=>Business)
    mapping(string=>uint) credits;     // mapping(BusinessId=>BusinessCredit)

    function payTips(string calldata businessId, uint amountReceipt, uint amountTips) public {
        //ToDo: implement token payments
        address payable owner = BUs[businessId].owner;
        if (owner==address(0)){ 
            credits[businessId]+=amountReceipt + amountTips;
        } else {
            owner.transfer(amountReceipt + amountTips);
        }
    }

    function attachOwner(string calldata businessId, address payable owner,string calldata name) public {
      require(BUs[businessId].owner==address(0));
      BUs[businessId]= BusinessInfo(owner, name);
      if (credits[businessId]>0) {
          owner.transfer(credits[businessId]);
      }
    }

    function removeOwner(string calldata businessId) public {
      delete BUs[businessId];
    }

    function getOwner(string calldata businessId) public view returns (address) {
      return(BUs[businessId].owner);
    }

}
