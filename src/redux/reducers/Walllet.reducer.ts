import { createAction, handleActions } from "redux-actions";
import { applyPenders } from "redux-pender";

export interface WALLET {
  info: WALLET_INFO;
}
export interface BALANCES {
  klay: number;
}
export interface WALLET_INFO {
  type?: "none" | "kaikas";
  address?: string;
  balances?: BALANCES;
  expire?: null | number; //null 이면 무제한
  network?: number;
}
const initialState: WALLET = {
  info: {
    type: "none",
    address: "",
    balances: {
      klay: 0,
    },
    expire: null,
    network: 0,
  },
};

const SET_INFO = "WALLET/SET_INFO";
const RESET_WALLET = "WALLET/RESET_WALLET";

export const setInfo = createAction(SET_INFO, (data: WALLET_INFO) => data);
export const resetWallet = createAction(RESET_WALLET);

const reducer = handleActions(
  {
    [SET_INFO]: (state, action) => {
      return {
        ...state,
        info: {
          ...state.info,
          ...action.payload,
        },
      };
    },
    [RESET_WALLET]: (state, action) => {
      return { ...initialState };
    },
  },
  initialState
);

export default applyPenders(reducer, []);
