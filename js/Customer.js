import Bip39 from "bip39";
import HdKey from "hdkey";
import ethUtil from "ethereumjs-util";
import Utils from "./HdVisit-Utils.js";
import {web3} from "./Web3Connector.js";
import Transaction from "ethereumjs-tx";
import VisitedContract from "./VisitedContract.js";
import Common from "ethereumjs-common";

class Customer {
    static Korea = 0;

    constructor(mnemonic) {
        this._mnemonic = mnemonic;
        this._index = 0;
    }

    async createMyInfo() {
        let seed = await Bip39.mnemonicToSeed(this._mnemonic);
        let hdwallet = HdKey.fromMasterSeed(seed);
        let key = hdwallet.derive(
            Utils.makePath(Customer.Korea, new Date(), this._index)
        );

        let x = await this._createTransaction(key, "0x5Ec01d0C4638f60a57F8534a9a2d5cF7BA09a5f0");
        return x;
    }


    async _createTransaction(key, shopAddress) {
        let contract = await new web3.eth.Contract(VisitedContract._abi, VisitedContract._address)
            .methods.visit(shopAddress, Utils.timeToSec().toString());
        let data =contract.encodeABI();

        let privKey = Buffer.from(key._privateKey, "hex");
        let address = "0x" + ethUtil.pubToAddress(key._publicKey, true).toString("hex");
        let rawTx = {
            nonce : await web3.eth.getTransactionCount(address),
            from : address,
            to : shopAddress,
            value : 0x0,
            data : data,
            gasLimit : await contract.estimateGas(),
            gasPrice : web3.utils.toHex(await web3.eth.getGasPrice())
        }

        const customCommon = Common.default.forCustomChain(
            "mainnet",
            {
                name: "testNetwork",
                networkId : 1337,
                chainId : 1337
            },
            "byzantium"
        )

        let tx = new Transaction.Transaction(rawTx, {
            common : customCommon
        });

        tx.sign(privKey);
        let serializedTx = tx.serialize();

        return serializedTx
    }
}

let x = new Customer().createMyInfo();
console.log(x);