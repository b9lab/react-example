# React example

Slight variation on `truffle unbox react`.

* Simple event added to smart contract.
* Eth port changed to `8545` in `getWeb3`.
* Replaced `{ storageValue: result.c[0] }` with `{ storageValue: result.toString(10) }`.
* Added 2 state variables directly in the component.
* Added a function to change the stored value.
* Added a function to update the state on event.
* Added a button that will change the stored value.

## Run it

Start an Ethereum node listening on port 8545. Then, with Truffle v4.0.6:

```sh
$ truffle migrate

$ npm run start
```