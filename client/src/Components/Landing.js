import React, { useEffect, useState } from 'react';

import AdminMenu from './AdminMenu';
import MainMenu from './MainMenu';
import UserFullInfo from './UserFullInfo';
import { BUTTON_SIZE, DRAWER_WIDTH, ZERO_ADDRESS } from './utils/constants';

// const DRAWER_WIDTH = '';
// const BUTTON_SIZE = "200px"; // All buttons, same width
// const BUTTON_SIZE = "2"; // All buttons, different widths

const Landing = (props) => {

    const [existsSubject, setExistsSubject] = useState(false);
    const [existsDoctor, setExistsDoctor] = useState(false);
    const [existsPharmacist, setExistsPharmacist] = useState(false);
    
    useEffect( () => {
        if (props.contract && props.account) {
            setupEventsListeners();
        }
            // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.contract, props.account]);

    const setupEventsListeners = () => {

        // Remove all registered listeners so we can have a clean list of events
        props.contract.removeAllListeners();

        // Set up a Received Rx Event Notification (for Patients)
        const mintedFilterReceivedRx = props.contract.filters.minted(null, props.account, null);
        props.contract.on(mintedFilterReceivedRx, (sender, receiver, tokenId) => {
            console.log(`Received Rx #${tokenId.toNumber()} from Doctor Account ${sender}`);
            props.openNotificationWithIcon(
                `You received a new Rx! (Rx #${tokenId})`,
                `Prescribed by Doctor Account: ${sender}`,
                "success",
                10
                )
            }
        );

        // Set up a Minted Rx Event Notification (for Doctors)
        const mintedFilterSentRx = props.contract.filters.minted(props.account, null, null);
        props.contract.on(mintedFilterSentRx, (sender, receiver, tokenId) => {
            console.log(`Prescribed Rx #${tokenId.toNumber()} to Patient Account ${receiver}`);
            props.openNotificationWithIcon(
                `You prescribed a new Rx! (Rx #${tokenId})`,
                `Prescribed to Patient Account: ${receiver}`,
                "success",
                10
                )
            }
        );

        // Set up an Approved Pharmacist Event Notification (for Patients)
        const approvedPharmacist = props.contract.filters.Approval(props.account, null, null);
        props.contract.on(approvedPharmacist, (owner, approved, tokenId) => {
            console.log(`Rx #${tokenId.toNumber()} Approved to Pharmacist Account ${approved}`);
            let msgTitle = '';
            let msgContent = '';
            if (approved === ZERO_ADDRESS) {
                // Approval removed
                msgTitle = `Un-assigned all pharmacists for Rx #${tokenId.toNumber()}`;
            } else {
                // Approval to someone
                msgTitle = `You Assigned Rx #${tokenId.toNumber()} to a Pharmacist!`;
                msgContent = `Rx Assigned to Pharmacist Account: ${approved}`;

            }
            props.openNotificationWithIcon( msgTitle, msgContent, "success", 10 );
            }
        );

        // Set up an Approved As Pharmacist Event Notification (for Pharmacists)
        const approvedAsPharmacist = props.contract.filters.Approval(null, props.account, null);
        props.contract.on(approvedAsPharmacist, (owner, approved, tokenId) => {
            console.log(`Rx #${tokenId.toNumber()} Approved by Patient Account ${owner}`);
            props.openNotificationWithIcon(
                `You were Assigned a new Prescription! (Rx #${tokenId.toNumber()})`,
                `Rx Assigned by Patient Account: ${owner}`,
                "success",
                10
                )
            }
        );

        // Set up a Burnt Rx Event Notification (for Patients)
        const burnFilterRx = props.contract.filters.Transfer(props.account, ZERO_ADDRESS, null);
        props.contract.on(burnFilterRx, (from, to, tokenId) => {
            console.log(`Burned Rx #${tokenId.toNumber()} owned by Patient Account ${from}`);
            props.openNotificationWithIcon( `Your Rx #${tokenId} was dispensed!`, '', "success", 10 )
            }
        );


    }

    return (<>
        { props.contract && existsSubject && 
            (<MainMenu
                account={props.account}
                contract={props.contract}
                openNotificationWithIcon={props.openNotificationWithIcon}
                objectName="Patient"
                // subjectId={props.account}
                drawerWidth={DRAWER_WIDTH}
                buttonSize={BUTTON_SIZE}
                />)
        }
        { props.contract && existsDoctor && 
            (<MainMenu
                account={props.account}
                contract={props.contract}
                openNotificationWithIcon={props.openNotificationWithIcon}
                objectName="Doctor"
                // subjectId={''}
                drawerWidth={DRAWER_WIDTH}
                buttonSize={BUTTON_SIZE}
                />)
        }
        { props.contract && existsPharmacist && 
            (<MainMenu
                account={props.account}
                contract={props.contract}
                openNotificationWithIcon={props.openNotificationWithIcon}
                objectName="Pharmacist"
                // subjectId={''}
                drawerWidth={DRAWER_WIDTH}
                buttonSize={BUTTON_SIZE}
                />)
        }
        { props.contract &&
            (<AdminMenu 
                account={props.account}
                contract={props.contract}
                openNotificationWithIcon={props.openNotificationWithIcon}
                drawerWidth={DRAWER_WIDTH}
                buttonSize={BUTTON_SIZE}
                existsSubject={existsSubject}
                />)
        }
        { props.contract &&
            (
                <UserFullInfo
                    account={props.account}
                    contract={props.contract}
                    openNotificationWithIcon={props.openNotificationWithIcon}
                    subjectId={props.account}
                    existsSubject={existsSubject} setExistsSubject={setExistsSubject}
                    existsDoctor={existsDoctor} setExistsDoctor={setExistsDoctor}
                    existsPharmacist={existsPharmacist} setExistsPharmacist={setExistsPharmacist}
                    mainTitle="Your Info"
                />
            )
        }   
    </>)
}

export default Landing;