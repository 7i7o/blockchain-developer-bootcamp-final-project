import React, { useEffect, useState } from 'react';
import { Drawer, Form, Button, Input, Space, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ethers } from 'ethers';
import SubjectData from './SubjectData';
import DocPhData from './DocPhData';

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

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

    return (
      <>
        <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
          Add {props.objectName}
        </Button>
        <Drawer
          title={`Add or Modify ${props.objectName}`}
        //   width={720}
          width={600}
          onClose={onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
          extra={
            <Spin spinning={loading}>
              <Space>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleFormSubmit} type="primary">
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
                stateFull={props.objectName === "Doctor"}
                resultSubjectId={resultSubjectId} setResultSubjectId={setResultSubjectId}
                resultDegree={resultDegree} setResultDegree={setResultDegree}
                resultLicense={resultLicense} setResultLicense={setResultLicense}
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
                stateFull={props.objectName === "Pharmacist"}
                resultSubjectId={resultSubjectId} setResultSubjectId={setResultSubjectId}
                resultDegree={resultDegree} setResultDegree={setResultDegree}
                resultLicense={resultLicense} setResultLicense={setResultLicense}
            /> )
        }

        </Drawer>
      </>
    );
}

export default NewDocPhDrawer;
