import {web3} from './web3Connector.js';
import {createSignedTransaction} from "./transactionController.js";

'use strict';

export default class VisitedContract {

    static async visit(signedTransaction) {
        return web3.eth.sendSignedTransaction(signedTransaction);
    }

    static async find(address) {
        let contract = new web3.eth.Contract(VisitedContract.abi, VisitedContract.address);

        let x = await contract.methods.find().call({
            from: "0x" + address
        });

        return x;
    }

    static async alarmToPeople(shop, date, visitedTime, leftedTime) {
        let contract = await new web3.eth.Contract(VisitedContract.abi, VisitedContract.address)
            .methods.alarmToPeople(shop, date, visitedTime,leftedTime);
        let data = contract.encodeABI();

        let privKey = Buffer.from("4ff9767a92dadfa7f9d2bebd807ddfb78a4940ee776571ee08cbd8d05b658405", "hex");
        let address = "0xd54aab16dad0af67368d99330b9de27c49b945d0";

        let rawTx = {
            nonce : await web3.eth.getTransactionCount(address),
            from : address,
            to : VisitedContract.address,
            value : 0x00,
            data : data,
            gasLimit : await contract.estimateGas(),
            gasPrice : web3.utils.toHex(await web3.eth.getGasPrice())
        }
        let signedTransaction = createSignedTransaction(rawTx, privKey);
        return web3.eth.sendSignedTransaction("0x" + signedTransaction.toString("hex"));

    }

    static address = "0xA3dCc5e8e4f5741D93ad6aECE0C62603Cb794a01";
    static abi = [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "alarmIdx",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "uint256",
                    "name": "date",
                    "type": "uint256"
                },
                {
                    "indexed": false,
                    "internalType": "string",
                    "name": "xpub",
                    "type": "string"
                }
            ],
            "name": "alarm",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "string",
                    "name": "xpub",
                    "type": "string"
                },
                {
                    "internalType": "uint256",
                    "name": "date",
                    "type": "uint256"
                }
            ],
            "name": "alarmToPeople",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "find",
            "outputs": [
                {
                    "components": [
                        {
                            "internalType": "address",
                            "name": "shop",
                            "type": "address"
                        },
                        {
                            "internalType": "uint256",
                            "name": "visitedTime",
                            "type": "uint256"
                        }
                    ],
                    "internalType": "struct Visited.VisitedInfo",
                    "name": "",
                    "type": "tuple"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "date",
                    "type": "uint256"
                }
            ],
            "name": "getConfirmed",
            "outputs": [
                {
                    "internalType": "string[]",
                    "name": "",
                    "type": "string[]"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "shop",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "time",
                    "type": "uint256"
                }
            ],
            "name": "visit",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        }
    ];
}