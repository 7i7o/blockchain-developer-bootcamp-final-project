import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Spin, Typography } from 'antd';
import ModalNFT from './ModalNFT';

const RxData = (props) => {

    const [loading, setLoading] = useState(false);

    const [rxData, setRxData] = useState(null);
    const [rxTokenURI, setRxTokenURI] = useState(null);
    const [decodedURIImage, setDecodedURIImage] = useState('');

    const [patient, setPatient] = useState(null);
    const [doctorSubject, setDoctorSubject] = useState(null);
    const [doctor, setDoctor] = useState(null);
    const [keys, setKeys] = useState(null);
    const [values, setValues] = useState(null);
    const [birthDate, setBirthDate] = useState(null);
    const [rxDate, setRxDate] = useState(null);

    
    useEffect( () => {
        if (props.tokenId) {
            getRxData();
            getRxTokenUri();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.tokenId]);

    useEffect( () => {
        if (rxTokenURI) {
            const json = JSON.parse(window.atob(rxTokenURI.substring(rxTokenURI.indexOf(',') + 1)));
            const decodedImg = window.atob(json.image.substring(json.image.indexOf(',') + 1));
            setDecodedURIImage(decodedImg);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rxTokenURI]);

    useEffect( () => {
        if (rxData) {
            setPatient(rxData.patient);
            setDoctorSubject(rxData.doctorSubject);
            setDoctor(rxData.doctor);
            setKeys(rxData[6]);
            setValues(rxData[7]);
            setBirthDate(new Date(rxData.patient.birthDate.toNumber() * 1000));
            setRxDate(new Date(rxData.date.toNumber() * 1000));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rxData]);

    const getRxData = () => {
        getTokenAsyncData(props.tokenId, props.contract.getRx, setRxData);
    }

    const getRxTokenUri = () => {
        getTokenAsyncData(props.tokenId, props.contract.tokenURI, setRxTokenURI);
    }

    const getTokenAsyncData = async (tokenId, asyncCallback, setCallback) => {
        let result = null;
        setLoading(true);
        try {
            result = await asyncCallback(tokenId);
        } catch (error) { console.log(error); setLoading(false); }
        if (result) {
            console.log(result);
            setCallback(result);
        } else {
            setRxData(null);
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
        // paddingTop: 1,
    }

    return (<>
        <Spin spinning={loading}>
        { rxData &&
            <Card
            className='cAlign'
            bordered={true}
            headStyle={ headStyle }
            bodyStyle={ bodyStyle }
            >
                    { patient && birthDate &&
                        <Row>
                            <Col span={6} style={ keyStyle }>Name:</Col>
                            <Col span={18} style={ valueStyle }>{patient.name}</Col>

                            <Col span={6} style={ keyStyle }>Date of Birth:</Col>
                            <Col span={18} style={ valueStyle }>{birthDate.toDateString()}</Col>

                            <Col span={6} style={ keyStyle }>Address:</Col> 
                            <Col span={18} style={ valueStyle }>{patient.homeAddress}</Col>

                            <Col span={6} style={ keyStyle }>Patient Account:</Col>
                            <Col span={18} style={ valueStyle }>{patient.subjectId}</Col>
                        </Row>
                    }
                    <Row>
                        <Col span={3} style={{ paddingTop: 30}}>
                            <Typography.Title level={3}>RX</Typography.Title>
                        </Col>
                    </Row>
                    { keys && values &&
                        <Row >
                            <Col span={6} style={ keyStyle }>{keys[0]}</Col>
                            <Col span={18} style={ valueStyle }>{values[0]}</Col>
                            <Col span={6} style={ keyStyle }>{keys[1]}</Col>
                            <Col span={18} style={ valueStyle }>{values[1]}</Col>
                            <Col span={6} style={ keyStyle }>{keys[2]}</Col>
                            <Col span={18} style={ valueStyle }>{values[2]}</Col>
                            <Col span={6} style={ keyStyle }>{keys[3]}</Col>
                            <Col span={18} style={ valueStyle }>{values[3]}</Col>
                            <Col span={6} style={ keyStyle }>{keys[4]}</Col>
                            <Col span={18} style={ valueStyle }>{values[4]}</Col>
                            <Col span={6} style={ keyStyle }>{keys[5]}</Col>
                            <Col span={18} style={ valueStyle }>{values[5]}</Col>
                            <Col span={6} style={ keyStyle }>{keys[6]}</Col>
                            <Col span={18} style={ valueStyle }>{values[6]}</Col>
                            <Col span={6} style={ keyStyle }>{keys[7]}</Col>
                            <Col span={18} style={ valueStyle }>{values[7]}</Col>
                            <Col span={6} style={ keyStyle }>{keys[8]}</Col>
                            <Col span={18} style={ valueStyle }>{values[8]}</Col>
                            <Col span={6} style={ keyStyle }>{keys[9]}</Col>
                            <Col span={18} style={ valueStyle }>{values[9]}</Col>
                            <Col span={6} style={ keyStyle }>{keys[10]}</Col>
                            <Col span={18} style={ valueStyle }>{values[10]}</Col>
                            <Col span={6} style={ keyStyle }>{keys[11]}</Col>
                            <Col span={18} style={ valueStyle }>{values[11]}</Col>
                        </Row>
                    }
                    { rxDate && doctorSubject && doctor &&
                        <Row style={{ paddingTop:30 }}>
                            <Col span={6} style={ keyStyle }>Date:</Col>
                            <Col span={18} style={ valueStyle }>{rxDate.toDateString()}</Col>

                            <Col span={6} style={ keyStyle }>Doctor Name:</Col>
                            <Col span={18} style={ valueStyle }>{doctorSubject.name}</Col>

                            <Col span={6} style={ keyStyle }>Degree:</Col>
                            <Col span={18} style={ valueStyle }>{doctor.degree}</Col>

                            <Col span={6} style={ keyStyle }>License:</Col>
                            <Col span={18} style={ valueStyle }>{doctor.license}</Col>

                            <Col span={6} style={ keyStyle }>Doctor Account:</Col>
                            <Col span={18} style={ valueStyle }>{doctor.subjectId}</Col>
                        </Row>
                    }
            </Card>
        }
        { rxData && rxTokenURI &&
            <ModalNFT
                tokenId={props.tokenId}
                rxData={rxData}
                rxTokenURI={rxTokenURI}
                decodedURIImage={decodedURIImage}
                closable
            />
        }
        </Spin>

        {/* <PharmacistApproval
              account={props.account}
              contract={props.contract}
              openNotificationWithIcon={props.openNotificationWithIcon}
              tokenId={props.tokenId}
        /> */}
    </>)
}

export default RxData;