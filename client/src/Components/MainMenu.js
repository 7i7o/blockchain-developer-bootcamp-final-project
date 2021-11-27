import React from 'react';
import { Col, Row, Typography } from 'antd';
import MintRxDrawer from './MintRxDrawer';

const MainMenu = (props) => {

    return (<>
        {props.contract && 
            (<Row className="centerChilds">
                <Col span={24} className="centerChilds" style={{padding:5}}>
                    <Typography.Title level={3}>{props.objectName} Menu</Typography.Title>
                </Col>
            </Row>)
        }
        {/* {props.contract && 
            (<Row className="centerChilds">
                <Col span={24} className="centerChilds" style={{padding:5}}>
                    <ListRxDrawer
                        account={props.account}
                        contract={props.contract}
                        openNotificationWithIcon={props.openNotificationWithIcon}
                        objectName={props.objectName}
                        />
                </Col>
            </Row>)
        } */}
        {props.contract && props.objectName === "Doctor" &&
            (<Row className="centerChilds">
                <Col span={24} className="centerChilds" style={{padding:5}}>
                    <MintRxDrawer
                        account={props.account}
                        contract={props.contract}
                        openNotificationWithIcon={props.openNotificationWithIcon}
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