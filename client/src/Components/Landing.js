import React, { useState } from 'react';

import SubjectData from './SubjectData'
import DocPhData from './DocPhData'
import AdminMenu from './AdminMenu';
import MainMenu from './MainMenu';

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
            />)
        }
        { props.contract && existsDoctor && 
            (<MainMenu
                account={props.account}
                contract={props.contract}
                openNotificationWithIcon={props.openNotificationWithIcon}
                objectName="Doctor"
            />)
        }
        { props.contract && existsPharmacist && 
            (<MainMenu
                account={props.account}
                contract={props.contract}
                openNotificationWithIcon={props.openNotificationWithIcon}
                objectName="Pharmacist"
            />)
        }
        { props.contract &&
            (<AdminMenu 
                account={props.account}
                contract={props.contract}
                openNotificationWithIcon={props.openNotificationWithIcon}
                />)
        }
        { props.contract &&
            ( <SubjectData 
                account={props.account}
                contract={props.contract}
                openNotificationWithIcon={props.openNotificationWithIcon}
                subjectId={props.account}
                existsSubject={existsSubject} setExistsSubject={setExistsSubject}
                mainTitle="Your Info"
            /> )
        }
        { props.contract &&
            ( <DocPhData
                account={props.account}
                contract={props.contract}
                openNotificationWithIcon={props.openNotificationWithIcon}
                subjectId={props.account}
                existsDocPh={existsDoctor} setExistsDocPh={setExistsDoctor}
                asyncContractCallback={props.contract.getDoctor}
                objectName="Doctor"
            /> )
        }
        { props.contract &&
            ( <DocPhData
                account={props.account}
                contract={props.contract}
                openNotificationWithIcon={props.openNotificationWithIcon}
                subjectId={props.account}
                existsDocPh={existsPharmacist} setExistsDocPh={setExistsPharmacist}
                asyncContractCallback={props.contract.getPharmacist}
                objectName="Pharmacist"
            /> )
        }
    </>)
}

export default Landing;