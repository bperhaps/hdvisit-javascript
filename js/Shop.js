import {web3} from "./Web3Connector.js";
import Transaction from "ethereumjs-tx"

"use strict"

class Shop {

  constructor(address, publicKey, privateKey) {
    this._address = address;
    this._publicKey = publicKey;
    this._privateKey = privateKey;
  }

  async visit(customersSerializedTx, customerAddress) {
    await this._sendEther(customerAddress);
    let receipt = await web3.eth.sendSignedTransaction("0x" + customersSerializedTx.toString("hex"))
    return receipt;
  }

  async _sendEther(customerAddress) {
    let rawTx = {
      nonce : await web3.eth.getTransactionCount(this._address),
      from : this._address,
      to : this._address,
      value : web3.utils.toHex(web3.utils.toWei("1000", "wei")),
      gasLimit : web3.utils.toHex("21000"),
      gasPrice : web3.utils.toHex(await web3.eth.getGasPrice())
    }

    let privKey = Buffer.from("4c0883a69102937d6231471b5dbb6204fe5129617082792ae468d01a3f362318", "hex");

    let tx = new Transaction.Transaction(rawTx)
    tx.sign(privKey);
    let serializedTx = tx.serialize();

    let receipt = await web3.eth.sendSignedTransaction("0x" + serializedTx.toString("hex"));
    return receipt;
  }

}

let x = new Shop("0xdfc9f045eb01ad179b5e87799ea7c4f350d41635", "0xdfc9f045eb01ad179b5e87799ea7c4f350d41635");
x.visit().then(r => console.log)