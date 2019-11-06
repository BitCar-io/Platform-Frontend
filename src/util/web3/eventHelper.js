import { addPlatformEvent, addProcessedEvent, addUserEvent } from '../../actions';
import store from '../../store';
import * as _ from 'lodash';
import { supportsEvents } from '../../core/web3Providers';

export const USER_EVENT_BITCAR_RECEIVED = 'USER_EVENT_BITCAR_RECEIVED';
export const USER_EVENT_BITCAR_SENT = 'USER_EVENT_BITCAR_SENT';
export const USER_EVENT_ASSETTOKEN_RECEIVED = 'USER_EVENT_ASSETTOKEN_RECEIVED';
export const USER_EVENT_ASSETTOKEN_SENT = 'USER_EVENT_ASSETTOKEN_SENT';
export const USER_EVENT_AGENTASSET_CREATE = 'USER_EVENT_AGENTASSET_CREATE';

export const USER_EVENT_ADMIN_CREATE_TOKENCONTRACT = 'USER_EVENT_ADMIN_CREATE_TOKENCONTRACT';
export const USER_EVENT_ADMIN_CREATE_FEEMANAGER = 'USER_EVENT_ADMIN_CREATE_FEEMANAGER';
export const USER_EVENT_ADMIN_CREATE_WHITELIST = 'USER_EVENT_ADMIN_CREATE_WHITELIST';
export const USER_EVENT_ADMIN_SET_PURCHASE_PERCENT = 'USER_EVENT_ADMIN_SET_PURCHASE_PERCENT';

export const PLATFORM_EVENT_TICKER_RATECHANGE = 'PLATFORM_EVENT_TICKER_RATECHANGE';
export const PLATFORM_EVENT_ASSETBALANCE = 'PLATFORM_EVENT_ASSETBALANCE';
export const PLATFORM_EVENT_ESCROWBALANCE = 'PLATFORM_EVENT_ESCROWBALANCE';
export const PLATFORM_EVENT_ASSET_STATECHANGE = 'PLATFORM_EVENT_ASSET_STATECHANGE';

export class BlockchainEvent {
    eventType;
    callbackOnEvent;
    eventArguments;

    /* 
    eventType should be created as a constant at the top of this file

    eventArguments are passed to the blockchain event setup and should be provided as an object, as outlined in the web3 documentation
        (https://web3js.readthedocs.io/en/1.0/web3-eth-contract.html#events)
        e.g. {filter: {from: addressValue}, }
        If you do not want to pass anything just provide null or defined and it will default to pass in an empty object
    
    callbackOnEvent is the function to call when the blockchain event occurs, this MUST have no parameters OR utilise those outlined in the documentation
        e.g. function(error, event){ console.log(event); }
    */
    constructor(eventType, eventArguments, callbackOnEvent) {
        this.eventType = eventType;
        this.eventArguments = eventArguments ? eventArguments : {};
        this.callbackOnEvent = callbackOnEvent;
    }
}

// blockChainEvent should be of class type above
// contractEventFunction should be in the format of Contract.events.eventname
export function startUserEvent(blockchainEvent, contractEventFunction) {

    const state = store.getState();

    if(!canUseEvents(state.UIstate.web3)) {
        return;
    }

    // console.log("Initialising startUserEvent for ", blockchainEvent);

    let existingEvent = state.UserState.events[blockchainEvent.eventType];

    if(existingEvent !== undefined) {
        // console.log("Event Exists!");
        return existingEvent;
    }

    let newEvent = contractEventFunction(blockchainEvent.eventArguments, (error, event) => callbackWrapper(error, event, blockchainEvent));
    store.dispatch(addUserEvent(blockchainEvent.eventType, newEvent));

    return newEvent;
}

export function startPlatformEvent(blockchainEvent, contractEventFunction) {

    const state = store.getState();

    if(!canUseEvents(state.UIstate.web3)) {
        return;
    }

    let existingEvent = state.PlatformEvent.events[blockchainEvent.eventType];

    if(existingEvent !== undefined) {
        return existingEvent;
    }

    //console.log("BC Event registered", blockchainEvent);

    let newEvent = contractEventFunction(blockchainEvent.eventArguments, (error, event) => callbackWrapper(error, event, blockchainEvent));
    store.dispatch(addPlatformEvent(blockchainEvent.eventType, newEvent));

    return newEvent;
}

// This wrapper prevents duplicate firing of callbacks, seems to be related to the race condition bug in web3
function callbackWrapper(error, event, blockchainEvent) {

    if(!blockchainEvent) {
        console.error('blockchainEvent must be provided! - Developer ERROR!');
        return;
    }

    if(!event) {
        console.error('Error with event callback for blockchain event:', blockchainEvent);
        return;
    }

    const callbackOnEvent = blockchainEvent.callbackOnEvent;
    const eventId = `${blockchainEvent.eventType}_${event.id}`;

    if(store.getState().PlatformEvent.processedEvents.indexOf(eventId) >= 0) {
        return;
    }

    store.dispatch(addProcessedEvent(eventId));

    callbackOnEvent(error, event);
}

export function startMultipleUserEvents(multipleEvents, contractEventFunction) {
    return startMultipleEvents(multipleEvents, contractEventFunction, startUserEvent);
}

export function startMultiplePlatformEvents(multipleEvents, contractEventFunction) {
    return startMultipleEvents(multipleEvents, contractEventFunction, startPlatformEvent);
}

export function unsubscribeUserEvents(filterFunction) {

    // console.log("unsubscribed from user events");
    let userEvents = store.getState().UserState.events;

    if(!userEvents) {
        return;
    }

    if(filterFunction) {
        userEvents = _.filter(userEvents, filterFunction);
    }

    // console.log("Events being removed", userEvents);

    for (let key in userEvents) {
        userEvents[key].unsubscribe();
    }
}

function startMultipleEvents(multipleEvents, contractEventFunction, startingEvent) {

    if(!canUseEvents(store.getState().UIstate.web3)) {
        return;
    }

    let firstEvent = multipleEvents[0];
    
    startingEvent(firstEvent, contractEventFunction);

    for (let index = 1; index < multipleEvents.length; index++) {
        let event = multipleEvents[index];

        // TODO: this is UGLY but required to prevent a current race condition within Web3
        // each additional event has to wait 300ms after the last event was created
        setTimeout(() => {
            startingEvent(event, contractEventFunction);
        }, index * 300);
    }
}

function canUseEvents(web3) {
    if(!supportsEvents(web3)) {
        console.warn("Current web3 provider does not support events - functionality will be reduced. Please switch to a web-socket provider or MetaMask.");
        return false;
    }

    return true;
}