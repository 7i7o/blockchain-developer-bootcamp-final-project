import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { Button, Typography, Row, Col, Space, Tooltip } from 'antd';
import { NETWORK, INFURA_ID } from './utils/constants';

import Rx from "../contracts/Rx.json";
import { shortenAddress } from './utils/stringSanitizer';

const ConnectWallet = (props) => {

  const [loggedIn, setLoggedIn] = useState(false)

    if (window.ethereum) {
      window.ethereum.on('chainChanged', (networks) => {
        window.location.reload()
      });
      window.ethereum.on('accountsChanged', (accounts) => {
        // console.log("Accounts changed:",accounts, props.connection);
        if (props.connection) {
          updateAccount();
        } 
      }); //window.location.reload());
    }
    
    async function getWeb3Modal() {
      // let Torus = (await import('@toruslabs/torus-embed')).default
      const web3Modal = new Web3Modal({
        network: NETWORK.NAME,
        // cacheProvider: false,
        cacheProvider: true,
        providerOptions: {
          walletconnect: {
            package: WalletConnectProvider,
            options: {
              infuraId: INFURA_ID,
              networkParams: NETWORK.PARAMS,
            },
          },
        },
      })
      return web3Modal
    }

    async function connect() {
      const web3Modal = await getWeb3Modal()
      const modalConnection = await web3Modal.connect()
      props.setConnection(modalConnection)
      // setProvider(new ethers.providers.Web3Provider(modalConnection))
    }

    const updateAccount = async () => {
      if (props.connection){
        const provider = new ethers.providers.Web3Provider(props.connection)
        const accounts = await provider.listAccounts()
        props.setAccount(accounts[0])
      }
    }

    const updateChain = async () => {
      const provider = new ethers.providers.Web3Provider(props.connection)
      const networkInfo = await provider.getNetwork();
      if (networkInfo && networkInfo.chainId) {
        props.setRightNetwork(networkInfo.chainId === NETWORK.ID);
      } else {
        props.setRightNetwork(false);
      }
    }

    useEffect( () => {
      if (props.connection) {
        updateAccount();
        updateChain(); // Mostly for the first time a wallet is connected
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.connection])

    const changeNetwork = async () => {
      if (props.connection && props.account && !props.rightNetwork) {
        try {
          await props.connection.request({
            method: "wallet_switchEthereumChain",
            params: [ { chainId: `0x${Number(NETWORK.ID).toString(16)}`, } ]
          });
        } catch (err) {
          props.openNotificationWithIcon('Network switch failed', "Couldn't switch to required network. Please switch mannually, re-connect or refresh page.", 'error');
        }
      } else {
        console.log("No connection or already on right network");
      }
    };
    
    const handleNetworkSwitch = async () => {
      await changeNetwork();
    };

    // This runs our function when the connection is updated (we have access to the network).
    useEffect(() => {
      if (props.connection && props.account && props.rightNetwork) {
        signIn()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.connection, props.account, props.rightNetwork])  
    
    async function signIn() {
      if (!props.connection) {
        console.log('No conection to the network')
      } else {
        const provider = new ethers.providers.Web3Provider(props.connection)
        const signer = provider.getSigner()
        const connectedContract = new ethers.Contract(
                                                Rx.networks[NETWORK.ID].address,
                                                Rx.abi,
                                                signer);
        props.setContract(connectedContract);
      }
    }

    // This runs our function when the contract is updated (we have a connection to Rx).
    useEffect(() => {
      if (props.connection && props.account && props.contract && props.rightNetwork) {
        logIn()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.connection, props.account, props.contract, props.rightNetwork])  

    async function logIn() {
        setLoggedIn(props.contract ? true : false );
    }  

    async function signOut() {
      setLoggedIn(false);
      props.setContract(null);
    }

    return (<Row style={{ width: "100%", padding: 10 }} className='connectWallet'>
            {
              <Col span={4} style={{ display: 'flex', justifyContent: 'left', alignItems: 'baseline', maxHeight: 30 }}>
                <svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 120 120" style={{minWidth:120,maxWidth:120}}>
                  <g opacity="0.8">
                    <circle fill="darkblue" cx="8" cy="8" r="7.5"/>
                    <path fill="red" d="m22.4 14.6h4l-15,24h-4z"/>
                    <path fill="darkred" d="m7.4 14.6h4l15,24h-4z"/>
                    <path fill="blue" d="m0 2.6v24h15z"/>
                  </g>
                </svg>
              </Col>
            }
            {
              <Col span={20} style={{ display: 'flex', justifyContent: 'right' }}>
                <Space direction="horizontal" align="center">
                  { !props.connection && (
                    <Button onClick={connect} style={{float: 'right'}}>Connect Wallet</Button>
                  )}
                  { props.connection && !props.rightNetwork && (
                    <div style={{ float: 'right' }}>
                      <Space direction="horizontal" align="center">
                        <Typography.Text strong>
                          Rx only works on {NETWORK.DESC}. Please change your network.
                        </Typography.Text>
                        <Button onClick={handleNetworkSwitch}> Switch Network </Button>
                      </Space>
                    </div>
                  )}
                  { props.connection && props.rightNetwork && !loggedIn && (
                    <Button onClick={signIn} style={{float: 'right'}}>Sign In</Button>
                  )}
                  { props.connection && props.rightNetwork && loggedIn && (
                    <div style={{ float: 'right' }}>
                      <Space direction="horizontal" align="center">
                        <Typography.Text>Welcome,</Typography.Text>
                        <Typography.Text italic>
                          <Tooltip title={`User: ${props.account}`}>
                            {shortenAddress(props.account)}
                          </Tooltip>
                        </Typography.Text>
                        <Typography.Text>
                          (
                            <Tooltip title={`Contract: ${(props.contract && props.contract.address) ? props.contract.address : ''}`}>
                              {NETWORK.NAME}
                            </Tooltip>
                          )
                        </Typography.Text>
                        <Button onClick={signOut} >Sign Out</Button>
                      </Space>
                    </div>
                  )}
                </Space>
              </Col>
            }
          </Row>
    )
}

export default ConnectWallet