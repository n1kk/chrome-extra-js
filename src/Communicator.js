export default class Comunicator {
  
  constructor(opts) {
    this.client = !!opts.client
  }
  
  on(event, cb) {
    let listeners = this.listeners || (this.listeners = {})
    let callbacks = listeners[event] || (listeners[event] = [])
    
    if (callbacks.contains())
    
  }
}
