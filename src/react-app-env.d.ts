// import CaverModule from '@/helpers/caverjs.helper';
import Caver from "caver-js";

declare global {
  interface Window {
    klaytn?: any;
    caver?: any;
  }
}

window.caver = new Caver(window.klaytn);
