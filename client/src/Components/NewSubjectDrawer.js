import React, { useState } from 'react';
import { Drawer, Form, Button, Input, DatePicker, Space, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ethers } from 'ethers';
import moment from 'moment';
import SubjectData from './SubjectData';
import DocPhData from './DocPhData';

export const NewSubjectDrawer = (props) => {

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [validAccount, setValidAccount] = useState(false);
    const [searchableSubjectId, setSearchableSubjectId] = useState("");
    const [lastAccountQueried, setLastAccountQueried] = useState("");
    const [existsSubject, setExistsSubject] = useState(false);
    const [existsDoctor, setExistsDoctor] = useState(false);
    const [existsPharmacist, setExistsPharmacist] = useState(false);
    
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
          const zeroAddress = "0x0000000000000000000000000000000000000000";
          if (lastAccountQueried !== zeroAddress) {
            setLastAccountQueried(zeroAddress);
            setSearchableSubjectId(zeroAddress);
          }
        }
      }
    
    function disabledDate(current) {
        return current && current > moment().startOf('day');
    }

    const addSubject = async (values) => {
        /* Here goes the Web3 Contract Call !!! */
        setLoading(true);

        let birthDateInSeconds = Math.ceil(values.birthDate.valueOf() / 1000);
        const txn = await props.contract.setSubjectData(
            values.accountAddress,
            birthDateInSeconds,
            values.fullName,
            values.homeAddress
        );
        props.openNotificationWithIcon(`Starting 'Add Subject' transaction.`);

        await txn.wait();

        props.openNotificationWithIcon(`Transaction finished succesfully.`);
        
        setLoading(false);
        
        let birthDate = new Date(birthDateInSeconds * 1000)

        onClose();

        props.openNotificationWithIcon(`Subject Added: {
            Account: ${values.accountAddress},
            Name: ${values.fullName},
            Date of Birth: ${birthDate},
            Home Address: ${values.homeAddress}
        }`);
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
        <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
          New Subject
        </Button>
        <Drawer
          title="Add a new subject"
          width={600}
          onClose={onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
          extra={
            <Spin spinning={loading}>
                <Space>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleFormSubmit} type="primary" disabled={loading} >
                    Add
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
                disabledDate={disabledDate}
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

          {
            ( <SubjectData 
              account={props.account}
              contract={props.contract}
              openNotificationWithIcon={props.openNotificationWithIcon}
              subjectId={searchableSubjectId}
              existsSubject={existsSubject} setExistsSubject={setExistsSubject}
              mainTitle="Subject Search"
            /> )
          }
          { props.contract &&
            ( <DocPhData
                account={props.account}
                contract={props.contract}
                openNotificationWithIcon={props.openNotificationWithIcon}
                subjectId={searchableSubjectId}
                existsDocPh={existsDoctor} setExistsDocPh={setExistsDoctor}
                asyncContractCallback={props.contract.getDoctor}
                objectName="Doctor"
            /> )
        }
        { props.contract &&
            ( <DocPhData
                account={props.account}
                contract={props.contract}
                openNotificationWithIcon={props.openNotificationWithIcon}
                subjectId={searchableSubjectId}
                existsDocPh={existsPharmacist} setExistsDocPh={setExistsPharmacist}
                asyncContractCallback={props.contract.getPharmacist}
                objectName="Pharmacist"
            /> )
        }


        </Drawer>
      </>
    );
}

export default NewSubjectDrawer;
