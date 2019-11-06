import React from "react";
import { Icon } from 'antd';

const UploadedFile = props => {
  return <div className="ant-upload-list-item  upload-text-list-item">
            <div className="ant-upload-list-item-info">
            {!props.loading && <Icon type="paper-clip" />}
            {props.loading && <Icon type="loading" />}
            <span className="ant-upload-list-item-name">
                {props.title}
            </span>
            </div>
            <Icon type="close" onClick={props.removeFile} />
        </div>;
};
export default UploadedFile;
