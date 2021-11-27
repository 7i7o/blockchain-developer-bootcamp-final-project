import React, { useState } from 'react';
import { Drawer, Form, Button, Input, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ethers } from 'ethers';
import SubjectData from './SubjectData';
import DocPhData from './DocPhData';

const NewDocPhDrawer = (props) => {

  const [visible, setVisible] = useState(false);
  const [validAccount, setValidAccount] = useState(false);
  const [lastAccountQueried, setLastAccountQueried] = useState("");
  const [existsSubject, setExistsSubject] = useState(false);
  const [existsDoctor, setExistsDoctor] = useState(false);
  const [existsPharmacist, setExistsPharmacist] = useState(false);

  // const [userSubjectData, setUserSubjectData] = useState({ subjectId: 0, name: '', birthDate: new Date(0), homeAddress: ''});
  const [loading, setLoading] = useState(false);

  const [searchableSubjectId, setSearchableSubjectId] = useState("");

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

  const add = async (values) => {
    /* Here goes the Web3 Contract Call !!! */
    setLoading(true);

    console.log("Contract: ", props.contract)
    const txn = await props.asyncContractCallback(
      values.accountAddress,
      values.degree,
      values.license
    );

    props.openNotificationWithIcon(`Starting 'Add ${props.objectName}' transaction.`);

    await txn.wait();

    props.openNotificationWithIcon(`Contract called finished succesfully.`);
    
    setLoading(false);
    
    // props.openNotificationWithIcon(`Here we should call the contract to add a ${props.objectName}`);
    onClose();

    props.openNotificationWithIcon(`${props.objectName} Added: {
        Account: ${values.accountAddress},
        Degree: ${values.degree},
        License: ${values.license}
    }`);
  }

  const onFinish = (values) => {
    console.log('Received values from form: ', values);
  };

  const handleFormSubmit = () => {
    form.validateFields()
        .then((values) => {
            console.log('Received values from form: ', values);
            add(values);
        })
        .catch((errorInfo) => {
            //console.log(errorInfo);
        });
  }

  const getSubjectInfo = () => {
    let subjectId = form.getFieldValue("accountAddress");
    // console.log(subjectId)
    if (ethers.utils.isAddress(subjectId)) {
      setLastAccountQueried(subjectId);
      setSearchableSubjectId(subjectId);
    } else {
      const zeroAddress = "0x0000000000000000000000000000000000000000";
      if (lastAccountQueried !== zeroAddress) {
        setLastAccountQueried(zeroAddress);
        setSearchableSubjectId(zeroAddress);
      }
      // props.openNotificationWithIcon('Check Account Address','Address supplied is not a valid Ethereum Account','warning');
    }
  }

  // render() {
    return (
      <>
        <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
          Add {props.objectName}
        </Button>
        <Drawer
          title={`Add a new ${props.objectName}`}
        //   width={720}
          width={600}
          onClose={onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
          extra={
            <Space>
              <Button onClick={onClose}>Cancel</Button>
              <Button onClick={handleFormSubmit} type="primary">
                Add
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" form={form} onFinish={onFinish} hideRequiredMark>
            <Form.Item
                name="accountAddress"
                label="Account Address"
                // rules={[{ required: true, message: "Please enter Valid Account", }]}
                rules={[{ validator: checkAccount, }]}
            >
              <Input placeholder="0x..."/>
            </Form.Item>
            <Form.Item
                name="degree"
                label="Degree"
                rules={[{ required: true, message: 'Please enter Degree' }]}
            >
              <Input placeholder="Major Degree" disabled={!validAccount || !existsSubject} />
            </Form.Item>
            <Form.Item
                name="license"
                label="License"
                rules={[{ required: true, message: 'Please enter License' }]}
            >
                <Input placeholder="Please enter License" disabled={(!validAccount || !existsSubject)} />
            </Form.Item>
          </Form>
          {/* <Button onClick={getSubjectInfo}>Check If Subject Exists</Button> */}
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
          { props.contract && // userDoctorData && userDoctorData.license && //userSubjectData.name &&
            ( <DocPhData
                account={props.account}
                contract={props.contract}
                openNotificationWithIcon={props.openNotificationWithIcon}
                subjectId={searchableSubjectId}
                existsDocPh={existsDoctor} setExistsDocPh={setExistsDoctor}
                asyncContractCallback={props.contract.getDoctor}
                objectName="Doctor"
            /> )
            //(<p>Degree: {userDoctorData.degree}, License: {userDoctorData.license}</p>) }
        }
        { props.contract && // userPharmacistData && userPharmacistData.license && //userSubjectData.name &&
            ( <DocPhData
                account={props.account}
                contract={props.contract}
                openNotificationWithIcon={props.openNotificationWithIcon}
                subjectId={searchableSubjectId}
                existsDocPh={existsPharmacist} setExistsDocPh={setExistsPharmacist}
                asyncContractCallback={props.contract.getPharmacist}
                objectName="Pharmacist"
            /> )
            //(<p>Degree: {userPharmacistData.degree}, License: {userPharmacistData.license}</p>) }
        }

        </Drawer>
      </>
    );
  // }
}

export default NewDocPhDrawer;
