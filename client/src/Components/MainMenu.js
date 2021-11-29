import React from 'react';
import { Col, Row, Typography } from 'antd';
import MintRxDrawer from './MintRxDrawer';
import ListRxDrawer from './ListRxDrawer';

const MainMenu = (props) => {

    return (<>
        {props.contract && 
            (<Row className="centerChilds">
                <Col span={24} className="centerChilds" style={{padding:5}}>
                    <Typography.Title level={3}>{props.objectName} Menu</Typography.Title>
                </Col>
            </Row>)
        }
        {props.contract && 
            (<Row className="centerChilds">
                <Col span={24} className="centerChilds" style={{padding:5}}>
                    <ListRxDrawer
                        account={props.account}
                        contract={props.contract}
                        openNotificationWithIcon={props.openNotificationWithIcon}
                        accountAction='List'
                        objectName='Rx'
                        drawerWidth={props.drawerWidth}
                        buttonSize={props.buttonSize}
                        // If Patient, can't filter list. Else, a search for patient/Token should show
                        parentObjectName={ props.objectName }
                        // asyncContractCallback={props.contract.filters.minted}
                        // subjectId = { props.account }
                    />
                </Col>
            </Row>)
        }
        {props.objectName === "Doctor" && props.contract && 
            (<Row className="centerChilds">
                <Col span={24} className="centerChilds" style={{padding:5}}>
                    <MintRxDrawer
                        account={props.account}
                        contract={props.contract}
                        openNotificationWithIcon={props.openNotificationWithIcon}
                        drawerWidth={props.drawerWidth}
                        buttonSize={props.buttonSize}
                    />
                </Col>
            </Row>)
        }
        {/* {props.contract && props.objectName === "Pharmacist" &&
            (<Row className="centerChilds">
                <Col span={24} className="centerChilds" style={{padding:5}}>
                    <BurnRxDrawer
                        account={props.account}
                        contract={props.contract}
                        openNotificationWithIcon={props.openNotificationWithIcon}
                    />
                </Col>
            </Row>)
        } */}
        </>
    )
}

export default MainMenu;