export const setCoinbaseHoldings = (cbHoldings: any) => {
    return { type: 'SET_COINBASE_HOLDINGS', cbHoldings}
  };

export const setAdditionalHoldings = (additionalHoldings: any) => {
    return { type: 'SET_ADDITIONAL_HOLDINGS', additionalHoldings}
};

export const setHoldingsMap = (holdingsMap: any) => {
    return { type: 'SET_HOLDINGS_MAP', holdingsMap}
};

export const setLoadingHoldings = (loading: boolean) => {
    return { type: 'SET_LOADING_HOLDINGS', loading}
}

export const setHoldingsList = (holdingsList: any) => {
    return { type: 'SET_HOLDINGS_LIST', holdingsList}
};

export const setAccessToken = (accessToken: any) => {
    return { type: 'SET_ACCESS_TOKEN', accessToken}
};

export const setCoinbaseAuth = (coinbaseAuth: any) => {
    return { type: 'SET_COINBASE_AUTH', coinbaseAuth}
};

export const setSigningIn = (signingIn: any) => {
    return { type: 'SET_SIGNING_IN', signingIn}
};