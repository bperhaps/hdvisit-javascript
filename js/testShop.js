import {Shop} from "./Shop.js";
import bip39 from "bip39"
import {ShopContract} from "./ShopContract.js";
import HdKey from "hdkey";

async function testGenerateShop() {
    let shops = [];
    for(let i=0; i<10; i++) {
        const mnemonic = bip39.generateMnemonic();
        //console.log("generated mnemonic : " + mnemonic);

        let seed = await bip39.mnemonicToSeed(mnemonic);
        let hdwallet = HdKey.fromMasterSeed(seed);
        let key = hdwallet.derive("m/44'/60'/0'/0/0");

        let shop =new Shop(key, `shop${i}`, "1","1");
        shops.push(await ShopContract.deploy(shop));
    }

    //console.log(shops);
}

await testGenerateShop();