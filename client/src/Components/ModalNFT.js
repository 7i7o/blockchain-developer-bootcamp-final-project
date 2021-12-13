import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import InlineSVG from 'svg-inline-react';

const ModalNFT = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect ( () => {
    if (props.account) {
      handleCancel();
    }
  }, [props.account]);


  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        style={{ marginBottom: 10 }}
        className='cAlign'
    >
        Load NFT Image
    </Button>
        <Modal
            title={`Rx# ${props.tokenId}`}
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            width={650}
            style={{ top: '50px' }}
        >
            {( props.decodedURIImage &&
                <InlineSVG src={props.decodedURIImage} element='div' />
            )}
        </Modal>
    </>
  );
};

export default ModalNFT;