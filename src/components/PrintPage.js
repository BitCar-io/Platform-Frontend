import React from 'react';
import { Icon } from "antd";

const showPrintDialog = () => {
    window.print()
}

const PrintPage = (props) => {
    return <div onClick={showPrintDialog} className="clickable no-print">
        <Icon type="printer" /> <span className="link-highlight">Print this page</span>
    </div>
}

export default PrintPage;