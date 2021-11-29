import React, { useState } from 'react';
import { Drawer, Form, Button, Input, Space, Spin, Row, Col, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ethers } from 'ethers';
import SubjectData from './SubjectData';
import DocPhData from './DocPhData';

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const MAX_KEY_LENGTH = 19
const MAX_VALUE_LENGTH = 61


export const MintRxDrawer = (props) => {

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [validAccount, setValidAccount] = useState(false);
    const [searchableSubjectId, setSearchableSubjectId] = useState("");
    const [lastAccountQueried, setLastAccountQueried] = useState("");
    const [existsSubject, setExistsSubject] = useState(false);
    const [existsDoctor, setExistsDoctor] = useState(false);
    // const [existsPharmacist, setExistsPharmacist] = useState(false);
    
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
        if (value === props.account) {
          setValidAccount(true);
          getSubjectInfo();
          return Promise.reject(new Error('Cannot prescribe a Rx to yourself!'));
        }
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
    
    const onFinish = (values) => {
        // console.log('Received values from form: ', values);
    };

    const mintRx = async (values) => {
      /* Here goes the Web3 Contract Call !!! */
      setLoading(true);
      
      try{
        const keys = [values.key1, values.key2, values.key3, values.key4, values.key5, values.key6, values.key7, values.key8, values.key9, values.key10, values.key11, values.key12 ]
        const vals = [values.value1, values.value2, values.value3, values.value4, values.value5, values.value6, values.value7, values.value8, values.value9, values.value10, values.value11, values.value12 ]
        const txn = await props.contract.mint(
            values.accountAddress,
            keys,
            vals
        );
        props.openNotificationWithIcon(`Starting Minting of Prescription`);
        await txn.wait();
        onClose();
        props.openNotificationWithIcon(`Transaction finished succesfully`,`Prescribed Rx to: ${resultName} (${resultSubjectId})`);
      } catch (error) {
        console.log(error);
        props.openNotificationWithIcon('Prescription of Rx Failed','Please check the console for error messages', 'error');
      }
      
      setLoading(false);

    }

    const handleFormSubmit = () => {
        form.validateFields()
            .then((values) => {
                // console.log('Received values from form: ', values);
                if (values.accountAddress === props.account) {
                  props.openNotificationWithIcon('Cannot Prescribe Rx to yourself!', '', 'warning')
                } else {
                  mintRx(values);
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
          icon={<PlusOutlined />}
          style={{minWidth: props.buttonSize}}
        >
          Prescribe Rx
        </Button>
        <Drawer
          title="Prescription Data"
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
                    Prescribe
                </Button>
                </Space>
            </Spin>
          }
        >
          <Form
            layout="vertical"
            form={form}
            onFinish={onFinish}
            hideRequiredMark
            initialValues={{
              key1: 'Medication', key2: '', key3: '',
              key4: 'Dosage', key5: '',
              key6: 'Route',
              key7: 'Frequency',
              key8: 'Total Quantity', key9: '',
              key10: 'Refills',
              key11: 'Diagnosis', key12: '',
              value1: '', value2: '', value3: '', value4: '', value5: '', value6: '', 
              value7: '', value8: '', value9: '', value10: '', value11: '', value12: '',
            }}
            >
            
            <Row>
              <Col span={24}>
                <Form.Item
                    name="accountAddress"
                    label="Account Address"
                    rules={[{ validator: checkAccount, }]}
                >
                  <Input placeholder="0x..." disabled={loading}/>
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={24}>
                <SubjectData 
                  account={props.account}
                  contract={props.contract}
                  openNotificationWithIcon={props.openNotificationWithIcon}
                  subjectId={searchableSubjectId}
                  existsSubject={existsSubject} setExistsSubject={setExistsSubject}
                  mainTitle=""
                  stateFull={true}
                  resultSubjectId={resultSubjectId} setResultSubjectId={setResultSubjectId}
                  resultName={resultName} setResultName={setResultName}
                  resultBirthDate={resultBirthDate} setResultBirthDate={setResultBirthDate}
                  resultHomeAddress={resultHomeAddress} setResultHomeAddress={setResultHomeAddress}
                />
              </Col>
            </Row>

            <Row style={{ paddingTop: 10 }}>
              <Col span={24}>
                <Typography.Title level={3}>Rx</Typography.Title>
              </Col>
            </Row>

            <Row>
              <Col span={6}><Form.Item name='key1' style={{ marginBottom: 8 }}><Input className="rAlign" disabled={!validAccount || loading} maxLength={MAX_KEY_LENGTH} /></Form.Item></Col>
              <Col span={18}><Form.Item name='value1' style={{ marginBottom: 8, fontWeight: 'bold' }}><Input disabled={!validAccount || loading} maxLength={MAX_VALUE_LENGTH} /></Form.Item></Col>
            </Row>
            <Row>
              <Col span={6}><Form.Item name='key2' style={{ marginBottom: 8 }}><Input className="rAlign" disabled={!validAccount || loading} /></Form.Item></Col>
              <Col span={18}><Form.Item name='value2' style={{ marginBottom: 8 }}><Input disabled={!validAccount || loading} /></Form.Item></Col>
            </Row>
            <Row>
              <Col span={6}><Form.Item name='key3' style={{ marginBottom: 8 }}><Input className="rAlign" disabled={!validAccount || loading} /></Form.Item></Col>
              <Col span={18}><Form.Item name='value3' style={{ marginBottom: 8 }}><Input disabled={!validAccount || loading} /></Form.Item></Col>
            </Row>
            <Row>
              <Col span={6}><Form.Item name='key4' style={{ marginBottom: 8 }}><Input className="rAlign" disabled={!validAccount || loading} /></Form.Item></Col>
              <Col span={18}><Form.Item name='value4' style={{ marginBottom: 8 }}><Input disabled={!validAccount || loading} /></Form.Item></Col>
            </Row>

            <Row>
              <Col span={6}><Form.Item name='key5' style={{ marginBottom: 8 }}><Input className="rAlign" disabled={!validAccount || loading} /></Form.Item></Col>
              <Col span={18}><Form.Item name='value5' style={{ marginBottom: 8 }}><Input disabled={!validAccount || loading} /></Form.Item></Col>
            </Row>
            <Row>
              <Col span={6}><Form.Item name='key6' style={{ marginBottom: 8 }}><Input className="rAlign" disabled={!validAccount || loading} /></Form.Item></Col>
              <Col span={18}><Form.Item name='value6' style={{ marginBottom: 8 }}><Input disabled={!validAccount || loading} /></Form.Item></Col>
            </Row>
            <Row>
              <Col span={6}><Form.Item name='key7' style={{ marginBottom: 8 }}><Input className="rAlign" disabled={!validAccount || loading} /></Form.Item></Col>
              <Col span={18}><Form.Item name='value7' style={{ marginBottom: 8 }}><Input disabled={!validAccount || loading} /></Form.Item></Col>
            </Row>
            <Row>
              <Col span={6}><Form.Item name='key8' style={{ marginBottom: 8 }}><Input className="rAlign" disabled={!validAccount || loading} /></Form.Item></Col>
              <Col span={18}><Form.Item name='value8' style={{ marginBottom: 8 }}><Input disabled={!validAccount || loading} /></Form.Item></Col>
            </Row>

            <Row>
              <Col span={6}><Form.Item name='key9' style={{ marginBottom: 8 }}><Input className="rAlign" disabled={!validAccount || loading} /></Form.Item></Col>
              <Col span={18}><Form.Item name='value9' style={{ marginBottom: 8 }}><Input disabled={!validAccount || loading} /></Form.Item></Col>
            </Row>
            <Row>
              <Col span={6}><Form.Item name='key10' style={{ marginBottom: 8 }}><Input className="rAlign" disabled={!validAccount || loading} /></Form.Item></Col>
              <Col span={18}><Form.Item name='value10' style={{ marginBottom: 8 }}><Input disabled={!validAccount || loading} /></Form.Item></Col>
            </Row>
            <Row>
              <Col span={6}><Form.Item name='key11' style={{ marginBottom: 8 }}><Input className="rAlign" disabled={!validAccount || loading} /></Form.Item></Col>
              <Col span={18}><Form.Item name='value11' style={{ marginBottom: 8 }}><Input disabled={!validAccount || loading} /></Form.Item></Col>
            </Row>
            <Row>
              <Col span={6}><Form.Item name='key12' style={{ marginBottom: 8 }}><Input className="rAlign" disabled={!validAccount || loading} /></Form.Item></Col>
              <Col span={18}><Form.Item name='value12' style={{ marginBottom: 8 }}><Input disabled={!validAccount || loading} /></Form.Item></Col>
            </Row>

          </Form>

          { props.contract &&
            ( <DocPhData
                account={props.account}
                contract={props.contract}
                openNotificationWithIcon={props.openNotificationWithIcon}
                subjectId={props.account}
                existsDocPh={existsDoctor} setExistsDocPh={setExistsDoctor}
                asyncContractCallback={props.contract.getDoctor}
                objectName="Doctor"
              /> )
        }
        {/* { props.contract &&
            ( <DocPhData
                account={props.account}
                contract={props.contract}
                openNotificationWithIcon={props.openNotificationWithIcon}
                subjectId={searchableSubjectId}
                existsDocPh={existsPharmacist} setExistsDocPh={setExistsPharmacist}
                asyncContractCallback={props.contract.getPharmacist}
                objectName="Pharmacist"
            /> )
        } */}
        </Drawer>
      </>
    );
}

export default MintRxDrawer;
