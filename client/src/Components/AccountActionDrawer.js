import React, { useEffect, useState } from 'react';
import { Drawer, Form, Button, Input, Space, Spin, Typography } from 'antd';
import { MinusCircleTwoTone, PlusCircleTwoTone } from '@ant-design/icons';
import { ethers } from 'ethers';
import UserFullInfo from './UserFullInfo';
import { ZERO_ADDRESS } from './utils/constants';

// const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const AccountActionDrawer = (props) => {

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [validAccount, setValidAccount] = useState(false);
    const [searchableSubjectId, setSearchableSubjectId] = useState("");
    const [lastAccountQueried, setLastAccountQueried] = useState("");
    const [existsSubject, setExistsSubject] = useState(false);
    const [existsDoctor, setExistsDoctor] = useState(false);
    const [existsPharmacist, setExistsPharmacist] = useState(false);


    
    // const [resultSubjectId, setResultSubjectId] = useState("");
    // const [resultName, setResultName] = useState("");
    // const [resultBirthDate, setResultBirthDate] = useState(0);
    // const [resultHomeAddress, setResultHomeAddress] = useState("");

    const [form] = Form.useForm();

    useEffect( () => {
      if (visible && props.autoExecute && props.accountAddress) {
        form.setFieldsValue({"accountAddress": props.accountAddress})
        handleFormSubmit()
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible, props.autoExecute, props.accountAddress]);

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
        if (props.autoExecute) {
          props.autoRefreshCallback();
        }
    };

    useEffect ( () => {
      if (props.account) {
        onClose();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.account]);

    const checkAccount = (_, value) => {
      if (ethers.utils.isAddress(value)) {
          setValidAccount(true);
          getSubjectInfo();
          return Promise.resolve();
      }
      setValidAccount(false);
      getSubjectInfo();
      return Promise.reject(new Error('Account must be a valid Ethereum Address!'));
    }
 
    const getSubjectInfo = () => {
        let subjectId = form.getFieldValue("accountAddress");
        if (ethers.utils.isAddress(subjectId)) {
          setLastAccountQueried(subjectId);
          setSearchableSubjectId(subjectId);
        } else {
          if (lastAccountQueried !== ZERO_ADDRESS) {
            setLastAccountQueried(ZERO_ADDRESS);
            setSearchableSubjectId(ZERO_ADDRESS);
          }
        }
      }
    
    const accountAction = async (values) => {
        /* Here goes the Web3 Contract Call !!! */
        setLoading(true);

        try {
          const params = 
            (props.objectName === "Role") ? 
                (props.accountAction === "Pause")
              : values.accountAddress ;

          const txn = await props.asyncContractCallback(params);

          props.openNotificationWithIcon(
            <Typography.Text>Starting '{props.accountAction} {props.objectName}' transaction.</Typography.Text>
          );
          await txn.wait();
          onClose();
          props.openNotificationWithIcon(`Transaction finished succesfully.`,`Action '${props.accountAction} ${props.objectName}' performed on Account: ${params}`);

        } catch (error) {
          console.log(error);
          props.openNotificationWithIcon('Transaction Failed!','Please check the console for error messages', 'error');
        }
        
        setLoading(false);
    }

    const onFinish = (values) => {
        // console.log('Received values from form: ', values);
    };

    const checkAccountActionBeforeSubmit = () => {
      if (props.accountAction === 'Remove') {
        if (props.objectName === 'Pharmacist') {
          if (!existsPharmacist) {
            props.openNotificationWithIcon(`Cannot ${props.accountAction} ${props.objectName}`,`You can only ${props.accountAction} a registered ${props.objectName}!`, 'error');
            return false;
          }
        } else if (props.objectName === 'Doctor') {
          if (!existsDoctor) {
            props.openNotificationWithIcon(`Cannot ${props.accountAction} ${props.objectName}`,`You can only ${props.accountAction} a registered ${props.objectName}!`, 'error');
            return false;
          }
        } else if (props.objectName === 'Patient') {
          if (existsPharmacist) {
            props.openNotificationWithIcon(`Cannot ${props.accountAction} ${props.objectName}`,`Remove as Pharmacist first!`,'error');
            return false;
          } else if (existsDoctor) {
            props.openNotificationWithIcon(`Cannot ${props.accountAction} ${props.objectName}`,`Remove as Doctor first!`,'error');
            return false
          } else if (!existsSubject) {
            props.openNotificationWithIcon(`Cannot ${props.accountAction} ${props.objectName}`,`You can only ${props.accountAction} a registered ${props.objectName}!`,'error');
            return false;
          }
        }
      }
      return true;
    }

    const handleFormSubmit = () => {
        form.validateFields()
            .then((values) => {
                // console.log('Received values from form: ', values);
                if (checkAccountActionBeforeSubmit()) {
                  accountAction(values);
                }
            })
            .catch((errorInfo) => {
                //console.log(errorInfo);
            });
    }

    return (
      <>
        <Button
          type="primary"
          onClick={showDrawer}
          // icon={( (props.accountAction==='Remove') ? <MinusOutlined /> : <PlusOutlined /> )}
          // icon={( (props.accountAction==='Remove') ? <MinusCircleOutlined /> : <PlusCircleOutlined /> )}
          icon={(
            (props.accountAction==='Remove') ?
              <MinusCircleTwoTone /> : //twoToneColor="#c41a52" /> :
              ((props.accountAction==='Add') ?
                <PlusCircleTwoTone /> : //twoToneColor="#52c41a" /> :
                ''))}
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
          getContainer={false} // Remove Warning about Form.useForm() not connected to Form element
          extra={
            <Spin spinning={loading}>
                <Space>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleFormSubmit} type="primary" disabled={!validAccount || loading} >
                  {props.accountAction}
                </Button>
                </Space>
            </Spin>
          }
        >
          <Form layout="vertical" form={form} onFinish={onFinish} hideRequiredMark>
            <Form.Item
                name="accountAddress"
                label="Account Address"
                rules={[{ validator: checkAccount, }]}
            >
              <Input placeholder="0x..." disabled={loading} />
            </Form.Item>
          </Form>
          <UserFullInfo
              account={props.account}
              contract={props.contract}
              openNotificationWithIcon={props.openNotificationWithIcon}
              subjectId={searchableSubjectId}
              existsSubject={existsSubject} setExistsSubject={setExistsSubject}
              existsDoctor={existsDoctor} setExistsDoctor={setExistsDoctor}
              existsPharmacist={existsPharmacist} setExistsPharmacist={setExistsPharmacist}
              mainTitle="Search Results"
          />
        </Drawer>
      </>
    );
}

export default AccountActionDrawer;
