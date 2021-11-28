import "./styles/App.css";
import React, { useState } from "react";
import { Space, notification } from 'antd';

import ConnectWallet from './Components/ConnectWallet'
import Landing from './Components/Landing'

const App = () => {

  const [account, setAccount] = useState("");
  const [connection, setConnection] = useState(null);
  const [contract, setContract] = useState(null);
  const [rightNetwork, setRightNetwork] = useState(false);

  const openNotificationWithIcon = (message, description = '', type = 'info', duration = 4.5) => {
    notification[type]({ message, description, type, duration });
  };

  return (
    <div className="App" >
      <Space direction="vertical" style={{ width: "100%" }}>
        {(
          <ConnectWallet 
            account={account} setAccount={setAccount}
            connection={connection} setConnection={setConnection}
            contract={contract} setContract={setContract}
            openNotificationWithIcon={openNotificationWithIcon}
            rightNetwork={rightNetwork} setRightNetwork={setRightNetwork}
          />
        )}
        { rightNetwork && contract && (
          <Landing 
            account={account}
            contract={contract}
            openNotificationWithIcon={openNotificationWithIcon}
            rightNetwork={rightNetwork}
          />
        )}
      </Space>
    </div>
  );
}

export default App;
