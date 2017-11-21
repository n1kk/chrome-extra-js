import Communicator from "./Communicator";

console.log("manager runs 2")

let comm = new Communicator({client: false})

comm.on("ping", (event, data, sender, respond) => {
  console.log('ping requested by', sender)
  respond("pong")
})
