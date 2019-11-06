import React from 'react';

const AssetFilter = (props) => {
    const isAssetAvailable = props.carBalance.percentUsed < 100;
    if ((isAssetAvailable && props.filters.open) ||
    (!isAssetAvailable && props.filters.closed)) {
        return React.Children.only(React.cloneElement(props.children,  { car: {...props.car}, carBalance: {...props.carBalance}  }));
    } else {
        return null;
    }
};
export default AssetFilter;