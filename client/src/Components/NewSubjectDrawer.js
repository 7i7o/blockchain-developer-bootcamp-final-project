import React, { useState } from 'react';
import { Drawer, Form, Button, Input, DatePicker, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ethers } from 'ethers';
import moment from 'moment';

// class NewSubjectDrawer extends Component {
export const NewSubjectDrawer = (props) => {

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);

    const [form] = Form.useForm();

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const checkNewAccount = (_, value) => {
        if (ethers.utils.isAddress(value)) {
            return Promise.resolve();
        }
        return Promise.reject(new Error('Account must be a valid Ethereum Address!'));
    }

    function disabledDate(current) {
        // Can not select days after today and today
        // TODO: Fix disabled dates for they are not working
        return current && current > moment().startOf('day');
    }

    const addSubject = async (values) => {
        /* Here goes the Web3 Contract Call !!! */
        setLoading(true);

        // console.log("Contract: ", props.contract)
        let birthDateInSeconds = Math.ceil(values.birthDate.valueOf() / 1000);
        const txn = await props.contract.setSubjectData(
            values.accountAddress,
            birthDateInSeconds,
            values.fullName,
            values.homeAddress
        );
        props.openNotificationWithIcon(`Starting 'Add Subject' transaction.`);

        await txn.wait();

        props.openNotificationWithIcon(`Contract called finished succesfully.`);
        
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

//   render() {
    return (
      <>
        <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
          New Subject
        </Button>
        <Drawer
          title="Add a new subject"
        //   width={720}
          width={600}
          onClose={onClose}
          visible={visible}
          bodyStyle={{ paddingBottom: 80 }}
          extra={
            <Space>
              <Button onClick={onClose}>Cancel</Button>
              <Button onClick={handleFormSubmit} type="primary" disabled={loading} >
                Add
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" form={form} onFinish={onFinish} hideRequiredMark>
            <Form.Item
                name="accountAddress"
                label="Account Address"
                // rules={[{ required: true, message: "Please enter Subject's Account", }]}
                rules={[{ validator: checkNewAccount, }]}
            >
              <Input placeholder="0x..." />
            </Form.Item>
            <Form.Item
                name="fullName"
                label="Full Name"
                rules={[{ required: true, message: 'Please enter Full Name' }]}
            >
                <Input placeholder="Please enter full name" />
            </Form.Item>
            <Form.Item
                name="birthDate"
                label="Date of Birth"
                disabledDate={disabledDate}
                rules={[{ required: true, message: 'Please enter Date of Birth' }]}
                // rules={[{ validator: checkNewBirthDate }]}
            >
              <DatePicker />
            </Form.Item>
            <Form.Item
                name="homeAddress"
                label="Home Address"
            >
              <Input placeholder="123 Home St."/>
            </Form.Item>
          </Form>
        </Drawer>
      </>
    );
//   }
}

export default NewSubjectDrawer;
// ReactDOM.render(<NewSubjectDrawer />, mountNode);