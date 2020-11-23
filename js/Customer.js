import Bip39 from "bip39";
import HdKey from "hdkey";
import ethUtil from "ethereumjs-util";
import Utils from "./HdVisit-Utils.js";
import {web3} from "./Web3Connector.js";
import VisitedContract from "./VisitedContract.js";
import {createSignedTransaction} from "./transactionController.js";

export class Customer {
    static Korea = 0;

    constructor(mnemonic) {
        this._mnemonic = mnemonic;
        this._index = 0;
    }

    async _getKey(date, index) {
        if(date == undefined) date = new Date();
        if(index == undefined) {
            index = this._index;
            this._index++;
        }

        let seed = await Bip39.mnemonicToSeed(this._mnemonic);
        let hdwallet = HdKey.fromMasterSeed(seed);
        let key = hdwallet.derive(
            Utils.makePath(Customer.Korea, date, index)
        );

        return key
    }

    //YYYY-MM-dd
    async getMyPath(date) {
        let path = [];

        for(let i=0;;i++) {
            let key = await this._getKey(new Date(date), i);
            let address = ethUtil.pubToAddress(key._publicKey, true).toString("hex");
            let visited = await VisitedContract.find(address)
            if(visited["0"] == "0x0000000000000000000000000000000000000000") break;
            path.push(visited);
        }

        return path;
    }

    async getDayPath(date) {
        let seed = await Bip39.mnemonicToSeed(this._mnemonic);
        let hdwallet = HdKey.fromMasterSeed(seed);
        let key = hdwallet.derive(
            Utils.makePath(Customer.Korea, new Date(date))
        );

        return key.publicExtendedKey;
    }

    async createMyInfo(shopAddress) {
        let key = await this._getKey();
        console.log("createMyInfo : " + ethUtil.pubToAddress(key._publicKey, true).toString("hex"));
        let rawTransaction = await this._createTransaction(key, shopAddress);
        return {
            "serializedTransaction" :rawTransaction,
            "address" : "0x" + ethUtil.pubToAddress(key._publicKey, true).toString("hex")
        };
    }


    async   _createTransaction(key, shopAddress) {
        let contract = await new web3.eth.Contract(VisitedContract.abi, VisitedContract.address)
            .methods.visit(shopAddress, Utils.timeToSec());
        let data =contract.encodeABI();

        let privKey = Buffer.from(key._privateKey, "hex");
        let address = "0x" + ethUtil.pubToAddress(key._publicKey, true).toString("hex");
        let rawTx = {
            nonce : await web3.eth.getTransactionCount(address),
            from : address,
            to : VisitedContract.address,
            value : 0x00,
            data : data,
            gasLimit : await contract.estimateGas(),
            gasPrice : web3.utils.toHex(await web3.eth.getGasPrice())
        }

        return createSignedTransaction(rawTx, privKey);
    }



}