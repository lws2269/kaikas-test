import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setInfo, resetWallet } from "./redux/reducers/Walllet.reducer";
import { RootState } from "./redux/connectors.redux";
import "./App.css";
import Caver from "caver-js";

const App = () => {
  const { caver, klaytn } = window;
  let dispatch = useDispatch();
  const wallet = useSelector((store: RootState) => store.Wallet);
  const setAccountInfo = async () => {
    if (klaytn === undefined) {
      dispatch(resetWallet());
      return;
    }
    //디코 코드
    // window.location.replace('/?code=' + dcCode);

    const address = klaytn.selectedAddress;
    const balance = await caver.klay.getBalance(address);
    const klay = caver.utils.fromPeb(balance, "KLAY");
    console.log(klay);
    if (address) {
      dispatch(
        setInfo({
          type: "kaikas",
          address,
          balances: { klay: klay },
          expire: 0,
        })
      );
    } else {
      dispatch(resetWallet());
    }
  };
  const handleKaiKasExtConnect = async () => {
    // http://localhost:3000/?code=zKK12UNletEe9mAG2VfI5gvpo3Udc0
    if (klaytn) {
      await klaytn.enable();

      // dispatch(autologin(true));
      sessionStorage.removeItem("klmin_lt");
      // window.toast('success', Lang.suc_msg_sucs_connect_kaikas);
      await disableLoadNetworkInfo();
      await disableLoadAccountInfo();

      await enableLoadNetworkInfo();
      await enableLoadAccountInfo();
    } else {
      // Kaikas가 설치되어 있지 않을 때...
      //window?.toast('error', Lang.err_msg_need_kaikas);
      window.open(
        "https://chrome.google.com/webstore/detail/kaikas/jblndlipeogpafnldhgmapagcccfchpi"
      );
      console.error(
        "Non-Kaikas browser detected. You should consider trying Kaikas!"
      );
    }
  };
  /**
   * Kaikas 계정 변경 이밴트 핸들러
   */

  const enableLoadAccountInfo = async () => {
    if (klaytn) {
      try {
        await klaytn.enable();
        console.log("enable loadAccountInfo");
        await setAccountInfo();
        klaytn.on("accountsChanged", () => setAccountInfo());
      } catch (error) {
        console.log("User denied account access", error);
      }
    } else {
      console.log(
        "Non-Kaikas browser detected. You should consider trying Kaikas!"
      );
    }
  };

  /**
   * Kaikas 네트워크 변경 이밴트 핸들러
   */
  const enableLoadNetworkInfo = async () => {
    if (klaytn) {
      try {
        await klaytn.enable();
        //console.log('enable setNetworkInfo');

        const network = klaytn.networkVersion;
        if (network === "1001") {
          console.log("Kaikas Network Version is Baobab Test Network");
          return;
        }
      } catch (error) {
        console.log("User denied account access");
      }
      klaytn.on("networkChanged", () => enableLoadNetworkInfo());
    } else {
      console.log(
        "Non-Kaikas browser detected. You should consider trying Kaikas!"
      );
    }
  };
  const disableLoadAccountInfo = async () => {
    if (klaytn)
      klaytn.on("accountsChanged", () =>
        console.log("disable LoadAccountInfo")
      );
  };
  const disableLoadNetworkInfo = async () => {
    if (klaytn)
      klaytn.on("networkChanged", () => console.log("disable LoadNetworkInfo"));
  };
  useEffect(() => {
    klaytn._kaikas
      .isUnlocked()
      .then((res) => {
        if (!res) {
          //Kaikas Extension  상태가 Unlock 일떄
          dispatch(resetWallet());
        } else {
          //새로고침 후 지갑 정보 저장 이밴트 핸들러 시작
          // enablePrevent();
          enableLoadNetworkInfo();
          enableLoadAccountInfo();
        }
      })
      .catch((err) => {
        console.log(wallet, err);
      });
    handleKaiKasExtConnect();
    //새로고침 후 지갑 정보 저장 이밴트 핸들러 종료
    return () => {
      console.log("disable Restore Wallat Data");
      disableLoadNetworkInfo();
      disableLoadAccountInfo();
      // disablePrevent();
    };
  }, []);
  return <div className="App"></div>;
};

export default App;
