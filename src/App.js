import "./App.css";

import web3 from "./web3";
import lottery from "./lottery";
import React, { useState, useEffect } from "react";

function App() {
  console.log(web3.version);
  const [manager, managerState] = useState("");
  const [players, playersState] = useState([]);
  const [balance, balanceState] = useState("");
  const [value, valueState] = useState("");
  const [message, messageState] = useState("Waiting on transaction success..");

  useEffect(() => {
    const getStatus = async () => {
      let manager = await lottery.methods.manager().call();
      let players = await lottery.methods.getPlayers().call();
      let balance = await web3.eth.getBalance(lottery.options.address);

      managerState(manager);
      playersState(players);
      balanceState(balance);

      console.log(web3.utils.fromWei(balance, "ether"));
    };

    getStatus();
  }, []);
  let onSubmit = async (e) => {
    e.preventDefault();
    const accounts = await web3.eth.getAccounts();
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, "ether"),
    });
    messageState("You have been entered!!");
  };
  let onClick = async () => {
    const accounts = await web3.eth.getAccounts();
    messageState("Waiting on transaction success...");
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    const winner = await lottery.methods.getWinner().call();
    console.log(winner + "winner");
    messageState(winner + " has won " + balance + " ether.");
  };
  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>
        This contract is managed by {manager}. <br /> <br />
        There are currently {players.length} people entered, competing to win{" "}
        {web3.utils.fromWei(balance, "ether")} ether.
      </p>
      <hr />
      <form onSubmit={onSubmit}>
        <h4>Want to try your luck?</h4>
        <div>
          <label>Amount of ether to enter</label>
          <input value={value} onChange={(e) => valueState(e.target.value)} />
          <p>{value}</p>
        </div>
        <button>Enter</button>
      </form>
      <hr />

      <h4>Ready to pick a winner?</h4>
      <button onClick={onClick}>Pick a winner!</button>
      <hr />
      <h1>{message}</h1>
    </div>
  );
}
(async () => {
  let a = await web3.eth.getAccounts();
  console.log(a);
})();
export default App;
