import axios from 'axios';

const options = {
    headers: {}
  };

export const getCurrentPrices2 = () => {
    console.log("TEST1")
    axios.get("https://mighty-dawn-74394.herokuapp.com//top")
    .then(response => {
        updateCurrentPrices(response.data.data);
        // console.log(response.data.data)
        // setAuthToken(localStorage.getItem("jwtToken"));
    })
    .catch(err => console.log(err));
};

export function updateCurrentPrices(prices: any) {
    return {
        type: 'UPDATE_CURRENT_PRICES',
        prices: prices
    }
}


export const setFilteredTickers = (filteredTickers: any[]) => ({
    type: 'SET_FILTERED_TICKERS',
    filteredTickers
  } as const);
  