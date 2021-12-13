import { Button, Col, Collapse, Form, Input, Row, Space, Spin, Typography } from "antd";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import DispenceRx from "./DispenceRx";
import UserFullInfo from "./UserFullInfo";
import { ZERO_ADDRESS } from "./utils/constants";

const { Panel } = Collapse;

const ApprovePharmacist = (props) => {

    const [loading, setLoading] = useState(false);

    // const [validAccount, setValidAccount] = useState(false);
    const [searchableSubjectId, setSearchableSubjectId] = useState("");
    const [lastAccountQueried, setLastAccountQueried] = useState("");
    const [existsSubject, setExistsSubject] = useState(false);
    const [existsDoctor, setExistsDoctor] = useState(false);
    const [existsPharmacist, setExistsPharmacist] = useState(false);

    const [approvedPharmacist, setApprovedPharmacist] = useState(ZERO_ADDRESS);
  
    const [form] = Form.useForm();
  
    useEffect(() => {
        if (props.tokenId) {
            // Get Approved Address from Contract
            getApproved(props.tokenId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.tokenId]);
    
    useEffect(() => {
        if (approvedPharmacist) {
            // Get Approved Address from Contract
            form.setFieldsValue({
                accountAddress: approvedPharmacist,
            })
            checkAccount(null, approvedPharmacist)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [approvedPharmacist]);

    const getApproved = async (tokenId) => {
        if (!tokenId) {
            setApprovedPharmacist(ZERO_ADDRESS);
        } else {
            let result = null;
            const {contract} = props
            setLoading(true);
            try {
                result = await contract.getApproved(tokenId);
            } catch (error) { console.log(error); setLoading(false); }
            
            if (result) {
                console.log("Approved Pharmacist: ", result);
                setApprovedPharmacist(result);
            } else {
                setApprovedPharmacist(ZERO_ADDRESS);
            }
            setLoading(false);
        }
    }

    const checkAccount = (_, value) => {
        if (ethers.utils.isAddress(value)) {
            // setValidAccount(true);
            getSubjectInfo();
            return Promise.resolve();
        }
        // setValidAccount(false);
        getSubjectInfo();
        return Promise.reject(new Error('Account must be a valid Ethereum Address!'));
    }

    const getSubjectInfo = () => {
        let subjectId = form.getFieldValue("accountAddress");
        if (ethers.utils.isAddress(subjectId)) {
            setLastAccountQueried(subjectId);
            setSearchableSubjectId(subjectId);
        } else {
            if (lastAccountQueried !== ZERO_ADDRESS) {
                setLastAccountQueried(ZERO_ADDRESS);
                setSearchableSubjectId(ZERO_ADDRESS);
            }
        }
    }

    const approvePharmacist = (values) => {
        approveAddress(values.accountAddress);
    }
    
    const clearApprovals = () => {
        approveAddress(ZERO_ADDRESS);
    }
    
    const approveAddress = async (addressToApprove) => {
        /* Here goes the Web3 Contract Call !!! */
        setLoading(true);
        // console.log("Should call contract to approve: ", addressToApprove);
        try {
            const {contract} = props;
            const txn = await contract.approve(
                addressToApprove,
                props.tokenId
            );
            props.openNotificationWithIcon(`Starting 'Assign Pharmacist' transaction.`);
            await txn.wait();
            onApprovedPharmacist();
            props.openNotificationWithIcon(`Transaction finished succesfully.`,`Pharmacist Assigned: {
                  Pharmacist Account: ${addressToApprove},
                  Rx #${props.tokenId},
            }`);
        } catch (error) {
            console.log(error);
            props.openNotificationWithIcon('Transaction Failed!','Please check the console for error messages', 'error');
        }
        setLoading(false);        
    }

    const handleFormSubmit = () => {
        form.validateFields()
            .then((values) => {
                // console.log('Received values from form: ', values);
                approvePharmacist(values);
            })
            .catch((errorInfo) => {
                //console.log(errorInfo);
            });
    }

    const onApprovedPharmacist = async (values) => {
        await getApproved(props.tokenId);
    };

    const onFinish = (values) => {
        // console.log('Received values from form: ', values);
    };

    return (
        <>
            { approvedPharmacist && 
                <Space style={{ paddingTop: 10, paddingBottom: 10, display: 'flex', justifyContent: 'center' }}>
                    <Typography.Text>Currently Assigned Pharmacist:</Typography.Text>
                    <Typography.Text>{approvedPharmacist === ZERO_ADDRESS ? 'None': approvedPharmacist }</Typography.Text>
                </Space>
            }
            { props.parentObjectName === 'Pharmacist' && props.account === approvedPharmacist &&
                <DispenceRx 
                    account={props.account}
                    contract={props.contract}
                    openNotificationWithIcon={props.openNotificationWithIcon}
                    parentObjectName={props.parentObjectName}
                    tokenId={props.tokenId}
                    drawerOnClose={ props.drawerOnClose }
                >
                </DispenceRx>
            }
            { props.parentObjectName === 'Patient' &&
                <Collapse
                    defaultActiveKey={['0']}
                    ghost
                >
                    <Panel
                        key="1"
                        header={`${approvedPharmacist === ZERO_ADDRESS ? '' : '(Re)' }Assign Pharmacist`}
                        extra={
                            <Space
                                // Prevent click extra to trigger collapse:
                                onClick={ event => {
                                        event.stopPropagation();
                                    }
                                }
                            >
                                <Spin spinning={ loading } >
                                    <Button
                                        onClick={clearApprovals}
                                        disabled={(approvedPharmacist === ZERO_ADDRESS)}
                                    >
                                        Unassign
                                    </Button>
                                    <Button
                                        onClick={handleFormSubmit}
                                        type="primary"
                                        disabled={!existsPharmacist || loading}
                                    >
                                        Assign Pharmacist
                                    </Button>
                                </Spin>
                            </Space>
                        }
                    >

                        <Form
                            layout="vertical"
                            form={form}
                            onFinish={onFinish}
                            hideRequiredMark
                            // initialValues={{ accountAddress: approvedPharmacist }}
                            >
                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        name="accountAddress"
                                        label="Pharmacist Address"
                                        rules={[{ validator: checkAccount, }]}
                                        >
                                        <Input placeholder="0x..." disabled={loading}/>
                                    </Form.Item>
                                </Col>
                                <Col span={24}>
                                    <UserFullInfo
                                        account={props.account}
                                        contract={props.contract}
                                        openNotificationWithIcon={props.openNotificationWithIcon}
                                        subjectId={searchableSubjectId}
                                        existsSubject={existsSubject} setExistsSubject={setExistsSubject}
                                        existsDoctor={existsDoctor} setExistsDoctor={setExistsDoctor}
                                        existsPharmacist={existsPharmacist} setExistsPharmacist={setExistsPharmacist}
                                        mainTitle="Search Results"
                                        />
                                </Col>
                            </Row>
                        </Form>
                    </Panel>
                </Collapse>
}
        </>
    )
}

export default ApprovePharmacist;