import React, { useEffect, useState } from 'react';
import { Drawer, Button, Spin, List, Typography, Row, Col, Form, Input, Space, InputNumber } from 'antd';
import { MinusCircleTwoTone, PlusCircleTwoTone, ProfileTwoTone } from '@ant-design/icons';
import { ethers } from 'ethers';
import ShowRxDrawer from './ShowRxDrawer';
import { ZERO_ADDRESS } from './utils/constants';

// const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

/***** MODIFICAR TODO !!! *****/


export const ListRxDrawer = (props) => {

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [validAccount, setValidAccount] = useState(false);
    const [validTokenId, setValidTokenId] = useState(false);
    
    const [rxList, setRxList] = useState([]);
    
    const [searchRxByTokenId, setSearchRxByTokenId] = useState(null);

    const [searchRxByReceiver, setSearchRxByReceiver] = useState(null);
    const [searchRxBySender, setSearchRxBySender] = useState(null);
    const [searchRxByOwner, setSearchRxByOwner] = useState(null);
    const [searchRxByApproved, setSearchRxByApproved] = useState(null);
    // const [searchRxByTokenId, setSearchRxByTokenId] = useState(null);

    const [form] = Form.useForm();
    const [formTokenId] = Form.useForm();

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    useEffect ( () => {
      if (props.account) {
        onClose();
      }
    }, [props.account]);

    useEffect( () => {
      if (visible) {
        if (props.parentObjectName === 'Patient') {
          setSearchRxByReceiver(props.account)
        } else if (props.parentObjectName === 'Doctor') {
            setSearchRxBySender(props.account)
        } else if (props.parentObjectName === 'Pharmacist') {
            setSearchRxByApproved(props.account)
        } else {
          setRxList([])
        }
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    useEffect( () => {
      getMintedRxList(searchRxBySender, searchRxByReceiver, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchRxByReceiver, searchRxBySender]);
  
    useEffect( () => {
      getApprovalRxList(searchRxByOwner, searchRxByApproved, null);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchRxByOwner, searchRxByApproved]);
    
    useEffect( () => {
      if (props.parentObjectName === 'Patient') {
        getMintedRxList(searchRxBySender, searchRxByReceiver, searchRxByTokenId)
      } else if (props.parentObjectName === 'Doctor') {
        getMintedRxList(searchRxBySender, searchRxByReceiver, searchRxByTokenId)
      } else if (props.parentObjectName === 'Pharmacist') {
        getApprovalRxList(searchRxByOwner, searchRxByApproved, searchRxByTokenId);
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchRxByTokenId]);

    // useEffect( () => {
    //   getMintedRxList(null, null, searchRxByTokenId);
    // }, [searchRxByTokenId]);

    const decodeMinted = item => {
      return {
        from: item.args.sender,
        to: item.args.receiver,
        tokenId: item.args.tokenId.toNumber(),
      }
    }

    const decodeApproval = item => {
      return {
        from: item.args.owner,
        to: item.args.approved,
        tokenId: item.args.tokenId.toNumber(),
      }
    }

    const filterFromZeroAddress = item => item.from !== ZERO_ADDRESS

    const getMintedRxList = async (sender, receiver, tokenId) => {
      getRxList(sender, receiver, tokenId, props.contract.filters.minted, decodeMinted, null);
    }

    const getApprovalRxList = async (from, to, tokenId) => {
      getRxList(from, to, tokenId, props.contract.filters.Approval, decodeApproval, filterFromZeroAddress);
    }

    const getRxList = async (from, to, tokenId, asyncCallback, decodeCallback, filterCallback) => {
      let result = null;
      if (from || to || tokenId) {
        setLoading(true);
        const logFilter = asyncCallback(from, to, tokenId);
        try {
          result = await props.contract.queryFilter(logFilter);
        } catch (error) { console.log(error); setLoading(false); }
        setLoading(false);
        // console.log(result)
        if (result) {
          const allResults = result.map(decodeCallback);
          const noDuplicatesResult = allResults.filter(
            (item, index, self) => {
              return index === self.findIndex( i => { return i.tokenId === item.tokenId } )
            }
          )
          if (filterCallback !== null) {
            setRxList(noDuplicatesResult.filter(filterCallback))
          } else {
            setRxList(noDuplicatesResult)
          }
        } else {
          setRxList([])
        }
      }
    }

    const checkAccount = (_, value) => {
      if (ethers.utils.isAddress(value)) {
          setValidAccount(true);
          return Promise.resolve();
      }
      setValidAccount(false);
      return Promise.reject(new Error('Account must be a valid Ethereum Address!'));
    }
 
    const handleFormSubmit = () => {
        form.validateFields()
          .then((values) => {
              onFinish(values);
          })
          .catch((errorInfo) => { }//console.log(errorInfo); 
        );
    }

    const onFinish = (values) => {
      clearTokenIdFilter();
      if (props.parentObjectName === 'Doctor') {
        setSearchRxByReceiver(values.accountAddress)
      } else if (props.parentObjectName === 'Pharmacist') {
        setSearchRxByOwner(values.accountAddress)
      }
      // console.log('Received values from form: ', values);
    };
  
    const handleFormSubmitTokenId = () => {
      formTokenId.validateFields()
        .then((values) => {
          onFinishTokenId(values);
        })
        .catch((errorInfo) => { }//console.log(errorInfo); 
      );
    }

    const onFinishTokenId = (values) => {
      clearPatientFilter();
      setSearchRxByTokenId(values.tokenIdSearch)
    }

    const handleTokenIdChange = (value) => {
      // console.log(value)
      if (value > 0) {
        setValidTokenId(true);
      }
    }

    const clearPatientFilter = () => {
      form.setFieldsValue({accountAddress: ''});
      if (props.parentObjectName === 'Doctor') {
        setSearchRxByReceiver(null)
      } else if (props.parentObjectName === 'Pharmacist') {
        setSearchRxByOwner(null)
      }
    }

    const clearTokenIdFilter = () => {
      formTokenId.setFieldsValue({tokenIdSearch: ''});
      setSearchRxByTokenId(null);
      setValidTokenId(false);
    }

    const clearFilters = () => {
      clearPatientFilter();
      clearTokenIdFilter();
    }

    return (
      <>
        <Button
          type="primary"
          onClick={showDrawer}
          icon={(
            (props.accountAction==='Remove') ?
              <MinusCircleTwoTone /> : //twoToneColor="#c41a52" /> :
              ((props.accountAction==='Add') ?
                <PlusCircleTwoTone /> : //twoToneColor="#52c41a" /> :
                ((props.accountAction==='List') ?
                  <ProfileTwoTone /> :
                  ''
                )
              )
            )
          }
          style={{minWidth: props.buttonSize}}
        >
          {`${props.accountAction} ${props.objectName}`}
        </Button>
        <Drawer
          title={`${props.accountAction} ${props.objectName}`}
          width={props.drawerWidth}
          onClose={onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
          // getContainer={false} // Remove Warning about Form.useForm() not connected to Form element
          extra={ 
            <Spin spinning={loading}>
                <Space>
                  <Button onClick={clearFilters} disabled={loading}>
                    Clear Filters
                  </Button>
                  { ( props.parentObjectName === 'Doctor' || props.parentObjectName === 'Pharmacist') &&
                      <Button onClick={handleFormSubmit} type="primary" disabled={!validAccount || loading} >
                        Filter by Patient
                      </Button>
                  }
                  <Button onClick={handleFormSubmitTokenId} type="primary" disabled={loading || !validTokenId} >
                    Filter by Rx#
                  </Button>
                </Space>
            </Spin>
          }
        >
          { ( props.parentObjectName === 'Doctor' || props.parentObjectName === 'Pharmacist') &&
              <Form
                layout="vertical"
                form={form}
                // onFinish={onFinish}
                hideRequiredMark
              >
                <Form.Item
                    name="accountAddress"
                    label="Patient Address"
                    rules={[{ validator: checkAccount, }]}
                >
                  <Input placeholder="0x..." disabled={loading} />
                </Form.Item>
              </Form>
          }
          {/* { ( props.parentObjectName === 'Doctor' || props.parentObjectName === 'Pharmacist') && */}
          { 
              <Form
                layout="vertical"
                form={formTokenId}
                // onFinish={onFinishTokenId}
                hideRequiredMark
              >
                <Form.Item
                    name="tokenIdSearch"
                    label="Rx#"
                    // rules={[{ validator: checkTokenId, }]}
                >
                  <InputNumber min={1} disabled={loading} onChange={handleTokenIdChange}/>
                </Form.Item>
              </Form>
          }
          <Spin spinning={loading} >
            <List
              itemLayout="horizontal"
              dataSource={rxList}
              // grid={{ gutter: 8, column: 4 }}
              pagination={{pageSize: 6,}}
              renderItem={item => (
                <List.Item>
                    <List.Item.Meta
                      title={
                        <ShowRxDrawer
                          account={props.account}
                          contract={props.contract}
                          openNotificationWithIcon={props.openNotificationWithIcon}
                          tokenId={item.tokenId}
                          patientId={ props.parentObjectName === 'Pharmacist' ? item.from : item.to }
                          parentObjectName={props.parentObjectName}
                          drawerWidth={props.drawerWidth}
                        />
                      }
                      description={<>
                        <Row>
                          <Col span={24}>
                            <Typography.Text >{props.parentObjectName === 'Pharmacist' ? 'Patient' : 'Doctor'}: {item.from}</Typography.Text>
                          </Col>
                          <Col span={24}>
                            <Typography.Text >{props.parentObjectName === 'Pharmacist' ? '' : `Patient: ${item.to}`}</Typography.Text>
                          </Col>
                        </Row>
                      </>}
                    />
                </List.Item>
              )}
            />
          </Spin>
        </Drawer>
      </>
    );
}

export default ListRxDrawer;
