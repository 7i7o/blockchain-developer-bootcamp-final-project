import React, { useEffect, useState } from 'react';
import { Col, Row, Typography } from 'antd';
import NewSubjectDrawer from './NewSubjectDrawer';
import NewDocPhDrawer from './NewDocPhDrawer';
// import NewPharmacistDrawer from './NewPharmacistDrawer';

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
                let result = await props.contract.isAdmin(props.account);
                // console.log(`Is Admin: ${result}`);
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
                    />
                </Col>
                <Col span={24} className="centerChilds" style={{padding:5}}>
                    <NewDocPhDrawer
                        account={props.account}
                        contract={props.contract}
                        openNotificationWithIcon={props.openNotificationWithIcon}
                        asyncContractCallback={props.contract.setDoctorData}
                        objectName="Doctor"
                    />
                </Col>
                <Col span={24} className="centerChilds" style={{padding:5}}>
                    <NewDocPhDrawer
                        account={props.account}
                        contract={props.contract}
                        openNotificationWithIcon={props.openNotificationWithIcon}
                        asyncContractCallback={props.contract.setPharmacistData}
                        objectName="Pharmacist"
                    />
                    {/* <NewPharmacistDrawer
                        account={props.account}
                        contract={props.contract}
                        openNotificationWithIcon={props.openNotificationWithIcon}
                    /> */}
                </Col>
            </Row>
            )
        }
        </>
    )
}

export default AdminMenu;