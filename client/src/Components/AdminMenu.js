import React, { useEffect, useState } from 'react';
import { Col, Row, Typography } from 'antd';
import NewSubjectDrawer from './NewSubjectDrawer';
import NewDocPhDrawer from './NewDocPhDrawer';
import AccountActionDrawer from './AccountActionDrawer';
import { zeroBytes32 } from './utils/stringSanitizer';

const AdminMenu = (props) => {

    const [isOwner, setIsOwner] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [refreshData, setRefreshData] = useState(false);

        // This runs our function when the contract is updated (we have a connection).
        useEffect(() => {
            if (props.contract && props.account) {
                checkIsAdmin();
                checkIsPaused();
                checkIsOwner();
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [props.contract, props.account, refreshData])

        const checkIsAdmin = async () => {
            try {
                const result = await props.contract.isAdmin(props.account);
                setIsAdmin(result);
            } catch (error) {
                props.openNotificationWithIcon('Admin Check Failed','Admin role check failed. Check the console for more info.', 'error');
                console.log(error);
            }
        }

        const checkIsPaused = async () => {
            try {
                const result = await props.contract.getSelfGrantAdmin();
                setIsPaused(result);
            } catch (error) {
                props.openNotificationWithIcon('getPausable Check Failed','Getting pausable failed. Check the console for more info.', 'error');
                console.log(error);
            }
        }

        const checkIsOwner = async () => {
            try {
                const result = await props.contract.hasRole(zeroBytes32, props.account);
                setIsOwner(result);
            } catch (error) {
                props.openNotificationWithIcon('Owner Check Failed','DEFAULT_ADMIN_ROLE check failed. Check the console for more info.', 'error');
                console.log(error);
            }
        }

        const toggleRefreshData = () => {
            setRefreshData(!refreshData);
        }

    return (<>
        {props.contract  && isAdmin &&
            (<Row className="centerChilds">
                <Col span={24} className="centerChilds" style={{padding:5}}>
                    <Typography.Title level={3}>Admin Menu</Typography.Title>
                </Col>
                <Col span={24} className="centerChilds" style={{padding:5}}>
                    <NewSubjectDrawer
                        account={props.account}
                        contract={props.contract}
                        openNotificationWithIcon={props.openNotificationWithIcon}
                        buttonSize={props.buttonSize}
                        drawerWidth={props.drawerWidth}
                        accountAction="Add"
                        objectName="Patient"
                        asyncContractCallback={props.contract.setSubjectData}
                    />
                </Col>
                <Col span={24} className="centerChilds" style={{padding:5}}>
                    <AccountActionDrawer
                        account={props.account}
                        contract={props.contract}
                        openNotificationWithIcon={props.openNotificationWithIcon}
                        buttonSize={props.buttonSize}
                        drawerWidth={props.drawerWidth}
                        accountAction="Remove"
                        objectName="Patient"
                        asyncContractCallback={props.contract.removeSubject}
                    />
                </Col>
                <Col span={24} className="centerChilds" style={{padding:5, marginTop:20}}>
                    <NewDocPhDrawer
                        account={props.account}
                        contract={props.contract}
                        openNotificationWithIcon={props.openNotificationWithIcon}
                        buttonSize={props.buttonSize}
                        drawerWidth={props.drawerWidth}
                        asyncContractCallback={props.contract.setDoctorData}
                        objectName="Doctor"
                    />
                </Col>
                <Col span={24} className="centerChilds" style={{padding:5}}>
                    <AccountActionDrawer
                        account={props.account}
                        contract={props.contract}
                        openNotificationWithIcon={props.openNotificationWithIcon}
                        buttonSize={props.buttonSize}
                        drawerWidth={props.drawerWidth}
                        accountAction="Remove"
                        objectName="Doctor"
                        asyncContractCallback={props.contract.removeDoctor}
                    />
                </Col>
                <Col span={24} className="centerChilds" style={{padding:5, marginTop:20}}>
                    <NewDocPhDrawer
                        account={props.account}
                        contract={props.contract}
                        openNotificationWithIcon={props.openNotificationWithIcon}
                        buttonSize={props.buttonSize}
                        drawerWidth={props.drawerWidth}
                        asyncContractCallback={props.contract.setPharmacistData}
                        objectName="Pharmacist"
                    />
                </Col>
                <Col span={24} className="centerChilds" style={{padding:5}}>
                    <AccountActionDrawer
                        account={props.account}
                        contract={props.contract}
                        openNotificationWithIcon={props.openNotificationWithIcon}
                        buttonSize={props.buttonSize}
                        drawerWidth={props.drawerWidth}
                        accountAction="Remove"
                        objectName="Pharmacist"
                        asyncContractCallback={props.contract.removePharmacist}
                    />
                </Col>
                <Col span={24} className="centerChilds" style={{padding:5, marginTop:20}}>
                    <AccountActionDrawer
                        account={props.account}
                        contract={props.contract}
                        openNotificationWithIcon={props.openNotificationWithIcon}
                        buttonSize={props.buttonSize}
                        drawerWidth={props.drawerWidth}
                        accountAction="Add"
                        objectName="Admin"
                        asyncContractCallback={props.contract.addAdmin}
                    />
                </Col>
                <Col span={24} className="centerChilds" style={{padding:5}}>
                    <AccountActionDrawer
                        account={props.account}
                        contract={props.contract}
                        openNotificationWithIcon={props.openNotificationWithIcon}
                        buttonSize={props.buttonSize}
                        drawerWidth={props.drawerWidth}
                        accountAction="Remove"
                        objectName="Admin"
                        asyncContractCallback={props.contract.removeAdmin}
                    />
                </Col>
            </Row>
            )
        }
        {props.contract  && !isAdmin && !props.existsSubject && isPaused &&
            <Row className="centerChilds">
            <Col span={24} className="centerChilds" style={{padding:5}}>
                <Typography.Title level={3}>Admin Menu</Typography.Title>
            </Col>
            <Col span={24} className="centerChilds" style={{padding:5, marginTop:20}}>
                <AccountActionDrawer
                    account={props.account}
                    contract={props.contract}
                    openNotificationWithIcon={props.openNotificationWithIcon}
                    buttonSize={props.buttonSize}
                    drawerWidth={props.drawerWidth}
                    accountAction="Add"
                    objectName="me as Admin"
                    asyncContractCallback={props.contract.addAdmin}
                    autoExecute={true}
                    accountAddress={props.account}
                    autoRefreshCallback={toggleRefreshData}
                />
            </Col>
            </Row>
        }
        { props.contract  && isOwner &&
            (<Row className="centerChilds">
                <Col span={24} className="centerChilds" style={{padding:5, marginTop:20}}>
                    <AccountActionDrawer
                        account={props.account}
                        contract={props.contract}
                        openNotificationWithIcon={props.openNotificationWithIcon}
                        buttonSize={props.buttonSize}
                        drawerWidth={props.drawerWidth}
                        accountAction="Enable"
                        objectName="Self Grant Admin"
                        asyncContractCallback={props.contract.setSelfGrantAdmin}
                        autoExecute={true}
                        accountAddress={props.account}
                        autoRefreshCallback={toggleRefreshData}
                        />
                </Col>
                <Col span={24} className="centerChilds" style={{padding:5}}>
                    <AccountActionDrawer
                        account={props.account}
                        contract={props.contract}
                        openNotificationWithIcon={props.openNotificationWithIcon}
                        buttonSize={props.buttonSize}
                        drawerWidth={props.drawerWidth}
                        accountAction="Disable"
                        objectName="Self Grant Admin"
                        asyncContractCallback={props.contract.setSelfGrantAdmin}
                        autoExecute={true}
                        accountAddress={props.account}
                        autoRefreshCallback={toggleRefreshData}
                        />
                </Col>
            </Row>
            )
        }
        </>
    )
}

export default AdminMenu;