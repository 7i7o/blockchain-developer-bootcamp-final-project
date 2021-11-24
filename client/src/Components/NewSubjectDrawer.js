import React, { Component } from 'react';
import { Drawer, Form, Button, Input, DatePicker, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

class NewSubjectDrawer extends Component {
// export const NewSubjectDrawer = () => {

  state = { visible: false }; 

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  addSubject = () => {
    /* Here goes the Web3 Contract Call !!! */
    this.props.parentProps.showMessage("Here we should call the contract to add a subject");
    this.onClose();
  }

  render() {
    return (
      <>
        <Button type="primary" onClick={this.showDrawer} icon={<PlusOutlined />}>
          New Subject
        </Button>
        <Drawer
          title="Add a new subject"
        //   width={720}
          width={450}
          onClose={this.onClose}
          visible={this.state.visible}
          bodyStyle={{ paddingBottom: 80 }}
          extra={
            <Space>
              <Button onClick={this.onClose}>Cancel</Button>
              <Button onClick={this.addSubject} type="primary">
                Add
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" hideRequiredMark>
            <Form.Item
                name="accountAddress"
                label="Account Address"
                rules={[{ required: true, message: "Please enter Subject's Account", }]}
            >
              <Input placeholder="0x..."/>
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
                rules={[{ required: true, message: 'Please enter Date of Birth' }]}
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
  }
}

export default NewSubjectDrawer;
// ReactDOM.render(<NewSubjectDrawer />, mountNode);