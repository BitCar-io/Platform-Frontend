import React, { ReactNode } from 'react';
import * as _ from 'lodash';
import { Button, Popconfirm } from 'antd';
import { ButtonProps, ButtonType } from 'antd/lib/button';

interface IPopConfirmProps {
    cancelText?:string;
    okText?:string;
    okType?:ButtonType;
    title:string | ReactNode;
    icon?:ReactNode;
}

interface IButtonWithConfirmationProps extends IPopConfirmProps {
    buttonProps?:ButtonProps;
    requiresConfirmation:boolean;
    onCancel?:(() => void);
    onConfirm:(() => void);
    onValidation?:(() => Promise<boolean>);
}

interface IButtonWithConfirmationState {
    visible:boolean
}

class ButtonWithConfirmation extends React.Component<IButtonWithConfirmationProps, IButtonWithConfirmationState> {

    constructor(props:IButtonWithConfirmationProps) {
        super(props);

        this.state = {
            visible: false
        };
    }

    onButtonClicked = () => {

        if(!this.props.onValidation) {
            this.processClick();
            return;
        }

        this.props.onValidation().then((isValid:boolean) => {
            if(isValid) {
                this.processClick();
            }
        });
    }

    processClick = () => {
        if (!this.props.requiresConfirmation) {
            this.props.onConfirm();
            return;
        }

        this.setState({ visible:true });
    }

    onCancel = () => {
        this.setState({ visible: false });
        this.props.onCancel && this.props.onCancel();
    }

    onConfirm = () => {
        this.setState({ visible: false });
        this.props.onConfirm();
    }

    render(){

        const confirmProps = this.props as IPopConfirmProps;

        return <Popconfirm  cancelButtonProps={{size:'large', className:"cancel-button"}} okButtonProps={{size:'large', className:"ok-button"}} overlayClassName="button-with-confirmation" {...confirmProps} onCancel={this.onCancel} onConfirm={this.onConfirm} disabled={false} placement="top" visible={this.state.visible}>
            <Button {...this.props.buttonProps} onClick ={this.onButtonClicked}>
                {this.props.children}
            </Button>
        </Popconfirm>
    }
}

export default ButtonWithConfirmation;