
/// ********** ********** ********** **********
/// App Constants

// export const OWNER_ACCOUNT = '0xe4eDF2ed3C7f1f089ED51cf799b8ffAd034a2766'
// export const OWNER_ACCOUNT = '0x2B0a9192dD6305974D9Ed4a77dE917Be4202845D'
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const INFURA_ID = '216ff566890841a191668183133a69e1'

const NETWORKS = {
    rinkeby: {
        ID: 4,
        NAME: 'rinkeby',
        DESC: 'Rinkeby Testnet',
        PARAMS: {},
    },
    development: {
        ID: 1337,
        NAME: 'development',
        DESC: 'Development (Ganache)',
        PARAMS: {
            host: "https://localhost:8545", // optional
            chainId: 1337, // optional
            networkId: 1337 // optional
          },
    },
}

// export const NETWORK = NETWORKS.development;
export const NETWORK = NETWORKS.rinkeby;



/// ********** ********** ********** **********
/// Input Validation Checks
// export const MAX_KEY_LENGTH = 19
// export const MAX_VALUE_LENGTH = 61
export const MAX_KEY_LENGTH = 31
export const MAX_VALUE_LENGTH = 62

/// ********** ********** ********** **********
/// UI Settings
export const DRAWER_WIDTH = '';     // Drawer optional width
export const BUTTON_SIZE = "200px"; // Main Menu buttons, same width
// export const BUTTON_SIZE = "2";  // Main Menu buttons, different widths


/// ********** ********** ********** **********
/// Extra Info
//   1: "Ethereum Mainnet",
//   42: "Kovan Testnet",
//   3: "Ropsten Testnet",
//   4: "Rinkeby Testnet",
//   5: "Goerli Testnet",
// const CONTRACT_ADDRESS = '0x668931aE15C2062BC5002306E1FeED42abdcEf8F' // v1 on Rinkeby
// const CONTRACT_ADDRESS = '0x995c9446cEC8b39b16b10C8cbD4f99C7BD0c488C' // v2 on Rinkeby
// const CONTRACT_ADDRESS = '0x9C93012205267eaa97b352ab1add200C0DEF5282' // v3 on Rinkeby
// const CONTRACT_ADDRESS = '0x33ea420C549a71079C7e16A541aB788f9297B681' // v4 on Rinkeby
// const CONTRACT_ADDRESS = '0xC1B0e5f6771fC4327E8643579EC14C4Ce4C8CDd9' // v5 on Rinkeby
