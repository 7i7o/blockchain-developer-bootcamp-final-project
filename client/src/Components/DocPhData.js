import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Spin } from 'antd';
import { xml1DecodeString, parseBytes32String } from './utils/stringSanitizer';

const DocPhData = (props) => {

    const [docPhData, setDocPhData] = useState({ subjectId: 0, degree: '', license: ''});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (props.contract && props.account && props.subjectId) {
            getDocPhData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.contract, props.account, props.subjectId])

    const getDocPhData = async () => {
        let result = null;
        
        const {subjectId} = props
        setLoading(true);
        try {
            result = await props.asyncContractCallback(subjectId);
        } catch (error) { console.log(error); setLoading(false); }
        
        if (result) {
            let sanitizedDegree = xml1DecodeString(parseBytes32String(result.degree));
            let sanitizedLicense = xml1DecodeString(parseBytes32String(result.license));
            setDocPhData({
                            subjectId: result.subjectId,
                            degree: sanitizedDegree,
                            license: sanitizedLicense
            });
            if (props.stateFull) {
                props.setResultSubjectId(result.subjectId);
                props.setResultDegree(sanitizedDegree);
                props.setResultLicense(sanitizedLicense);
            }
            if (sanitizedDegree && sanitizedDegree.length) {
                props.setExistsDocPh(true);
            } else {
                props.setExistsDocPh(false);
            }
        } else {
            setDocPhData(null);
            props.setExistsDocPh(false);
            console.log(`${props.objectName} is not a registered patient`);
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
                title={`${props.objectName} Info${ (!props.existsDocPh) ? ' Not Found' : ''}`}
                headStyle={ headStyle }
                bodyStyle={bodyStyle}
                >
                    { props.existsDocPh && (
                        <Row>
                            <Col span={6} style={ keyStyle }>Account Address:</Col>
                            <Col span={18} style={ valueStyle }>{docPhData.subjectId}</Col>

                            <Col span={6} style={ keyStyle }>Degree:</Col>
                            <Col span={18} style={ valueStyle }>{docPhData.degree}</Col>

                            <Col span={6} style={ keyStyle }>License:</Col>
                            <Col span={18} style={ valueStyle }>{docPhData.license}</Col>
                        </Row> )
                    }
                </Card>
            }
        </Spin>
    )
}

export default DocPhData;