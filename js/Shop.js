import {web3} from "./Web3Connector.js";
import {createSignedTransaction} from "./transactionController.js";
import ethUtil from "ethereumjs-util";
import VisitedContract from "./VisitedContract.js";

"use strict"

export class Shop {

  constructor(key, shopName, x, y) {
    this._address = "0x" + ethUtil.pubToAddress(key._publicKey, true).toString("hex");
    this._publicKey = key._publicKey;
    this._privateKey = key._privateKey;
    this._shopName = shopName;
    this._x = x;
    this._y = y;

    this.contractAddress = "";
  }

  async visit(customerInfo) {
    await this._sendEther(customerInfo["address"]);
    let receipt = await VisitedContract.visit(
        "0x" + customerInfo["serializedTransaction"].toString("hex")
    );
    return receipt;
  }

  async _sendEther(customerAddress) {
    let rawTx = {
      nonce : await web3.eth.getTransactionCount(this._address),
      from : this._address,
      to : customerAddress,
      value : web3.utils.toHex(web3.utils.toWei("1", "gwei")),
      gasLimit : web3.utils.toHex("21000"),
      gasPrice : web3.utils.toHex(await web3.eth.getGasPrice())
    }

    let serializedTx = createSignedTransaction(rawTx, Buffer.from(this._privateKey, "hex"));

    let receipt = await web3.eth.sendSignedTransaction("0x" + serializedTx.toString("hex"));
    return receipt;
  }

}

/*
export async function shopGenerater() {
  let mnemonic = bip39.generateMnemonic();

  let seed = await Bip39.mnemonicToSeed(this._mnemonic);
  let hdwallet = HdKey.fromMasterSeed(seed);
  let key = hdwallet.derive("m/44'/60'/0'/0/0");

  let privateKey = key._privateKey;
  let publicKey= key._publicKey;

  let contract = await new web3.eth.Contract(VisitedContract.abi, VisitedContract.address);
  contract.deploy({

  })
  let data =contract.encodeABI();
  new Shop()

}*/
