import React, { useState } from 'react';

import AdminMenu from './AdminMenu';
import MainMenu from './MainMenu';
import UserFullInfo from './UserFullInfo';

const DRAWER_WIDTH = '';
const BUTTON_SIZE = "200px"; // All buttons, same width
// const BUTTON_SIZE = "2"; // All buttons, different widths

const Landing = (props) => {

    const [existsSubject, setExistsSubject] = useState(false);
    const [existsDoctor, setExistsDoctor] = useState(false);
    const [existsPharmacist, setExistsPharmacist] = useState(false);
    
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