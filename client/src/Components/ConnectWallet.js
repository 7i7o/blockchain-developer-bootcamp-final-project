import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Button, Typography, Row, Col, Space } from 'antd';

import Rx from "../contracts/Rx.json";

// const NETWORKS = {
//   1: "Ethereum Mainnet",
//   42: "Kovan Testnet",
//   3: "Ropsten Testnet",
//   4: "Rinkeby Testnet",
//   5: "Goerli Testnet",
// }

// const CONTRACT_ADDRESS = '0x668931aE15C2062BC5002306E1FeED42abdcEf8F' // on Rinkeby
const NETWORK_ID = 4; // Rinkeby

const ConnectWallet = (props) => {

    const [loggedIn, setLoggedIn] = useState(false)

    async function getWeb3Modal() {
      // let Torus = (await import('@toruslabs/torus-embed')).default
      const web3Modal = new Web3Modal({
        network: 'rinkeby',
        cacheProvider: false,
        providerOptions: {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              infuraId: '216ff566890841a191668183133a69e1'
            },
          },
        },
      })
      return web3Modal
    }

    async function connect() {
      const web3Modal = await getWeb3Modal()
      const modalConnection = await web3Modal.connect()
      const provider = new ethers.providers.Web3Provider(modalConnection)
      const accounts = await provider.listAccounts()
      props.setConnection(modalConnection)
      props.setAccount(accounts[0])
    }

    // This runs our function when the connection is updated (we have access to the network).
    useEffect(() => {
      if (props.connection && props.account) {
        signIn()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.connection, props.account])  
    
    async function signIn() {
      if (!props.connection) {
        console.log('No conection to the network')
      } else {
        const provider = new ethers.providers.Web3Provider(props.connection)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(
                                                Rx.networks[NETWORK_ID].address,
                                                Rx.abi,
                                                signer);
        props.setContract(connectedContract);
      }
    }

    // This runs our function when the contract is updated (we have a connection to Rx).
    useEffect(() => {
      if (props.connection && props.account && props.contract) {
        logIn()
      }
    }, [props.connection, props.account, props.contract])  

    async function logIn() {
        setLoggedIn(true);
    }  

    async function signOut() {
      setLoggedIn(false);  
      props.setContract(null);
    }

    return (<Row style={{ width: "100%", backgroundColor: "lightgrey", padding: 10 }}>
              <Col span={4} style={{ display: 'flex', justifyContent: 'left', alignItems: 'baseline', maxHeight: 30 }}>
                <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 120 120">
                  <g opacity="0.6">
                    <circle fill="darkblue" cx="8" cy="8" r="7.5"/>
                    <path fill="red" d="m22.4 14.6h4l-15,24h-4z"/>
                    <path fill="darkred" d="m7.4 14.6h4l15,24h-4z"/>
                    <path fill="blue" d="m0 2.6v24h15z"/>
                  </g>
                </svg>
              </Col>
              <Col span={20} style={{ display: 'flex', justifyContent: 'right' }}>
                { loggedIn && (
                  <div style={{ float: 'right' }}>
                    <Space direction="horizontal" align="center">
                      <Typography.Text italic>Welcome, {props.account}</Typography.Text>
                      <Button onClick={signOut} >Sign Out</Button>
                    </Space>
                  </div>
                )}
                { props.connection && !loggedIn && (
                  <Button onClick={signIn} style={{float: 'right'}}>Sign In</Button>
                  )}
                {!props.connection && (
                  <Button onClick={connect} style={{float: 'right'}}>Connect Wallet</Button>
                )}
            </Col>
          </Row>
    )
}

export default ConnectWallet