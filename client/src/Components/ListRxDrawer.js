import React, { useEffect, useState } from 'react';
import { Drawer, Button, Spin, List, Typography, Row, Col, Form, Input, Space } from 'antd';
import { MinusCircleTwoTone, PlusCircleTwoTone, ProfileTwoTone } from '@ant-design/icons';
import { ethers } from 'ethers';
import ShowRxDrawer from './ShowRxDrawer';

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

/***** MODIFICAR TODO !!! *****/


export const ListRxDrawer = (props) => {

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [validAccount, setValidAccount] = useState(false);
    
    const [rxList, setRxList] = useState([]);

    const [searchRxByReceiver, setSearchRxByReceiver] = useState(null);
    const [searchRxBySender, setSearchRxBySender] = useState(null);
    const [searchRxByFrom, setSearchRxByFrom] = useState(null);
    const [searchRxByTo, setSearchRxByTo] = useState(null);
    // const [searchRxByTokenId, setSearchRxByTokenId] = useState(null);

    const [form] = Form.useForm();

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    useEffect( () => {
      if (visible) {
        if (props.parentObjectName === 'Patient') {
          setSearchRxByReceiver(props.account)
        } else if (props.parentObjectName === 'Doctor') {
            setSearchRxBySender(props.account)
        } else if (props.parentObjectName === 'Pharmacist') {
            setSearchRxByTo(props.account)
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
      getApprovalRxList(searchRxByFrom, searchRxByTo, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchRxByFrom, searchRxByTo]);

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

    const decodeTransfer = item => {
      return {
        from: item.args.from,
        to: item.args.to,
        tokenId: item.args.tokenId.toNumber(),
      }
    }

    const filterFromZeroAddress = item => item.from !== ZERO_ADDRESS

    const getMintedRxList = async (sender, receiver, tokenId) => {
      getRxList(sender, receiver, tokenId, props.contract.filters.minted, decodeMinted, null);
    }

    const getApprovalRxList = async (from, to, tokenId) => {
      getRxList(from, to, tokenId, props.contract.filters.Approval, decodeTransfer, filterFromZeroAddress);
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
          const noDuplicatesResult = [...new Set(allResults)];
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
            .catch((errorInfo) => {
                //console.log(errorInfo);
            });
    }

    const onFinish = (values) => {
      if (props.parentObjectName === 'Doctor') {
        setSearchRxByReceiver(values.accountAddress)
      } else if (props.parentObjectName === 'Pharmacist') {
        setSearchRxByFrom(values.accountAddress)
      }
      // console.log('Received values from form: ', values);
    };
  
    const clearFilter = () => {
      form.setFieldsValue({accountAddress: ''})
      if (props.parentObjectName === 'Doctor') {
        setSearchRxByReceiver(null)
      } else if (props.parentObjectName === 'Pharmacist') {
        setSearchRxByFrom(null)
      }
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
                  <Button onClick={clearFilter} disabled={loading}>
                    Clear Filter
                  </Button>
                  <Button onClick={handleFormSubmit} type="primary" disabled={!validAccount || loading} >
                    Filter by Patient
                  </Button>
                </Space>
            </Spin>
          }
        >
          { ( props.parentObjectName === 'Doctor' || props.parentObjectName === 'Pharmacist') &&
              <Form
                layout="vertical"
                form={form}
                onFinish={onFinish}
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
          <Spin spinning={loading} >
            <List
              itemLayout="horizontal"
              dataSource={rxList}
              // grid={{ gutter: 8, column: 4 }}
              pagination={{pageSize: 6,}}
              renderItem={item => (
                <List.Item>
                  {/* <Card title={`Rx# ${item.tokenId}`}>
                    <p>Doctor: {item.sender}</p>
                    <p>Patient: {item.receiver}</p>
                  </Card>
                  */}
                    <List.Item.Meta
                      //avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                      title={
                        // <Typography.Link href="#">
                        //   {`Rx# ${item.tokenId}`}
                        // </Typography.Link>
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
                            <Typography.Text >Doctor: {item.from}</Typography.Text>
                          </Col>
                          <Col span={24}>
                            <Typography.Text >Patient: {item.to}</Typography.Text>
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
