// var SimpleStorage = artifacts.require("./SimpleStorage.sol");
// var DateTime = artifacts.require("./libraries/DateTime.sol");
var Rx = artifacts.require("./Rx.sol");

module.exports = function(deployer) {
  // deployer.deploy(SimpleStorage);
  // deployer.deploy(DateTime);
  deployer.deploy(Rx);
};
