import MessageSender = chrome.runtime.MessageSender;

export class CommunicatorOptions {
  client?:boolean
}

export type ListenerCallback = (event:string, data:any, sender:MessageSender, respond:(response:any) => void) => void

export default class Communicator {

  readonly client:boolean
  private listeners:{[eventName:string]: ListenerCallback[]}

  constructor(opts:CommunicatorOptions) {
    this.client = !!opts.client
    chrome.runtime.onMessage.addListener(this.listener.bind(this))
  }

  private listener(request, sender, sendResponse) {
    const fromTab:boolean = !!sender.tab
    if ((fromTab && !this.client) || (!fromTab && this.client)) {
      const event:string = <string>request.event
      if (event) {
        this.notify(event, request.data, sender, sendResponse)
      }
    }
  }

  private notify(event:string, data:any, sender:MessageSender, respond:(response:any) => void) {
    let listeners = this.listeners || (this.listeners = {})
    let callbacks = listeners[event] || (listeners[event] = [])
    callbacks.forEach(cb => cb(event, data, sender, respond))
  }

  public on(event:string, cb:ListenerCallback) {
    let listeners = this.listeners || (this.listeners = {})
    let callbacks = listeners[event] || (listeners[event] = [])
    
    if (callbacks.indexOf(cb)) {
      callbacks.push(cb)
    }
  }

  public send(event:string, data:any, cb?:(response:any) => void) {
    if (this.client)
      this.sendToManager(event, data, cb)
    else
      this.sendToClient(event, data, cb)
  }

  private sendToClient(event:string, data:any, cb?:(response:any) => void) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      let tab = tabs[0]
      if (tabs) {
        let id = tabs[0].id || 0
        if (id > 0)
          chrome.tabs.sendMessage(id, {event: event, data: data}, (response) => cb && cb(response));
      }
    });
  }

  private sendToManager(event:string, data:any, cb?:(response:any) => void) {
    chrome.runtime.sendMessage({event: event, data: data}, (response) => cb && cb(response));
  }
}





