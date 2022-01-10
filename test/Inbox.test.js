const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
// UPDATE THESE TWO LINES RIGHT HERE!!!!! <-----------------
const provider = ganache.provider();
const web3 = new Web3(provider);
const { interface, bytecode } = require("../compile");

let accounts;
let inbox;
let INITIAL_STRING = "Hi there!";
let UPDATED_STRING = "Bye there !";
beforeEach(async () => {
  //get a list of accounts
  accounts = await web3.eth.getAccounts();
  //use one of them to deploy the contract
  inbox = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({
      data: bytecode,
      //arguments the intitial arguments passed to the constructor function of the contract
      arguments: [INITIAL_STRING],
    })
    .send({ from: accounts[0], gas: "1000000" });
  // ADD THIS ONE LINE RIGHT HERE!!!!! <---------------------
  inbox.setProvider(provider);
});

describe("Inbox", () => {
  it("have accounts", () => {
    assert.ok(inbox.options.address);
  });
  it("first Initialized message", async () => {
    const message = await inbox.methods.message().call();
    assert.equal(message, INITIAL_STRING);
  });
  it("can change the message", async () => {
    const receiptHash = await inbox.methods
      .setMessage(UPDATED_STRING)
      .send({ from: accounts[0] });
    const message = await inbox.methods.message().call();
    assert.equal(message, UPDATED_STRING);
  });
});
