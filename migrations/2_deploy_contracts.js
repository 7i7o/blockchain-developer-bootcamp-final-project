var DateTime = artifacts.require("./libraries/DateTime.sol");
var RxStructs = artifacts.require("./libraries/RxStructs.sol");
var NFTSVG = artifacts.require("./libraries/NFTSVG.sol");
var Rx = artifacts.require("./Rx.sol");
var TokenURIDescriptor = artifacts.require("./libraries/TokenURIDescriptor.sol");

module.exports = function(deployer) {
  
  deployer.deploy(DateTime);
  deployer.link(DateTime, [NFTSVG, TokenURIDescriptor]);

  deployer.deploy(RxStructs);
  deployer.link(DateTime, [NFTSVG, TokenURIDescriptor, Rx]);
  
  deployer.deploy(NFTSVG);
  deployer.link(NFTSVG, TokenURIDescriptor);
  
  deployer.deploy(TokenURIDescriptor);
  deployer.link(TokenURIDescriptor, Rx);
  
  deployer.deploy(Rx);
};
