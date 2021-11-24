import React, { Component } from 'react';
import { Card, Space } from 'antd';

import NewSubjectDrawer from './NewSubjectDrawer'
import NewDoctorDrawer from './NewDoctorDrawer'
import NewPharmacistDrawer from './NewPharmacistDrawer'

// const Landing = () => {
class Landing extends Component {

    render() {
        return (
            !this.props.parentProps.isAdmin ?
                <p>No es Admin</p>
                : <Space direction="vertical">
                    <Card title="Admin functions">
                        {/* style={{ width: 300 }}> */}
                        <p><NewSubjectDrawer parentProps={ this.props.parentProps } /></p>
                        <p><NewDoctorDrawer parentProps={ this.props.parentProps } /></p>
                        <p><NewPharmacistDrawer parentProps={ this.props.parentProps } /></p>
                    </Card>
                </Space>
            
        )
    }
}

export default Landing;