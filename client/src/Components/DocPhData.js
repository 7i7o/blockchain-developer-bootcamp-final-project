import React, { useEffect, useState } from 'react';
import { Col, Row, Typography } from 'antd';

const DocPhData = (props) => {

    const [docPhData, setDocPhData] = useState({ subjectId: 0, degree: '', license: ''});

    useEffect(() => {
        if (props.contract && props.account && props.subjectId) {
            getDocPhData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.contract, props.account, props.subjectId])

    const getDocPhData = async () => {
        let result = null;
        
        const {subjectId} = props
        try {
            result = await props.asyncContractCallback(subjectId);
        } catch (error) { console.log(error); }

        if (result) {
            setDocPhData({
                            subjectId: result[0],
                            degree: result[1],
                            license: result[2]
            });
            if (result[1] && result[1].length) {
                props.setExistsDocPh(true);
            } else {
                props.setExistsDocPh(false);
            }
            // console.log(`Subject Data: ${result}`);
        } else {
            setDocPhData(null);
            props.setExistsDocPh(false);
            console.log(`${props.objectName} is not a registered subject`);
        }
    }

    return (
        <>
        { props.contract && !props.existsDocPh &&
            (
            <Row style={{ paddingTop: 20 }}>
                <Col span={24} style={{ textAlign: 'center'}}><Typography.Title level={5}>{props.objectName} Info Not Found</Typography.Title></Col>
            </Row>
            )
        }
        { props.contract && props.existsDocPh &&
            (
            <Row style={{ paddingTop: 20 }}>
                <Col span={24} style={{ textAlign: 'center'}}><Typography.Title level={5}>{props.objectName} Info</Typography.Title></Col>
                <Col span={6} style={{ textAlign: 'right', paddingRight: 5 }}>Account Address:</Col><Col span={18}>{docPhData.subjectId}</Col>
                <Col span={6} style={{ textAlign: 'right', paddingRight: 5 }}>Degree:</Col><Col span={18}>{docPhData.degree}</Col>
                <Col span={6} style={{ textAlign: 'right', paddingRight: 5 }}>License:</Col><Col span={18}>{docPhData.license}</Col>
            </Row>
            )
        }
        </>   
    )
}

export default DocPhData;