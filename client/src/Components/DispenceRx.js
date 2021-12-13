import { Button, Modal, Space, Spin, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { ZERO_ADDRESS } from "./utils/constants";

const DispenceRx = (props) => {

    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);

    const burnRx = async () => {
        // props.openNotificationWithIcon('Should Burn Rx Here!');
        setLoading(true);
        try { // Suscribe ONLY ONCE to burn event for this tokenId
            const burnFilterRx = props.contract.filters.Transfer(null, ZERO_ADDRESS, props.tokenId);
            props.contract.once(burnFilterRx, (from, to, tokenId) => {
                console.log(`You burned Rx #${tokenId.toNumber()} owned by Patient Account ${from}`);
                props.openNotificationWithIcon(
                    `You dispensed Rx #${tokenId}!`,
                    `Rx owned by ${from} was dispensed`,
                    "success",
                    10
                );
            });
        } catch (error) {
            console.log(error);
        }
        try {
            const txn = await props.contract.burn(props.tokenId);
            props.openNotificationWithIcon(`Starting Dispense of Prescription`);
            await txn.wait();
            props.drawerOnClose();
            props.openNotificationWithIcon(`Transaction finished succesfully`,`Rx# ${props.tokenId} dispensed`);
        } catch (error) {
            console.log(error);
            props.openNotificationWithIcon('Dispense of Rx Failed','Please check the console for error messages', 'error');
        }
        setLoading(false);
    }

    const showConfirmModal = () => {
        setVisible(true);
    }

    const handleOk = () => {
        setVisible(false);
        burnRx();
    }

    const handleCancel = () => {
        setVisible(false)
    }

    useEffect ( () => {
        if (props.account) {
          handleCancel();
        }
      }, [props.account]);
  
    return (
        <>
            <Space style={{ paddingTop: 10, paddingBottom: 10, display: 'flex', justifyContent: 'center' }}>
                <Spin spinning={ loading } >
                    <Button
                        disabled={ loading }
                        onClick={ showConfirmModal }
                        type='primary'
                    >
                        Mark Rx as Dispensed
                    </Button>
                </Spin>
            </Space>
            <Modal
                title={`Mark Rx# ${props.tokenId} as Dispensed?`}
                centered
                visible={visible}
                onOk={ handleOk }
                onCancel={ handleCancel }
            >
                <Typography.Text>This action cannot be undone!</Typography.Text>
            </Modal>
        </>
    );

}

export default DispenceRx;