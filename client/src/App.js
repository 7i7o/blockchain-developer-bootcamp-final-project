import "./styles/App.css";
import React, { useState } from "react";
// import Rx from "./contracts/Rx.json";
// import Web3 from "web3";

import { Space, notification } from 'antd';


import ConnectWallet from './Components/ConnectWallet'
import Landing from './Components/Landing'

// const PASSIVE_METHOD = 'eth_accounts'
// const ACTIVE_METHOD = 'eth_requestAccounts'
// const { Header } = Layout;

const App = () => {


  // const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [connection, setConnection] = useState(null);
  const [contract, setContract] = useState(null);

  // const [message, setMessage] = useState("");
  // const [visible, setVisible] = useState(false);
  // const [errorMessage, setErrorMessage] = useState("");
  // const [visibleError, setVisibleError] = useState(false);
  // const [isAdmin, setIsAdmin] = useState(false);
  // const [userSubjectData, setUserSubjectData] = useState(null);
  // const [userDoctorData, setUserDoctorData] = useState(null);
  // const [userPharmacistData, setUserPharmacistData] = useState(null);

  const openNotificationWithIcon = (message, description = '', type = 'info', duration = 4.5) => {
    notification[type]({ message, description, type, duration });
  };

  // const handleClose = () => {
  //   setVisible(false);
  //   setMessage('');
  // };

  // const handleCloseError = () => {
  //   setVisibleError(false);
  //   setErrorMessage('');
  // };

  // const showMessage = message => {
  // //   setMessage(message);
  // //   setVisible(true);
  //   openNotificationWithIcon(message);
  // }

  // const showError = error => {
  // //   setErrorMessage(error);
  // //   setVisibleError(true);
  //   openNotificationWithIcon(error, '', 'error');
  // }



  if (window.ethereum) {
    window.ethereum.on('chainChanged', (networks) => {console.log(`Networks changed: ${networks}`); window.location.reload();});
    window.ethereum.on('accountsChanged', (accounts) => console.log(`Accounts changed: ${accounts}`)); //window.location.reload());
  }

  // This runs our function when the page loads.
  // useEffect(() => {
  //   getWeb3(PASSIVE_METHOD);
  // }, [])

  
  // Helper function that runs on page load
  // const getWeb3 = async method => {
  //   if (!window.ethereum) {
  //     console.log('No ETH browser extension detected.');
  //     return;
  //   } else {
  //     console.log('ETH browser extension detected!'); //, window.ethereum)
  //   }
  //   try {
  //     let accounts = await window.ethereum.request({ method });
  //     if (!accounts.length) {
  //       console.log('Found NO authorized accounts, we should render a Connect Wallet Button');
  //     } else {
  //       const authorizedAccount = accounts[0];
  //       console.log('Found authorized account: ', authorizedAccount);
  //       setAccount(authorizedAccount);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  
  // const connectWallet = async () => {
  //   try {
  //     await getWeb3(ACTIVE_METHOD); // This prompts the metamask window
  //   } catch (error) {
  //     showError('Failed to load web3, accounts, or contract. Check console for details.');
  //     console.error(error);
  //   }
  // }
  
  // This runs our function when the account is updated.
  // useEffect(() => {
  //   finishWeb3Setup()
  // }, [account])
  
  // const finishWeb3Setup = async () => {
  //   console.log('Saved authorized account: ', account);
  //   if (!account) {
  //     setConnection(null);
  //   } else {
  //     const web3Object = new Web3(window.ethereum);
  //     const networkId = await window.ethereum.request({ method: 'net_version' });
  //     const deployedNetwork = Rx.networks[networkId];
  //     if (deployedNetwork) {
  //       const instance = new web3Object.eth.Contract(Rx.abi, deployedNetwork.address);
  //       setConnection(instance);
  //     }
  //   }
  // }

  // This runs our function when the contract is updated (we have a connection).
  // useEffect(() => {
  //   getUserState()
  // }, [connection])
  
  // const getUserState = () => {
  //   if (connection) {
  //     checkIsAdmin();
  //     getUserSubjectData();
  //     getUserDoctorData();
  //     getUserPharmacistData();
  //   }
  // }

  // const checkIsAdmin = async () => {
  //   try {
  //     let result = await connection.methods.isAdmin(account).call({from: account});
  //     setIsAdmin(result);
  //     console.log(`Is Admin: ${result}`);
  //   } catch (error) {
  //     showError(`Admin role check failed. Check the console for more info.`);
  //     console.log(error);
  //   }
  // }

  // const getUserSubjectData = async () => {
  //   let result = null;

  //   try {
  //     result = await connection.methods.getSubject(account).call({from: account});
  //   } catch (error) { console.log(error); }

  //   if (result) {
  //       setUserSubjectData(result);
  //       console.log(`Subject Data: ${result}`);
  //   } else {
  //       setUserSubjectData(null);
  //       console.log("User is not a registered subject");
  //   }
  // }

  // const getUserDoctorData = async () => {
  //   let result = null;

  //   try {
  //     result = await connection.methods.getDoctor(account).call({from: account});
  //   } catch (error) { console.log(error); }

  //   if (result) {
  //       setUserDoctorData(result);
  //       console.log(`Doctor Data: ${result}`);
  //   } else {
  //       setUserDoctorData(null);
  //       console.log("User is not a registered doctor");
  //   }
  // }

  // const getUserPharmacistData = async () => {
  //   let result = null;

  //   try {
  //     result = await connection.methods.getPharmacist(account).call({from: account});
  //   } catch (error) { console.log(error); }
    
  //   if (result) {
  //       setUserPharmacistData(result);
  //       console.log(`Pharmacist Data: ${result}`);
  //   } else {
  //       setUserPharmacistData(null);
  //       console.log("User is not a registered pharmacist");
  //   }
  // }

  // const renderConnectButton = () => (
  //   // <Layout>
  //   //   <Header>
  //           <Button onClick={connectWallet}>
  //             Connect to Wallet
  //           </Button>
  //   //   </Header>
  //   // </Layout>
  // );

  // const props = { openNotificationWithIcon, account, connection, contract };

  // const renderLanding = () => (
  //   <Landing parentProps={props} />
  // )

  return (
    <div className="App" >
      {(<Space direction="vertical" style={{ width: "100%" }}>
          <ConnectWallet 
            account={account} setAccount={setAccount}
            connection={connection} setConnection={setConnection}
            contract={contract} setContract={setContract}
            openNotificationWithIcon={openNotificationWithIcon}
          />
          <Landing 
            account={account}
            contract={contract}
            openNotificationWithIcon={openNotificationWithIcon}
          />
        </Space>
        )
      }
    </div>
  );
}

export default App;
