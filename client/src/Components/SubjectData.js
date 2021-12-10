import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Spin } from 'antd';
import { xml1DecodeString } from './utils/stringSanitizer';

const SubjectData = (props) => {

    const [subjectData, setSubjectData] = useState({ subjectId: 0, name: '', birthDate: new Date(0), homeAddress: ''});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (props.contract && props.account && props.subjectId) {
            getSubjectData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.contract, props.account, props.subjectId])

    const getSubjectData = async () => {
        let result = null;
        
        const {contract, subjectId} = props
        setLoading(true);
        try {
            result = await contract.getSubject(subjectId);
        } catch (error) { console.log(error); setLoading(false); }
        
        if (result) {
            let birthDate = new Date(result.birthDate.toNumber() * 1000);// + 0*3*60*60*1000);
            let sanitizedName = xml1DecodeString(result.name);
            let sanitizedHomeAddress = xml1DecodeString(result.homeAddress);
            setSubjectData({
                            subjectId: result.subjectId,
                            name: sanitizedName,
                            birthDate: birthDate,
                            homeAddress: sanitizedHomeAddress
            });
            if (props.stateFull) {
                props.setResultSubjectId(result.subjectId);
                props.setResultName(sanitizedName);
                props.setResultBirthDate(birthDate);
                props.setResultHomeAddress(sanitizedHomeAddress);
            }
            if (result.name && result.name.length) {
                props.setExistsSubject(true);
            } else {
                props.setExistsSubject(false);
            }
        } else {
            setSubjectData(null);
            props.setExistsSubject(false);
            console.log("User is not a registered patient");
        }
        setLoading(false);
    }

    const keyStyle={
        textAlign: 'right',
        paddingRight: 5,
    }
    const valueStyle= { 
        textAlign: 'left',
        fontFamily: 'SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace',
        fontWeight: 'bold',
    }
    const headStyle= {
        border: 'none',
    }
    const bodyStyle = {
        paddingTop: 1,
    }

    return (
        <Spin spinning={loading}>
            {props.contract &&
                <Card
                    className='cAlign'
                    bordered={false}
                    title={`Patient Info${ (!props.existsSubject) ? ' Not Found' : ''}`}
                    headStyle={ headStyle }
                    bodyStyle={bodyStyle}
                >
                    { props.existsSubject && (
                        <Row>
                            <Col span={6} style={ keyStyle }>Account Address:</Col>
                            <Col span={18} style={ valueStyle }>{subjectData.subjectId}</Col>

                            <Col span={6} style={ keyStyle }>Full Name:</Col>
                            <Col span={18} style={ valueStyle }>{subjectData.name}</Col>

                            <Col span={6} style={ keyStyle }>Date of Birth:</Col>
                            <Col span={18} style={ valueStyle }>{subjectData.birthDate.toDateString()}</Col>

                            <Col span={6} style={ keyStyle }>Home Address:</Col>
                            <Col span={18} style={ valueStyle }>{subjectData.homeAddress}</Col>
                        </Row> )
                    }
                </Card>
            }
        </Spin>
    )
}

export default SubjectData;