export default class Injector {

  readonly verbose:boolean

  constructor(verbose:boolean = false) {
    this.verbose = verbose
  }

  public injectCode(code:string) {
    return new Promise((resolve, reject) => {
      if (!document)
        reject("No document found")
      else if (!document.body)
        reject("No document.body found")
      else if (!document.body.appendChild)
        reject("No appendChild found on document.body")
      else {
        const script = document.createElement('script');
        script.async = true;
        script.text = code;
        // try {
          document.body.appendChild(script);
          resolve()
        // } catch (e) {
        //   console.error(e)
        //   resolve(e)
        // }
      }
    }).then(() => {
      this.verbose && console.log(`Injection successful`);
    }, (err) => {
      this.verbose && console.error(`Injection failed: ${err}`);
    })
  }

  public injectScript(src) {
    return new Promise((resolve, reject) => {
      if (!document)
        reject("No document found")
      else if (!document.body)
        reject("No document.body found")
      else if (!document.body.appendChild)
        reject("No appendChild found on document.body")
      else {
        const script = document.createElement('script');
        script.async = true;
        script.src = src;
        script.addEventListener('load', resolve);
        script.addEventListener('error', () => reject('Error loading script.'));
        script.addEventListener('abort', () => reject('Script loading aborted.'));
        document.head.appendChild(script);
      }
    }).then(() => {
      this.verbose && console.log(`Injection successful`);
    }, (err) => {
      this.verbose && console.error(`Injection failed: ${err}`);
    })
  }

}
