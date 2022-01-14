require('dotenv').config();
const HDWalletProvider = require("@truffle/hdwallet-provider");
const path = require("path");

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
        return new HDWalletProvider({
          privateKeys: [ process.env['PRIVATE_KEY'], ],
          providerOrUrl: process.env['INFURA_PROJECT_ID'],
          addressIndex: 0 // Deploy/Migrate from first account (it is zero-based)
        });
      },
      network_id: 4, // Rinkeby Network Id
    },
  },
  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.9",
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          // enabled: false,
          //  runs: 200
          enabled: true,
          runs: 75,
         },
      }
    }
  },
  plugins: ["truffle-contract-size", "truffle-plugin-verify"],
  api_keys: {
    etherscan: process.env['ETHERSCAN_API_KEY']
  }
};
