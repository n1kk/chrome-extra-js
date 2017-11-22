import Communicator, {CommEvent, CommRole} from "./Communicator";
import Injector from "./Injector";

let comm = new Communicator(CommRole.Client)
let injector = new Injector()

comm.on(CommEvent.PING, (event, data, sender, respond) => {respond("pong")})

comm.on(CommEvent.INJECT_CODE_COMMAND, (event, data, sender, respond) => {
  injector.inject(data.code, data.deps)
    .then(res => {
      respond({success: true, result: res})
    }, err => {
      respond({success: false, error: err})
    })
})

comm.on(CommEvent.DETACH, () => comm.detach())

comm.send(CommEvent.REQUEST_CODE_TO_INJECT, null,(response) => {
  if (response)
    injector.inject(response.code, response.deps)
})

