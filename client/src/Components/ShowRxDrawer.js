import React, { useEffect, useState } from 'react';
import { Drawer, Button } from 'antd';
import RxData from './RxData';

const ShowRxDrawer = (props) => {

    const [visible, setVisible] = useState(false);

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    useEffect ( () => {
        if (props.account) {
          onClose();
        }
      }, [props.account]);
  
    return (
        <>
            <Button
                type="primary"
                onClick={showDrawer}
            >
                {`Rx# ${props.tokenId}`}
            </Button>
            <Drawer
                title={`Rx# ${props.tokenId}`}
                width={props.drawerWidth}
                placement="right"
                onClose={onClose}
                visible={visible}
                bodyStyle={{ paddingBottom: 80 }}
            >
                <RxData
                    account={props.account}
                    contract={props.contract}
                    openNotificationWithIcon={props.openNotificationWithIcon}
                    tokenId={props.tokenId}
                    parentObjectName={props.parentObjectName}
                    drawerOnClose={onClose}
                />
            </Drawer>
        </>
    );
}

export default ShowRxDrawer;