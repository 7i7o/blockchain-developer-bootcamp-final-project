// var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var Rx = artifacts.require("./Rx.sol");
var DateTime = artifacts.require("./libraries/DateTime.sol");

module.exports = function(deployer) {
  // deployer.deploy(SimpleStorage);
  deployer.deploy(DateTime);
  deployer.link(DateTime, Rx);
  deployer.deploy(Rx);
};
