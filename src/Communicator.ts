import MessageSender = chrome.runtime.MessageSender;

export class CommunicatorOptions {
  client?:boolean
}

export type ListenerCallback = (event:string, data:any, sender:MessageSender, respond:(response:any) => void) => void

export enum CommEvent {
  REQUEST_CODE_TO_INJECT = "REQUEST_CODE_TO_INJECT", // should be sent by role code when initialised in tab context
  INJECT_CODE_COMMAND = "INJECT_CODE_COMMAND", // should be sent by manager to a tab that code need to be executed on (like active tab)
  PING = "PING", // used to check if other side is ready/active
  DETACH = "DETACH", // used to tell role script to detach listeners to be garbage collected
}

export enum CommRole {
  Client = "Client",
  Manager = "Manager",
  Editor = "Editor",
}

export default class Communicator {

  readonly role:CommRole
  private listeners:{[eventName:string]: Function[]}
  private bindedListener:Function

  constructor(role:CommRole) {
    this.role = role
    chrome.runtime.onMessage.addListener(this.bindedListener = this.listener.bind(this))
  }

  // ------------- P R I V A T E ---------------

  private listener(request, sender, sendResponse) {
    const fromTab:boolean = !!sender.tab
    if ((fromTab && this.role !== CommRole.Client) || (!fromTab && this.role === CommRole.Client)) {
      this.notify(request.event, request.data, sender, sendResponse)
    }
  }

  private notify(event:string, data:any, sender:MessageSender, respond:(response:any) => void) {
    let listeners = this.listeners || (this.listeners = {})
    let callbacks = listeners[event] || (listeners[event] = [])
    callbacks.forEach(cb => cb(event, data, sender, respond))
  }

  private sendToClient(event:CommEvent, data:any, cb?:(response:any) => void) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      let tab = tabs[0]
      if (tabs) {
        let id = tabs[0].id || 0
        if (id > 0)
          chrome.tabs.sendMessage(id, {event: event, data: data}, (response) => cb && cb(response));
      }
    });
  }

  private sendToManager(event:CommEvent, data:any, cb?:(response:any) => any) {
    chrome.runtime.sendMessage({event: event, data: data}, (response) => cb && cb(response));
  }

  // ------------- P U B L I C ---------------

  public on(event:CommEvent, cb:Function) {
    let listeners = this.listeners || (this.listeners = {})
    let callbacks = listeners[event] || (listeners[event] = [])
    let index = callbacks.indexOf(cb)
    if (index === -1) {
      callbacks.push(cb)
    }
  }

  public off(event:CommEvent, cb:Function) {
    let listeners = this.listeners || (this.listeners = {})
    let callbacks = listeners[event] || (listeners[event] = [])
    let index = callbacks.indexOf(cb)
    if (index !== -1) {
      callbacks.splice(index, 1)
    }
  }

  public send(event:CommEvent, data:any, cb?:(response:any) => any) {
    if (this.role !== CommRole.Manager)
      this.sendToManager(event, data, cb)
    else
      this.sendToClient(event, data, cb)
  }

  public detach() {
    chrome.runtime.onMessage.removeListener(<any>(this.bindedListener))
  }

}




