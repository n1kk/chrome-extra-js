import {error, log} from "./Logger";

export default class Injector {

  constructor() {
  }

  public inject(code:string, ...deps:string[]) {
    if (deps && deps.length)
      return this.injectScript(deps).then(() => this.injectCode(code))
    else
      return this.injectCode(code)
  }

  public injectCode(code:string) {
    if (!code)
      return Promise.resolve([])
    return new Promise((resolve, reject) => {
      let body = document && document.body || document.getElementsByTagName('body')[0]
      if (!body)
        reject("No document.body found")
      else {
        const script = document.createElement('script')
        script.text = code
        // try {
          document.body.appendChild(script)
          resolve()
        // } catch (e) {
        //   console.error(e)
        //   resolve(e)
        // }
      }
    }).then((res) => {
      log(`Code execution successful`)
      return res
    }, (err) => {
      error(`Injection failed: ${err}`)
      return Promise.reject(err)
    })
  }

  public injectScript(src:string[]|string, async = false, force = false) {
    if (!src || src.length === 0)
      return Promise.resolve([])
    let sources = Array.isArray(src) ? src : [src]
    return new Promise((resolve, reject) => {
      let head = document && document.head || document.getElementsByTagName('head')[0]
      if (!head)
        reject("No document.head found")
      else {
        let initiated = 0, loaded:any[] = [], errored:any[] = [],
          loadDone = () => {
            if (--initiated === 0) {
              if (errored.length)
                reject(errored)
              else
                resolve(loaded)
            }
          }
        sources.forEach(link => {
          if (!force) { // check if resource with same link already exists
            const scripts = document.getElementsByTagName('script')
            for (let i = 0; i < scripts.length; i++) {
              let s = scripts[i];
              if (s.src && s.src === link)
                return
            }
          }
          initiated++
          const script = document.createElement('script')
          script.async = async
          script.src = link
          script.addEventListener('load', e => { loaded.push(e) && loadDone() })
          script.addEventListener('error', e => { errored.push(e) && loadDone() })
          script.addEventListener('abort', e => { errored.push(e) && loadDone() })
          document.head.appendChild(script)
        })
      }
    }).then((res) => {
      log(`Script injection successful: ${(res as Event[]).map(e => (e.target as HTMLScriptElement).src)}`)
      return res
    }, (err) => {
      error(`Script injection failed: ${(err as Event[]).map(e => (e.target as HTMLScriptElement).src)}`)
      return Promise.reject(err)
    })
  }

}
