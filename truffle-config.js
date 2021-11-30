require('dotenv').config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const path = require("path");

const INFURA_PROJECT_ID = 'https://rinkeby.infura.io/v3/216ff566890841a191668183133a69e1'

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "localhost",
      port: 8545,
      network_id: 1337,
    },
    development: {
      host: "localhost",
      port: 8545,
      network_id: 1337,
    },
    rinkeby:{
      provider: function() {
        return new HDWalletProvider(
          process.env['MNEMONIC'],
          process.env['INFURA_PROJECT_ID'],
          0 // Sign / Migrate from second account (it is zero-based)
        );
      },
      network_id: 4, // Rinkeby Network Id
    },
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
          runs: 200,
         },
      }
    }
  },

};
