import {web3} from './web3Connector.js';

'use strict';

export default class VisitedContract {

    static async visit(signedTransaction) {
        return web3.eth.sendSignedTransaction(signedTransaction);
    }

    static async find(address) {
        let contract = new web3.eth.Contract(VisitedContract._abi, VisitedContract._address, {
            from: "0x" + address,
        });

        let x = await contract.methods.find().call();
        return x;
    }

    static async getEstimateGas() {
        return new web3.eth.Contract(VisitedContract._abi, VisitedContract._address)
            .methods.visit()
            .estimateGas();
    }

    static _address = "0x2Df41d7E2EbB1431A406a32f1E7f90502666b524";
    static _abi = [
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
            "internalType": "address",
            "name": "shop",
            "type": "address"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "date",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "statTime",
            "type": "uint256"
          },
          {
            "indexed": false,
            "internalType": "uint256",
            "name": "endTime",
            "type": "uint256"
          }
        ],
        "name": "alarm",
        "type": "event"
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
            "name": "date",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "visitedTime",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "leftedTime",
            "type": "uint256"
          }
        ],
        "name": "confirme",
        "outputs": [],
        "stateMutability": "payable",
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
              },
              {
                "internalType": "uint256",
                "name": "leftedTime",
                "type": "uint256"
              }
            ],
            "internalType": "struct Visited.ConfirmedCostomerInfo[]",
            "name": "",
            "type": "tuple[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]
}