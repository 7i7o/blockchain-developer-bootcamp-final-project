import React from 'react';
import { Col, Row, Typography } from 'antd';

const PharmacistData = (props) => {

    return (
        <Row style={{ paddingTop: 20 }}>
            <Col span={24} style={{ textAlign: 'center'}}><Typography.Title level={5}>Pharmacist Info</Typography.Title></Col>
            <Col span={6} style={{ textAlign: 'right', paddingRight: 5 }}>Account Address:</Col><Col span={18}>{props.pharmacistData.subjectId}</Col>
            <Col span={6} style={{ textAlign: 'right', paddingRight: 5 }}>Degree:</Col><Col span={18}>{props.pharmacistData.degree}</Col>
            <Col span={6} style={{ textAlign: 'right', paddingRight: 5 }}>License:</Col><Col span={18}>{props.pharmacistData.license}</Col>
        </Row>
    )
}

export default PharmacistData;