import React from 'react';
import { Icon } from 'antd';
import { ipfsUrl } from '../../util/helpers';

const UploadedImage = (props) => (
    <div className="ant-upload-list ant-upload-list-picture ant-upload-list-custom" style={{ marginBottom: 20 }}>
        <div className="ant-upload-list-item ant-upload-list-item-done">
            <div className="ant-upload-list-item-info">
            <span>
                <a className="ant-upload-list-item-thumbnail" href={ipfsUrl + props.hash} target="_blank" rel="noopener noreferrer">
                    <img src={ipfsUrl + props.hash} alt='' />
                </a>
                <a target="_blank" rel="noopener noreferrer" className="ant-upload-list-item-name" href={ipfsUrl + props.hash}>
                    { props.label }
                </a>
            </span>
            </div>
            <Icon type="close" className="anticon anticon-close" onClick={props.removeImage} />
        </div>
    </div>
);
export default UploadedImage;