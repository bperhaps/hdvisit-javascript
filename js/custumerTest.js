import {Customer} from "./Customer.js"
import Bip39 from "bip39"

function testGenerateCustomer() {
    for(let i=0; i<10; i++) {
        const mnemonic = Bip39.generateMnemonic();
        console.log("generated mnemonic : " + mnemonic);
        let x =new Customer(mnemonic);
    }
}

testGenerateCustomer();


