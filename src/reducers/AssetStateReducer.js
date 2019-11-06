import * as _ from 'lodash';
import { SET_ASSET_CONTRACTS, SET_ALL_ASSETS, SET_ALL_ASSETS_APPROVALSTATE, ADD_LOADED_ASSET, SET_ALL_LOADED_ASSETS,
        ADD_UNAPPROVED_ASSET, REMOVE_UNAPPROVED_ASSET, SET_ALL_UNAPPROVED_ASSETS, UPDATE_UNAPPROVED_ASSET,
        SET_UNAPPROVED_ASSET_ADMIN_APPROVAL_PROGRESS, SET_UNAPPROVED_ASSET_FEEMANAGER_PROGRESS } from '../actions';

  const initialState = {
    assetContracts: null,
    allAssets: null,
    loadedAssets: null,
    unapprovedAssets: null
  };
  
  export const AssetStateReducer = (state = initialState, action) => {
    switch (action.type) {
  
      case SET_ASSET_CONTRACTS:
        return { ...state, assetContracts: action.assetContracts}

      // *** All Assets ***

      case SET_ALL_ASSETS:
        return { ...state, allAssets: action.allAssets }

      case SET_ALL_ASSETS_APPROVALSTATE:
      {
        console.log(`Set approval state for ${action.assetContractAddress} to ${action.approvalState} for state object`, state.allAssets[action.assetContractAddress]);
        const numberApprovalState = parseInt(action.approvalState);
          return {...state, allAssets: {...state.allAssets, [action.assetContractAddress]: {...state.allAssets[action.assetContractAddress], approvalState: numberApprovalState}},
          unapprovedAssets: !state.unapprovedAssets ? state.unapprovedAssets : {...state.unapprovedAssets, [action.assetContractAddress]: {...state.unapprovedAssets[action.assetContractAddress], approvalState: numberApprovalState}}
        }
      }

      // *** Loaded Assets ***
  
      case ADD_LOADED_ASSET:
        return {
          ...state, loadedAssets: {
              ...state.loadedAssets, [action.asset.address]: action.asset
          }
        };

      case SET_ALL_LOADED_ASSETS:
        return { ...state, loadedAssets: action.loadedAssets }


      // *** Unapproved Assets ***

      case ADD_UNAPPROVED_ASSET:
      {
        
        if(!state.unapprovedAssets) {
          return {...state};
        }

        return {
          ...state, unapprovedAssets: {
              ...state.unapprovedAssets, [action.unapprovedAsset.address]: action.unapprovedAsset
          }
        };
      }

      case REMOVE_UNAPPROVED_ASSET:
      {
        
        if(!state.unapprovedAssets) {
          return {...state};
        }
      
        return { ...state, unapprovedAssets: _.keyBy(_.filter(state.unapprovedAssets, (unapprovedAsset) => { return unapprovedAsset.address !== action.address; }), 'address') }
      }

      case SET_UNAPPROVED_ASSET_ADMIN_APPROVAL_PROGRESS:
      {
        console.log(`Set admin fee manager progress for ${action.assetContractAddress} to ${action.feeManagerProgress} for state object`, state.allAssets[action.assetContractAddress]);
        const numberFeeManagerProgress = parseInt(action.feeManagerProgress);
          return {...state, unapprovedAssets: !state.unapprovedAssets ? state.unapprovedAssets : {...state.unapprovedAssets, [action.assetContractAddress]: {...state.unapprovedAssets[action.assetContractAddress], adminFeeManagerProgress: numberFeeManagerProgress}}
        
        }
      }
      
      case SET_UNAPPROVED_ASSET_FEEMANAGER_PROGRESS:
      {
        console.log(`Set admin approval progress for ${action.assetContractAddress} to ${action.adminApprovalProgress} for state object`, state.allAssets[action.assetContractAddress]);
        const numberAdminApprovalProgress = parseInt(action.adminApprovalProgress);
          return {...state, unapprovedAssets: !state.unapprovedAssets ? state.unapprovedAssets : {...state.unapprovedAssets, [action.assetContractAddress]: {...state.unapprovedAssets[action.assetContractAddress], adminApprovalProgress: numberAdminApprovalProgress}}
        
        }
      }

      case UPDATE_UNAPPROVED_ASSET:
      {
        // console.log("reducer hit for UPDATE_UNAPPROVED_ASSET");
        // try {
        //   const currentAsset = state.unapprovedAssets[action.unapprovedAsset.address];
        //   console.log(`update received for unapproved asset. current admin approval progress:`, currentAsset.adminApprovalProgress);
        //   console.log(`new:`, action.unapprovedAsset.adminApprovalProgress);
        // } catch(error) {
        //   console.error("error while showing information", error);
        // }
          return {
              ...state, unapprovedAssets: {
                  ...state.unapprovedAssets, [action.unapprovedAsset.address]: action.unapprovedAsset
              }
          };
      }

      case SET_ALL_UNAPPROVED_ASSETS:
        return { ...state, unapprovedAssets: action.unapprovedAssets }
  
      default:
        return state;
    }
  };
