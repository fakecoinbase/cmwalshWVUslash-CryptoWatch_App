import moment from "moment";

const initData = {
    cbHoldings: [],
    additionalHoldings: [],
    holdingsMap: undefined,
    loadingHoldings: true,
    lastUpdated: moment(),
    holdingsList: [],
    accessToken: null,
    coinbaseAuth: false
}

const coinbaseReducer = ( state = initData, action: any ) => {
switch (action.type) {
    case 'SET_COINBASE_HOLDINGS':
        return {
            ...state,
            cbHoldings: action.cbHoldings,
            lastUpdated: moment()
        }
    case 'SET_ADDITIONAL_HOLDINGS':
        return {
            ...state,
            additionalHoldings: action.additionalHoldings,
            lastUpdated: moment()
        }
    case 'SET_HOLDINGS_MAP':
        return {
            ...state,
            holdingsMap: action.holdingsMap
        }
    case 'SET_LOADING_HOLDINGS':
        return {
            ...state,
            loadingHoldings: action.loadingHoldings
        }
    case 'SET_HOLDINGS_LIST':
            return {
                ...state,
                holdingsList: action.holdingsList
            }
    case 'SET_ACCESS_TOKEN':
            return {
                ...state,
                accessToken: action.accessToken
            }
    case 'SET_COINBASE_AUTH':
            return {
                ...state,
                coinbaseAuth: action.coinbaseAuth
            }
    default:
        return {
            ...state
        }
    }
}

export default coinbaseReducer;