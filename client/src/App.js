import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";

import "./App.css";

class App extends Component {
  
  constructor(props) {
    super(props);

    this.state = { storageValue: 0, web3: null, accounts: null, contract: null };
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const Contract = truffleContract(SimpleStorageContract);
      Contract.setProvider(web3.currentProvider);
      if (typeof Contract.currentProvider.sendAsync !== "function") {
        Contract.currentProvider.sendAsync = function() {
            return Contract.currentProvider.send.apply(
                Contract.currentProvider, arguments
            );
        };
      }
      const instance = await Contract.deployed();

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
      this.addEventListener(this);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  runExample = async () => {
    const { accounts, contract } = this.state;

    // Stores a given value, 5 by default.
    await contract.set(5, { from: accounts[0] });

    // Get the value from the contract to prove it worked.
    const response = await contract.get();

    // Update state with the result.
    this.setState({ storageValue: response.toNumber() });
  };

  updateValue = async(val) => {
    try {
      const { accounts, contract } = this.state;
      const result = await contract.set(val, { from: accounts[0] });
      console.log("set receipt status", result.receipt.status);
      if (parseInt(result.receipt.status) !== 1) {
        throw new Error("Failed to set value");
      }
      // this.setState({ storageValue: result.logs[0].args.value.toString(10)});
      // We skip using the event here because we add a listener.
    } catch(error) {
      alert(`Failed to set value to $val`);
      console.log(error);
    }
  };

  addEventListener(component) {
    const updateEvent = this.state.contract.LogChanged();
    updateEvent.watch(function(err, result) {
      if (err) {
        console.log(err);
        return;
      }
      console.log("Changed event received, value: " + result.args.value.toString(10));
      component.setState({ storageValue: result.args.value.toString(10)});
    })
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored value of 5 (by default).
        </p>
        <p>
          Try changing the value stored on <strong>line 40</strong> of App.js.
        </p>
        <div>The stored value is: {this.state.storageValue}</div>
        <button className="changeButton" onClick={ () => this.updateValue(2) }>Change value</button>
      </div>
    );
  }
}

export default App;
