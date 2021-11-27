import React, { useState } from 'react';

import SubjectData from './SubjectData'
import DocPhData from './DocPhData'
// import PharmacistData from './PharmacistData'
import AdminMenu from './AdminMenu';
// import { Col, Row, Typography } from 'antd';

const Landing = (props) => {

    const [existsSubject, setExistsSubject] = useState(false);
    const [existsDoctor, setExistsDoctor] = useState(false);
    const [existsPharmacist, setExistsPharmacist] = useState(false);

    // const [isAdmin, setIsAdmin] = useState(false);
    // const [userSubjectData, setUserSubjectData] = useState({ subjectId: 0, name: '', birthDate: new Date(0), homeAddress: ''});
    // const [userDoctorData, setUserDoctorData] = useState({ subjectId: 0, degree: '', license: ''});
    // const [userPharmacistData, setUserPharmacistData] = useState({ subjectId: 0, degree: '', license: ''});

    // // This runs our function when the contract is updated (we have a connection).
    // useEffect(() => {
    //     if (props.contract && props.account) {
    //         getUserState()
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [props.contract, props.account])
    
    // const getUserState = async () => {
    //         // checkIsAdmin();
    //         // getUserSubjectData();
    //         getUserDoctorData();
    //         getUserPharmacistData();
    // }
    
    // const checkIsAdmin = async () => {
    //     try {
    //         let result = await props.contract.isAdmin(props.account);
    //         // console.log(`Is Admin: ${result}`);
    //         setIsAdmin(result);
    //     } catch (error) {
    //         props.openNotificationWithIcon('Admin Check Failed','Admin role check failed. Check the console for more info.', 'error');
    //         console.log(error);
    //     }

    // }
    
    // const getUserSubjectData = async () => {
    //     let result = null;
        
    //     const {contract, account} = props
    //     try {
    //         result = await contract.getSubject(account);
    //     } catch (error) { console.log(error); }
        
    //     if (result) {
    //         setUserSubjectData({
    //                         subjectId: result[0],
    //                         name: result[2],
    //                         birthDate: new Date(result[1].toNumber() * 1000 + 0*3*60*60*1000),
    //                         homeAddress: result[3]
    //         });
    //         // console.log(`Subject Data: ${result}`);
    //     } else {
    //         setUserSubjectData(null);
    //         console.log("User is not a registered subject");
    //     }
    // }
    
    // const getUserDoctorData = async () => {
    //     let result = null;
        
    //     const {contract, account} = props
    //     try {
    //         result = await contract.getDoctor(account);
    //     } catch (error) { console.log(error); }
        
    //     if (result) {
    //         setUserDoctorData({
    //                         subjectId: result[0],
    //                         degree: result[1],
    //                         license: result[2]
    //         });
    //         // console.log(`Doctor Data: ${result}`);
    //     } else {
    //         setUserDoctorData(null);
    //         console.log("User is not a registered doctor");
    //     }
    // }
    
    // const getUserPharmacistData = async () => {
    //     let result = null;
        
    //     const {contract, account} = props
    //     try {
    //         result = await contract.getPharmacist(account);
    //     } catch (error) { console.log(error); }
        
    //     if (result) {
    //         setUserPharmacistData({
    //                         subjectId: result[0],
    //                         degree: result[1],
    //                         license: result[2]
    //         });
    //         // console.log(`Pharmacist Data: ${result}`);
    //     } else {
    //         setUserPharmacistData(null);
    //         console.log("User is not a registered pharmacist");
    //     }
    // }

    
    return (<>
        { props.contract && // isAdmin && 
            (<AdminMenu 
                account={props.account}
                contract={props.contract}
                openNotificationWithIcon={props.openNotificationWithIcon}
                />)
        }
        {/* { props.contract && userSubjectData && userSubjectData.name &&
            (   <Row style={{ paddingTop: 40 }}>
                    <Col span={24} style={{ textAlign: 'center'}}>
                        <Typography.Title level={3}>
                            My Info
                        </Typography.Title>
                    </Col>
                </Row>
            )
        } */}
        { props.contract && // userSubjectData && userSubjectData.name &&
            ( <SubjectData 
                account={props.account}
                contract={props.contract}
                openNotificationWithIcon={props.openNotificationWithIcon}
                subjectId={props.account}
                existsSubject={existsSubject} setExistsSubject={setExistsSubject}
                mainTitle="Current User Info"
            /> )
        }
        { props.contract && // userDoctorData && userDoctorData.license && //userSubjectData.name &&
            ( <DocPhData
                account={props.account}
                contract={props.contract}
                openNotificationWithIcon={props.openNotificationWithIcon}
                subjectId={props.account}
                existsDocPh={existsDoctor} setExistsDocPh={setExistsDoctor}
                asyncContractCallback={props.contract.getDoctor}
                objectName="Doctor"
            /> )
            //(<p>Degree: {userDoctorData.degree}, License: {userDoctorData.license}</p>) }
        }
        { props.contract && // userPharmacistData && userPharmacistData.license && //userSubjectData.name &&
            ( <DocPhData
                account={props.account}
                contract={props.contract}
                openNotificationWithIcon={props.openNotificationWithIcon}
                subjectId={props.account}
                existsDocPh={existsPharmacist} setExistsDocPh={setExistsPharmacist}
                asyncContractCallback={props.contract.getPharmacist}
                objectName="Pharmacist"
            /> )
            //(<p>Degree: {userPharmacistData.degree}, License: {userPharmacistData.license}</p>) }
        }
    </>)
}

export default Landing;