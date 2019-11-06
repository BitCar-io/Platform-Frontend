import React from 'react';
import { Card, Icon, Alert} from 'antd';

const RegistrationStep = (props) => {
    return <Card className={'reg-step' + ' reg-step-' + props.status}>
                <h1>{props.title}</h1>
                <p>{ props.status !== 'incomplete' && props.description }</p>
                

                { props.alert && <Alert style={{ marginBottom: 12 }}  
                message={props.alert}
                type="warning" 
                showIcon /> }

                <br />

                { props.status !== 'complete' && props.button }
                { props.status === 'complete' && <h1><Icon type="check-circle" className="reg-step-done-icon" />Done</h1> }
            </Card>
}
export default RegistrationStep;