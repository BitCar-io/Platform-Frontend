import {BlockchainEvent, startPlatformEvent, PLATFORM_EVENT_ASSETBALANCE, PLATFORM_EVENT_ASSET_STATECHANGE, PLATFORM_EVENT_ESCROWBALANCE} from '../util/web3/eventHelper';
import { assetApprovalState, loadCurrentAssetBalance } from '../util/assetHelpers';
import { setAssetApprovalState, addLoadedAsset, removeUnapprovedAsset } from '../actions';
import { createUserAdminApprovalEvents } from './userEvents';
import { loadAllContractData } from '../core/loadAssets';
import store from '../store';
import { getBitCarContract } from './tokenPurchase';

export async function setupEventsForAllAssets(baseAssets, web3) {

    baseAssets.map(baseAsset => {

        const assetAddress = baseAsset.address;

        if(!baseAsset.isLive) {
            let stateChangeEvent = new BlockchainEvent(`${PLATFORM_EVENT_ASSET_STATECHANGE}${assetAddress}`, undefined,
            (error, event) => {
                const newApprovalState = parseInt(event.returnValues[0]);
                console.log(`Asset '${assetAddress}' state has changed to ${newApprovalState}.`);
                store.dispatch(setAssetApprovalState(assetAddress, newApprovalState));

                if(newApprovalState === assetApprovalState.PENDING_ADMIN_DATA_APPROVAL) {
                    const currentState = store.getState();
                    const currentUser = currentState.UIstate.currentUser;
                    
                    if(currentUser && currentUser.isAdmin) {
                        createUserAdminApprovalEvents(currentState.AssetState.unapprovedAssets[assetAddress], currentUser, web3);
                    }
                }

                if(newApprovalState === assetApprovalState.LIVE) {

                    const stateBaseAsset = store.getState().AssetState.allAssets[assetAddress];

                    store.dispatch(removeUnapprovedAsset(assetAddress));
                    // console.log("Loading asset from this baseAsset in state", stateBaseAsset);

                    loadAllContractData(stateBaseAsset, web3).then(loadedAsset => {
                        // console.log("Loaded approved asset", loadedAsset);
                        setupEventsForLiveAsset(loadedAsset);
                        store.dispatch(addLoadedAsset(loadedAsset));
                    })
                }
            });

            startPlatformEvent(stateChangeEvent, baseAsset.assetContract.events.StateChanged);
            // console.log("Platform event added for asset ", store.getState().PlatformEvent.events);
        }
    });
}

export async function setupEventsForAllLiveAssets(assets, web3) {

    const platformTokenContract = await getBitCarContract(web3);

    assets.map(asset => setupEventsForLiveAsset(asset, platformTokenContract));
}

async function setupEventsForLiveAsset(asset, platformTokenContract) {

    let assetPlatformBalance = new BlockchainEvent(`${PLATFORM_EVENT_ASSETBALANCE}${asset.address}`, {filter: {from: asset.address} }
                                , (error, event) => {
                                    // console.log(`Asset transfer event for ${asset.tokenCode} ${asset.address}`, event.returnValues);
                                    loadCurrentAssetBalance(asset, platformTokenContract);
                                });
    let assetEscrowBalance = new BlockchainEvent(`${PLATFORM_EVENT_ESCROWBALANCE}${asset.address}`, {filter: {to: asset.beeContract.address} }
    , (error, event) => {
        // console.log(`Asset transfer event for ${asset.tokenCode} ${asset.address}`, event.returnValues);
        loadCurrentAssetBalance(asset, platformTokenContract);
    });
    startPlatformEvent(assetPlatformBalance, asset.assetTokenContract.events.Transfer);
    startPlatformEvent(assetEscrowBalance, platformTokenContract.events.Transfer);
    loadCurrentAssetBalance(asset, platformTokenContract);
}