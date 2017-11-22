import Communicator, {CommEvent, CommRole} from "./Communicator";
import Tab = chrome.tabs.Tab;
import TabChangeInfo = chrome.tabs.TabChangeInfo;
import {log} from "./Logger";

let comm = new Communicator(CommRole.Manager)

comm.on(CommEvent.PING, (event, data, sender, respond) => {respond("pong")})

/*
chrome.tabs.onCreated.addListener(function (tab:Tab) {
  if (tab) {
    log('tab created')
    chrome.tabs.executeScript({
      file: 'ExtraJS.Client.js'
    });
  }
})
*/

chrome.tabs.onUpdated.addListener(function (tabId:number, changeInfo:TabChangeInfo, tab:Tab) {
  if (changeInfo.status === 'loading') {
    log('tab updated', changeInfo)
    chrome.tabs.executeScript({
      file: 'ExtraJS.Client.js'
    });
  }
})

comm.on(CommEvent.REQUEST_CODE_TO_INJECT, (event, data, sender, respond) => {
  log('code request from', sender)

})
