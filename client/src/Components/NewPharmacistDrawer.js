import React, { Component } from 'react';
import { Drawer, Form, Button, Input, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

class NewPharmacistDrawer extends Component {
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
    this.props.parentProps.showMessage("Here we should call the contract to add a pharmacist");
    this.onClose();
  }

  render() {
    return (
      <>
        <Button type="primary" onClick={this.showDrawer} icon={<PlusOutlined />}>
          New Pharmacist
        </Button>
        <Drawer
          title="Add a new pharmacist"
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
                rules={[{ required: true, message: "Please enter Pharmacist's Account", }]}
            >
              <Input placeholder="0x..."/>
            </Form.Item>
            <Form.Item
                name="license"
                label="License"
                rules={[{ required: true, message: 'Please enter Pharmacy License' }]}
            >
                <Input placeholder="Please enter Pharmacy License" />
            </Form.Item>
            <Form.Item
                name="degree"
                label="Degree"
                rules={[{ required: true, message: 'Please enter Pharmacy Degree' }]}
            >
              <Input placeholder="PharmD"/>
            </Form.Item>
          </Form>
        </Drawer>
      </>
    );
  }
}

export default NewPharmacistDrawer;
// ReactDOM.render(<NewSubjectDrawer />, mountNode);