import "./styles/App.css";
import React, { useState } from "react";
import { Space, notification } from 'antd';

import ConnectWallet from './Components/ConnectWallet'
import Landing from './Components/Landing'

const App = () => {

  const [account, setAccount] = useState("");
  const [connection, setConnection] = useState(null);
  const [contract, setContract] = useState(null);

  const openNotificationWithIcon = (message, description = '', type = 'info', duration = 4.5) => {
    notification[type]({ message, description, type, duration });
  };

  if (window.ethereum) {
    window.ethereum.on('chainChanged', (networks) => {console.log(`Networks changed: ${networks}`); window.location.reload();});
    window.ethereum.on('accountsChanged', (accounts) => console.log(`Accounts changed: ${accounts}`)); //window.location.reload());
  }

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
