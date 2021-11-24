import "./styles/App.css";
import React, { useEffect, useState } from "react";
import Rx from "./contracts/Rx.json";
import Web3 from "web3";

import { Alert, Button, Layout } from 'antd';


// import NewSubjectDrawer from './Components/NewSubjectDrawer'
// import NewDoctorDrawer from './Components/NewDoctorDrawer'
// import NewPharmacistDrawer from './Components/NewPharmacistDrawer'
import Landing from './Components/Landing'

const PASSIVE_METHOD = 'eth_accounts'
const ACTIVE_METHOD = 'eth_requestAccounts'
const { Header } = Layout;

const App = () => {


  // const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState("");
  const [message, setMessage] = useState("");
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [visibleError, setVisibleError] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userSubjectData, setUserSubjectData] = useState(null);
  const [userDoctorData, setUserDoctorData] = useState(null);
  const [userPharmacistData, setUserPharmacistData] = useState(null);


  const handleClose = () => {
    setVisible(false);
    setMessage('');
  };

  const handleCloseError = () => {
    setVisibleError(false);
    setErrorMessage('');
  };

  const showMessage = message => {
    setMessage(message);
    setVisible(true);
  }

  const showError = error => {
    setErrorMessage(error);
    setVisibleError(true);
  }

  // This runs our function when the page loads.
  useEffect(() => {
    getWeb3(PASSIVE_METHOD);
  }, [])

  if (window.ethereum) {
    window.ethereum.on('chainChanged', () => window.location.reload());
    window.ethereum.on('accountsChanged', () => window.location.reload());
  }
  
  // Helper function that runs on page load
  const getWeb3 = async method => {
    if (!window.ethereum) {
      console.log('No ETH browser extension detected.');
      return;
    } else {
      console.log('ETH browser extension detected!'); //, window.ethereum)
    }
    try {
      let accounts = await window.ethereum.request({ method });
      if (!accounts.length) {
        console.log('Found NO authorized accounts, we should render a Connect Wallet Button');
      } else {
        const authorizedAccount = accounts[0];
        console.log('Found authorized account: ', authorizedAccount);
        setAccount(authorizedAccount);
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const connectWallet = async () => {
    try {
      await getWeb3(ACTIVE_METHOD); // This prompts the metamask window
    } catch (error) {
      showError('Failed to load web3, accounts, or contract. Check console for details.');
      console.error(error);
    }
  }
  
  // This runs our function when the account is updated.
  useEffect(() => {
    finishWeb3Setup()
  }, [account])
  
  const finishWeb3Setup = async () => {
    console.log('Saved authorized account: ', account);
    if (!account) {
      setContract(null);
    } else {
      const web3Object = new Web3(window.ethereum);
      const networkId = await window.ethereum.request({ method: 'net_version' });
      const deployedNetwork = Rx.networks[networkId];
      if (deployedNetwork) {
        const instance = new web3Object.eth.Contract(Rx.abi, deployedNetwork.address);
        setContract(instance);
      }
    }
  }

  // This runs our function when the contract is updated (we have a connection).
  useEffect(() => {
    getUserState()
  }, [contract])
  
  const getUserState = () => {
    if (contract) {
      checkIsAdmin();
      getUserSubjectData();
      getUserDoctorData();
      getUserPharmacistData();
    }
  }

  const checkIsAdmin = async () => {
    // console.log(`Trying to call contract with account: "${account}"`);
    let result = false;
    try {
      result = await contract.methods.isAdmin(account).call({from: account});
    } catch (error) {
      console.log(error);
    }
    if (result) {
        setIsAdmin(true);
        console.log("isAdmin");
    } else {
        setIsAdmin(false);
        console.log("isNotAdmin");
    }
  }

  const getUserSubjectData = async () => {
    // console.log(`Trying to call contract with account: "${account}"`);
    let result = null;
    try {
      result = await contract.methods.getSubject(account).call({from: account});
    } catch (error) {
      console.log(error);
    }
    if (result) {
        setUserSubjectData(result);
        console.log(`Subject Data: ${result}`);
    } else {
        setUserSubjectData(null);
        console.log("isNotSubject");
    }
  }

  const getUserDoctorData = async () => {
    // console.log(`Trying to call contract with account: "${account}"`);
    let result = null;
    try {
      result = await contract.methods.getDoctor(account).call({from: account});
    } catch (error) {
      console.log(error);
    }
    if (result) {
        setUserDoctorData(result);
        console.log(`Doctor Data: ${result}`);
    } else {
        setUserDoctorData(null);
        console.log("isNotDoctor");
    }
  }

  const getUserPharmacistData = async () => {
    // console.log(`Trying to call contract with account: "${account}"`);
    let result = null;
    try {
      result = await contract.methods.getPharmacist(account).call({from: account});
    } catch (error) {
      console.log(error);
    }
    if (result) {
        setUserPharmacistData(result);
        console.log(`Pharmacist Data: ${result}`);
    } else {
        setUserPharmacistData(null);
        console.log("isNotPharmacist");
    }
  }

  const renderConnectButton = () => (
    <Layout>
      {/* <Header>Header</Header> */}
      <Header>
            <Button onClick={connectWallet}>
              Connect to Wallet
            </Button>
      </Header>
      {/* <Footer>Footer</Footer> */}
    </Layout>
  );

  const props = { showMessage, showError, account, contract, isAdmin, userSubjectData, userDoctorData, userPharmacistData };

  const renderLanding = () => (
    <Landing parentProps={props} />
  )

  return (
    <div className="App">
      {visible ? (
        <Alert message={message} type="info" closable afterClose={handleClose} />
      ) : ""}
      {visibleError ? (
        <Alert message={errorMessage} type="error" closable afterClose={handleCloseError} />
      ) : ""}
      {/* <Alert message="Success Text" type="success" /> */}
      {/* <Alert message={message} type="info" closable /> */}
      {/* <Alert message="Warning Text" type="warning" /> */}
      {/* <Alert message={errorMessage} type="error" closable /> */}
      {/* <h2>Smart Contract Example</h2> */}
      {/* { !web3 ? 
        setMessage("Loading Web3 Extension...")
      : setMessage("")
      && ( */}
      {(!account?
          renderConnectButton()
          : renderLanding()
        )
      }
    </div>
  );
}

export default App;
