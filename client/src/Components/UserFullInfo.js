import React from 'react';
import { Card } from 'antd';
import SubjectData from './SubjectData';
import DocPhData from './DocPhData';

const UserFullInfo = (props) => {

    // const [loading, setLoading] = useState(false);

    // const titleStyle= {
    //     display: 'inline'
    // }

    const cardStyle = {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        maxWidth: '600px',
        marginTop: 40,
    }
    const bodyStyle = {
        paddingTop: 1,
    }

    return (<>
        { props.contract && (
            <Card
                className='cAlign'
                style={ cardStyle }
                hoverable
                title={props.mainTitle}
                bodyStyle={bodyStyle}
            >
                <SubjectData 
                    account={props.account}
                    contract={props.contract}
                    openNotificationWithIcon={props.openNotificationWithIcon}
                    subjectId={props.subjectId}
                    existsSubject={props.existsSubject} setExistsSubject={props.setExistsSubject}
                    mainTitle={props.mainTitle}
                    stateFull={props.stateFullObject==='Patient'}
                    resultSubjectId={props.resultSubjectId} setResultSubjectId={props.setResultSubjectId}
                    resultName={props.resultName} setResultName={props.setResultName}
                    resultBirthDate={props.resultBirthDate} setResultBirthDate={props.setResultBirthDate}
                    resultHomeAddress={props.resultHomeAddress} setResultHomeAddress={props.setResultHomeAddress}
                      />
                <DocPhData
                    account={props.account}
                    contract={props.contract}
                    openNotificationWithIcon={props.openNotificationWithIcon}
                    subjectId={props.subjectId}
                    existsDocPh={props.existsDoctor} setExistsDocPh={props.setExistsDoctor}
                    asyncContractCallback={props.contract.getDoctor}
                    objectName="Doctor"
                    stateFull={props.stateFullObject==='Doctor'}
                    resultSubjectId={props.resultSubjectId} setResultSubjectId={props.setResultSubjectId}
                    resultDegree={props.resultDegree} setResultDegree={props.setResultDegree}
                    resultLicense={props.resultLicense} setResultLicense={props.setResultLicense}
                    />
                <DocPhData
                    account={props.account}
                    contract={props.contract}
                    openNotificationWithIcon={props.openNotificationWithIcon}
                    subjectId={props.subjectId}
                    existsDocPh={props.existsPharmacist} setExistsDocPh={props.setExistsPharmacist}
                    asyncContractCallback={props.contract.getPharmacist}
                    objectName="Pharmacist"
                    stateFull={props.stateFullObject==='Pharmacist'}
                    resultSubjectId={props.resultSubjectId} setResultSubjectId={props.setResultSubjectId}
                    resultDegree={props.resultDegree} setResultDegree={props.setResultDegree}
                    resultLicense={props.resultLicense} setResultLicense={props.setResultLicense}
                    />
            </Card>
        )}
    </>);

}

export default UserFullInfo;