import { combineReducers } from "redux";
import firebaseReducer from "./firebaseReducer";
import newsReducer from "./newsReducer";
import currentPriceReducer from "./currentPriceReducer";
import graphReducer from "./graphReducer";
import coinbaseReducer from "./coinbaseReducer";

const rootReducer = combineReducers({
    firebase: firebaseReducer,
    news: newsReducer,
    prices: currentPriceReducer,
    graphData: graphReducer,
    coinbase: coinbaseReducer
});

export default rootReducer;