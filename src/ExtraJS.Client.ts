import Communicator from "./Communicator";
import Injector from "./Injector";

let comm = new Communicator({client: true})
let injector = new Injector(true)

function init() {
  //requestContentToRun()
  injector.injectScript("https://cdnjs.cloudflare.com/ajax/libs/three.js/88/three.js").then(()=>{
    injector.injectCode("console.log(THREE)")
  })

}

init()

function requestContentToRun() {
  comm.send("request_for_code_to_run", null,(response) => {
    //console.log("got respose: ", response)
    if (response && response.code) {
      injector.injectCode(response.code)
    }
  })
}

