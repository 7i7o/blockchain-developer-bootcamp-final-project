import React, { useEffect, useState } from 'react';
import { Drawer, Form, Button, Input, DatePicker, Space, Spin } from 'antd';
import { PlusCircleTwoTone } from '@ant-design/icons';
import { ethers } from 'ethers';
import moment from 'moment';
import UserFullInfo from './UserFullInfo';

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const NewSubjectDrawer = (props) => {

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [validAccount, setValidAccount] = useState(false);
    const [searchableSubjectId, setSearchableSubjectId] = useState("");
    const [lastAccountQueried, setLastAccountQueried] = useState("");
    const [existsSubject, setExistsSubject] = useState(false);
    const [existsDoctor, setExistsDoctor] = useState(false);
    const [existsPharmacist, setExistsPharmacist] = useState(false);
    
    const [resultSubjectId, setResultSubjectId] = useState("");
    const [resultName, setResultName] = useState("");
    const [resultBirthDate, setResultBirthDate] = useState(0);
    const [resultHomeAddress, setResultHomeAddress] = useState("");

    const [form] = Form.useForm();

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

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
    
    useEffect(() => {
      if (resultSubjectId !== ZERO_ADDRESS) {
        form.setFieldsValue({
          accountAddress: resultSubjectId,
          birthDate: moment(resultBirthDate),
          fullName: resultName,
          homeAddress: resultHomeAddress
        })
      } else {
        form.setFieldsValue({
          birthDate: moment(),
          fullName: "",
          homeAddress: ""
        })
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resultSubjectId, resultName, resultBirthDate, resultHomeAddress]);
    
    function disabledDate(current) {
        return current && current > moment().endOf('day');
    }

    const addSubject = async (values) => {
        /* Here goes the Web3 Contract Call !!! */
        setLoading(true);

        try {
          let birthDateInSeconds = Math.ceil(values.birthDate.valueOf() / 1000);
          const txn = await props.contract.setSubjectData(
              values.accountAddress,
              birthDateInSeconds,
              values.fullName,
              values.homeAddress
          );
          props.openNotificationWithIcon(`Starting 'Add Patient' transaction.`);
          await txn.wait();
          // props.openNotificationWithIcon(`Transaction finished succesfully.`);
          let birthDate = new Date(birthDateInSeconds * 1000)
          onClose();
          props.openNotificationWithIcon(`Transaction finished succesfully.`,`Patient Added: {
            Account: ${values.accountAddress},
            Name: ${values.fullName},
            Date of Birth: ${birthDate.toDateString()},
            Home Address: ${values.homeAddress}
          }`);
        } catch (error) {
          console.log(error);
          props.openNotificationWithIcon('Transaction Failed!','Please check the console for error messages', 'error');
        }
        setLoading(false);
    }

    const onFinish = (values) => {
        console.log('Received values from form: ', values);
    };

    const handleFormSubmit = () => {
        form.validateFields()
            .then((values) => {
                console.log('Received values from form: ', values);
                addSubject(values);
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
          // icon={<PlusOutlined />}
          icon={<PlusCircleTwoTone />} //twoToneColor="#52c41a" />}
          style={{minWidth: props.buttonSize}}
        >
          Add Patient
        </Button>
        <Drawer
          title="Add or Modify Patient"
          width={props.drawerWidth}
          onClose={onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
          getContainer={false} // Remove Warning about Form.useForm() not connected to Form element
          extra={
            <Spin spinning={loading}>
                <Space>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleFormSubmit} type="primary" disabled={loading} >
                    Save
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
            <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter Full Name' }]}
            >
                <Input placeholder="Please enter full name" disabled={!validAccount || loading} />
            </Form.Item>
            <Form.Item
                name="birthDate"
                label="Date of Birth"
                rules={[{ required: true, message: 'Please enter Date of Birth' }]}
            >
              <DatePicker
                disabled={!validAccount || loading}
                disabledDate={disabledDate}
              />
            </Form.Item>
            <Form.Item
                name="homeAddress"
                label="Home Address"
            >
              <Input placeholder="123 Home St., Local City" disabled={!validAccount || loading} />
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
              stateFullObject={props.objectName}
              resultSubjectId={resultSubjectId} setResultSubjectId={setResultSubjectId}
              resultName={resultName} setResultName={setResultName}
              resultBirthDate={resultBirthDate} setResultBirthDate={setResultBirthDate}
              resultHomeAddress={resultHomeAddress} setResultHomeAddress={setResultHomeAddress}
              mainTitle="Search Results"
          />
        </Drawer>
      </>
    );
}

export default NewSubjectDrawer;
