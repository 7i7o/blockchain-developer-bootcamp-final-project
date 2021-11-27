import React, { useState } from 'react';
import { Drawer, Form, Button, Input, Space, Spin } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ethers } from 'ethers';
import SubjectData from './SubjectData';
import DocPhData from './DocPhData';

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const NewAdminDrawer = (props) => {

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
    
    // useEffect(() => {
    //   if (resultSubjectId !== ZERO_ADDRESS) {
    //     form.setFieldsValue({
    //       accountAddress: resultSubjectId,
    //       birthDate: moment(resultBirthDate),
    //       fullName: resultName,
    //       homeAddress: resultHomeAddress
    //     })
    //   } else {
    //     form.setFieldsValue({
    //       birthDate: moment(),
    //       fullName: "",
    //       homeAddress: ""
    //     })
    //   };
    //   // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [resultSubjectId, resultName, resultBirthDate, resultHomeAddress]);
    
    // function disabledDate(current) {
    //     return current && current > moment().endOf('day');
    // }

    const addAdmin = async (values) => {
        /* Here goes the Web3 Contract Call !!! */
        setLoading(true);

        const txn = await props.contract.addAdmin(
            values.accountAddress
        );
        props.openNotificationWithIcon(`Starting 'Add Admin' transaction.`);

        await txn.wait();

        props.openNotificationWithIcon(`Transaction finished succesfully.`);
        
        setLoading(false);
        
        onClose();

        props.openNotificationWithIcon(`Admin Added: Account: ${values.accountAddress}`);
    }

    const onFinish = (values) => {
        console.log('Received values from form: ', values);
    };

    const handleFormSubmit = () => {
        form.validateFields()
            .then((values) => {
                console.log('Received values from form: ', values);
                addAdmin(values);
            })
            .catch((errorInfo) => {
                //console.log(errorInfo);
            });
    }

    return (
      <>
        <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
          Add Admin
        </Button>
        <Drawer
          title="Add Admin"
          width={600}
          onClose={onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
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
          </Form>

          {
            ( <SubjectData 
              account={props.account}
              contract={props.contract}
              openNotificationWithIcon={props.openNotificationWithIcon}
              subjectId={searchableSubjectId}
              existsSubject={existsSubject} setExistsSubject={setExistsSubject}
              mainTitle="Subject Search"
              stateFull={false}
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

export default NewAdminDrawer;
