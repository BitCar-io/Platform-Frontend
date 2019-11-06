import React from 'react';
import { Icon } from 'antd';

const PendingImage = (props) => (
    <div className="ant-upload-list ant-upload-list-picture ant-upload-list-custom" style={{ marginBottom: 20 }}>
        <div className={'ant-upload-list-item ' + (props.file.status === 'pending' ? 'ant-upload-list-item-pending' : '') + (props.file.status === 'error' ? 'ant-upload-list-item-error' : '')}>
            <div className="ant-upload-list-item-info">
            <span>
                <span className="ant-upload-list-item-thumbnail">
                    <Icon type="loading" className="asset-upload-pending-icon" />
                </span>
                <span className="ant-upload-list-item-name">
                    { props.file.name }
                </span>
            </span>
            </div>
        </div>
    </div>
);
export default PendingImage;