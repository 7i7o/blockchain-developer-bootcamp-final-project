import React, { useEffect, useState } from 'react';
import { Col, Row, Typography } from 'antd';
import NewSubjectDrawer from './NewSubjectDrawer';
import NewDocPhDrawer from './NewDocPhDrawer';
import AccountActionDrawer from './AccountActionDrawer';


const AdminMenu = (props) => {

    const [isAdmin, setIsAdmin] = useState(false);

        // This runs our function when the contract is updated (we have a connection).
        useEffect(() => {
            if (props.contract && props.account) {
                checkIsAdmin();
            }
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [props.contract, props.account])

        const checkIsAdmin = async () => {
            try {
                const result = await props.contract.isAdmin(props.account);
                setIsAdmin(result);
            } catch (error) {
                props.openNotificationWithIcon('Admin Check Failed','Admin role check failed. Check the console for more info.', 'error');
                console.log(error);
            }
    
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
        </>
    )
}

export default AdminMenu;