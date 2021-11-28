import React, { useEffect, useState } from 'react';
import { Col, Row, Spin, Typography } from 'antd';

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
            let birthDate = new Date(result[1].toNumber() * 1000);// + 0*3*60*60*1000);
            setSubjectData({
                            subjectId: result[0],
                            name: result[2],
                            birthDate: birthDate,
                            homeAddress: result[3]
            });
            if (props.stateFull) {
                props.setResultSubjectId(result[0]);
                props.setResultName(result[2]);
                props.setResultBirthDate(birthDate);
                props.setResultHomeAddress(result[3]);
            }
            if (result[2] && result[2].length) {
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

    return (
        <Spin spinning={loading}>
        { props.contract && props.mainTitle &&
            (
            <Row style={{ paddingTop: 40 }}>
                <Col span={24} style={{ textAlign: 'center'}}>
                    <Typography.Title level={3}>
                        {props.mainTitle}
                    </Typography.Title>
                </Col>
            </Row>
            )
        }
        { props.contract && !props.existsSubject &&
            (
            <Row style={{ paddingTop: 20 }}>
                <Col span={24} style={{ textAlign: 'center'}}><Typography.Title level={5}>Patient Info Not Found</Typography.Title></Col>
            </Row>
            )
        }
        { props.contract && props.existsSubject &&
            (
            <Row style={{ paddingTop: 20 }}>
                <Col span={24} style={{ textAlign: 'center'}}><Typography.Title level={5}>Patient Info</Typography.Title></Col>
                <Col span={6} style={{ textAlign: 'right', paddingRight: 5 }}>Account Address:</Col><Col span={18}>{subjectData.subjectId}</Col>
                <Col span={6} style={{ textAlign: 'right', paddingRight: 5 }}>Full Name:</Col><Col span={18}>{subjectData.name}</Col>
                <Col span={6} style={{ textAlign: 'right', paddingRight: 5 }}>Date of Birth:</Col><Col span={18}>{subjectData.birthDate.toDateString()}</Col>
                <Col span={6} style={{ textAlign: 'right', paddingRight: 5 }}>Home Address:</Col><Col span={18}>{subjectData.homeAddress}</Col>
            </Row>
            )
        }
        </Spin>
    )
}

export default SubjectData;