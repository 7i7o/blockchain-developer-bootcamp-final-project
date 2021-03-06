import React, { useEffect, useState } from 'react';
import { Drawer, Form, Button, Input, Space, Spin } from 'antd';
import { PlusCircleTwoTone } from '@ant-design/icons';
import { ethers } from 'ethers';
import UserFullInfo from './UserFullInfo';
import { formatBytes32String, xml1EncodeString } from './utils/stringSanitizer';
import { ZERO_ADDRESS } from './utils/constants';

// const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const NewDocPhDrawer = (props) => {

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [validAccount, setValidAccount] = useState(false);
  const [searchableSubjectId, setSearchableSubjectId] = useState("");
  const [lastAccountQueried, setLastAccountQueried] = useState("");
  const [existsSubject, setExistsSubject] = useState(false);
  const [existsDoctor, setExistsDoctor] = useState(false);
  const [existsPharmacist, setExistsPharmacist] = useState(false);

  const [resultSubjectId, setResultSubjectId] = useState("");
  const [resultDegree, setResultDegree] = useState("");
  const [resultLicense, setResultLicense] = useState("");

  const [form] = Form.useForm();

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
        degree: resultDegree,
        license: resultLicense
      })
    } else {
      form.setFieldsValue({
        degree: "",
        license: ""
      })
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resultSubjectId, resultDegree, resultLicense]);

  const add = async (values) => {
    /* Here goes the Web3 Contract Call !!! */
    setLoading(true);
    // console.log("Contract: ", props.contract)
    
    try {
      let sanitizedDegree = formatBytes32String(xml1EncodeString(values.degree));
      let sanitizedLicense = formatBytes32String(xml1EncodeString(values.license));
      const txn = await props.asyncContractCallback(
        values.accountAddress,
        sanitizedDegree,
        sanitizedLicense
      );
      props.openNotificationWithIcon(`Starting 'Add ${props.objectName}' transaction.`);
      await txn.wait();
      onClose();
      // props.openNotificationWithIcon(`Transaction finished succesfully.`,`${props.objectName} Added: {
      //   Account: ${values.accountAddress},
      //   Degree: ${values.degree},
      //   License: ${values.license}
      // }`);
      props.openNotificationWithIcon(`Transaction submitted`,`Waiting transaction confirmation for ${props.objectName} '${values.accountAddress}'`);

    } catch (error) {
      console.log(error);
      props.openNotificationWithIcon('Transaction Failed!','Please check the console for error messages', 'error');
    }
    setLoading(false);
  }

  const onFinish = (values) => {
    // console.log('Received values from form: ', values);
  };

  const handleFormSubmit = () => {
    form.validateFields()
        .then((values) => {
            // console.log('Received values from form: ', values);
            add(values);
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
          icon={<PlusCircleTwoTone />}//twoToneColor="#52c41a" />}
          style={{minWidth: props.buttonSize}}
        >
          Add {props.objectName}
        </Button>
        <Drawer
          title={`Add or Modify ${props.objectName}`}
        //   width={720}
          width={props.drawerWidth}
          onClose={onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
          getContainer={false} // Remove Warning about Form.useForm() not connected to Form element
          extra={
            <Spin spinning={loading}>
              <Space>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                  onClick={handleFormSubmit}
                  type="primary"
                  disabled={ loading || !validAccount || !existsSubject }
                >
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
                name="degree"
                label="Degree"
                rules={[{ required: true, message: 'Please enter Degree' }]}
            >
              <Input placeholder="Major Degree" disabled={!validAccount || !existsSubject || loading} />
            </Form.Item>
            <Form.Item
                name="license"
                label="License"
                rules={[{ required: true, message: 'Please enter License' }]}
            >
                <Input placeholder="Please enter License" disabled={!validAccount || !existsSubject || loading} />
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
              resultDegree={resultDegree} setResultDegree={setResultDegree}
              resultLicense={resultLicense} setResultLicense={setResultLicense}
              mainTitle="Search Results"
          />
        </Drawer>
      </>
    );
}

export default NewDocPhDrawer;
