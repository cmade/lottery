import "./App.css";

import web3 from "./web3";
import lottery from "./lottery";
import React, { useState, useEffect } from "react";

function App() {
  console.log(web3.version);
  const [manager, managerState] = useState("");
  const [players, playersState] = useState([]);
  const [balance, balanceState] = useState("");
  const [state, setState] = useState("");

  useEffect(() => {
    const getStatus = async () => {
      let manager = await lottery.methods.manager().call();
      let players = await lottery.methods.getPlayers().call();
      let balance = await web3.eth.getBalance(lottery.options.address);
      console.log(typeof balance);
      managerState(manager);
      playersState(players);
      balanceState(balance);
      console.log(web3.utils.fromWei(balance, "ether"));
    };

    getStatus();
  }, []);
  onSubmit(){

  }
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
          <input value={state} onChange={(e) => setState(e.target.value)} />
          <p>{state}</p>
        </div>
        <button>Enter</button>
      </form>
    </div>
  );
}
(async () => {
  let a = await web3.eth.getAccounts();
  console.log(a);
})();
export default App;
