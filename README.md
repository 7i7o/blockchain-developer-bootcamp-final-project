# Final project - On-Chain NFT Prescriptions
## Deployed front-end url

[https://rx-nft.vercel.app](https://rx-nft.vercel.app)

The original intent of the app relays on an *admin role* for adding Doctors, Pharmacists and Patients.

For the presentation of this final project only, i have added a pausable pattern on the admin role, so the deployer account is the only one allowed to pause/unpause this role.

When the admin role is paused, any user (that is **not** a registered patient) can grant admin privileges.

**The first action** should be to grant admin privileges to an account, and then start using the app, adding patients, doctors and pharmacists, to mint some prescriptions.


## Screencast link
[https://www.loom.com/share/91046539e95c459abd2d280bbc1eb480](https://www.loom.com/share/91046539e95c459abd2d280bbc1eb480)


## Inspiration/Idea
By taking advantage of blockchain infrastructure and capabilities, we leverage the transaction and minting capabilities of the network to be able to create unique **prescriptions** that have a sole point of origin (the doctor registered account) and a unique destination (the patient registered account).

These properties allows us to have a transparent and un-forgeable (given account's private keys of the users are properly secured) circuit for the *Medical Prescription* process.

The addition of Pharmacists into the system leaves us room to expand and complete the life cycle of a prescription, by giving the *Pharmacist* the role of burner (marking the Rx 'used' or 'exchanged'). (Implemented in the contract, TODO in the UI)

[This](./README.Final.Project.Idea.md) is the original idea for the project.

## Directory structure

- `client`: React UI for the Project
- `contracts`: Smart contracts (deployed to Rinkeby testnet)
- `migrations`: Javascript Migration files to deploy contracts
- `contracts`: Solidity contracts to be deployed
- `test`: Javascript tests for the contracts

## Dependencies
The project is based in Solidity and Javascript (actually using the React framework), and decided to use [Truffle](https://trufflesuite.com/) for Solidity development and migration, while using [ethers.js](https://github.com/ethers-io/ethers.js/) for the web3 connection on the UI.

[Ganache](https://github.com/trufflesuite/ganache-cli-archive) was used also for the testing and development environment.

For the development, the following frameworks/libraries were used

### Solidity:
- [Truffle](https://trufflesuite.com/)
- [OpenZeppelin](https://openzeppelin.com/)
- [base64-sol](https://github.com/Brechtpd/base64)
- [@truffle/hdwallet-provider](https://www.npmjs.com/package/@truffle/hdwallet-provider)

### Javacript/React
- [Create React App](https://create-react-app.dev/)
- [Ant Design](https://ant.design/)
- [ethers.js](https://github.com/ethers-io/ethers.js/)
- [walletconnect/web3-provider](https://www.npmjs.com/package/@walletconnect/web3-provider)
- [web3modal](https://github.com/Web3Modal/web3modal)
- [Moment.js](https://www.npmjs.com/package/moment)
- [svg-inline-react](https://www.npmjs.com/package/svg-inline-react)

## Public Ethereum Address for certification

`0xCa0F403D2A602e4D8c0A6A984b973D7958FBF463`

## Install and explore the App in our local environment

### Install **Rx** smart contract on our local environment

We need to have **[truffle](https://trufflesuite.com/)** and **[ganache-cli](https://github.com/trufflesuite/ganache-cli-archive)** installed on the system. We can use our favorite package manager for this (we are using [npm](https://nodejs.org/en/download/package-manager/) in this example).


```bash
# Clone Rx Repo on local environment
git clone https://github.com/7i7o/blockchain-developer-bootcamp-final-project.git

# cd into the cloned Repo
cd blockchain-developer-bootcamp-final-project

# Install Solidity dependencies
npm install --save
```

Now we should run our local testnet in port `8545` with **Ganache** or the flavour that suit us.
We should check that the instance we run has chainId `1337`, or else we have to change the chainId in the `tuffle-config.js` file within the "development" network section.

```bash
# Upon start, ganache will show us 10 accounts it generated for us
# Copy and paste the info (accounts and private keys) somewhere, for we'll need them later

# Migrate Smart Contracts into the local running Blockchain
truffle migrate --network development
#   (3 warnings should appear, but they are needed since the contract overrides an inherited function) 

# Test our migrated smart contracts
#   (there are 37 tests, all defined in: 'test/rx.js')
truffle test

# By the end of these tests, we can see the cost of minting 2 Rx, and 3 generated TokenURIs for Rxs.
# These tokenURIs (from 'data:application/json;base64,...' until the end, without quotes) can be
#   pasted in any modern browser to be decoded into a json file, where we can see properties of
#   the NFT, and also an "image" tag with a value encoded in base64. We can also copy and
#   paste it (from "data:image... " without quotes) to the browser to decode the NFT Image
#   generated and embedded in the NFT.
```

Once we've reached this point, given no problem arised, we can go on and deploy our contracts to a testnet.

### Install **Rx** UI on our local environment

By now, we can go on to host the front-end for our smart contracts in our local environment.

Before we spin up our local web server with the UI, we need to edit the configuration of our UI to point to our local development blockchain (instead of Rinkeby).

We have to edit `client/src/Comonents/utils/constants.js` accordingly:

```javascript
// Select these for Rinkeby
//export const NETWORK_ID = 4;
//export const NETWORK_DESC = 'Rinkeby';

// Uncomment these for Local Truffle/Ganache Development
export const NETWORK_ID = 1337;
export const NETWORK_DESC = 'Development (Ganache)';
```

That way, we tell our app to point its transactions to `localhost`.

Next, we can install dependencies and get our webserver running:

```bash
# cd into UI folder
cd client

# Install React App Dependencies
npm install --save

# Run your UI locally
yarn start
```

If everything went ok, we should be directed to [http://127.0.0.1:3000/](http://127.0.0.1:3000/) in our default browser.

The last step to use our newly spinned up instance of the Rx App is to import the main account (or as many as we need) into MetaMask from our *ganache* instance.

Now, we'll import the account (0) from its private key into Metamask. That's the account that performed the migrations, so it'll be granted the admin role for the App.

Remember to change the network of MetaMask to `127.0.0.1:8545`and chainId `1337`.

Once we got our admin account into Metamask, we can use the Connect Wallet button in the App to start using it.


## Install and explore the App in a testnet

### Deploying Smart Contracts to Rinkeby

Should we require to deploy the app to a testnet, we can follow this instructions.

First off, we need to store sensitive data somewhere that is not public. In our `truffle-config.js` we require a config file for the `dotenv` package we installed in our dependencies. The goal of this package is to set up environment variables while running our build and deploy, without the need to store sensitive data in our project config files.

`.gitignore` marks our config file `.env` to be ignored in any commit to our git server.

We have to create a `.env` file in our root folder with the following:

```bash
INFURA_PROJECT_ID='REPLACE-THIS'
MNEMONIC='REPLACE-THIS'
```

For this final project presentation, `truffle-config.js` includes my own INFURA Project Id. Only follow my instructions for the MNEMONIC.

We are using an [Infura](https://infura.io/) project for our App, but we could use any service with the same capabilities. In our Infura Dashboard we can open the settings of our created `Ethereum` project, and select **Rinkeby** from the ENDPOINTS dropdown.

We can copy our `https://rinkeby.infura...` and paste that into our `.env`.

Next, we need to copy our MNEMONICs from Metamask.

**Please**, open a fresh MetaMask to try out stuff, don't ever use your main accounts for development. Although the `.env` method doesn't upload our data to the internet for the whole world to see, we are still storing this info in our hard drive, read by our OS, which could be prone to malicious software. We can never be too carefull with our money.

Ok, now that we have went trough our disclaimer, we can copy our MNEMONIC from our Freshly Created Metamask Wallet into our second line of our `.env`.

Next off, we need to populate our Fresh Metamask main account with some *Rinkeby ETH* (fake internet money, since Rinkeby is a testnet).

We can go to any [Rinkeby Faucet](https://faucet.rinkeby.io/) and ask for Ether.

If we cannot find any working faucet, hit me up on [Twitter](https://www.twitter.com/7i7o) to see if i have any left.

With our main account fully stocked, we can now replicate our local deployment, but on an actual working public, albeit testnet, blockchain!

To do so, we should `cd` to the root folder of our project again and run:

```bash
# Remember to cd into the ROOT folder of the project!
truffle migrate --network rinkeby --reset --compile-all
```

With `--network rinkeby` we are telling truffle to point its migration to Rinkeby.

When our deployment finishes, we can now point our UI to the newly migrated contracts, by editing again our `client/src/Components/utils/constants.js`, uncommenting the **Rinkeby** lines and commenting out the Local Development ones.

```javascript
// Select these for Rinkeby
export const NETWORK_ID = 4;
export const NETWORK_DESC = 'Rinkeby';

// Uncomment these for Local Truffle/Ganache Development
// export const NETWORK_ID = 1337;
// export const NETWORK_DESC = 'Development (Ganache)';
```

That's it! We now have a working App pointing to a real public blockchain!

### Hosting our UI in a front end server

Should we need to host our frontend, mine is hosted in [Vercel](vercel.app), but there are many out there who can accomplish the task.

In my case, [Vercel](vercel.app) lets us import any of our github repos, and create a project from it.

By doing so, we can point our root directory to our `client` project folder (that's where our `Create React App` was run), choose "Create React App" from the Framework Preset dropdown, and that's it.

This service will build and host our project from there.