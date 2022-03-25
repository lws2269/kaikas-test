import Wallet from "./reducers/Walllet.reducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  Wallet,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
