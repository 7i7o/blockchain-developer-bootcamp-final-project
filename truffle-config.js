const path = require("path");

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "localhost",
      port: 8545,
      network_id: "*",
    },
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
    }
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.4",
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          // enabled: false,
          //  runs: 200
          enabled: true,
          runs: 2,
         },
      }
    }
  },

};
