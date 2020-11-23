import bip39 from "bip39";
import HdKey from "hdkey";
import {Shop} from "./Shop.js";
import {ShopContract} from "./ShopContract.js";
import {Customer} from "./Customer.js";
import {web3} from "./Web3Connector.js";
import {createSignedTransaction} from "./transactionController.js";
import ethUtil from "ethereumjs-util";
import VisitedContract from "./VisitedContract.js";
import Utils from "./HdVisit-Utils.js";

async function createShops() {
    let shops = [];
    for (let i = 0; i < 10; i++) {
        const mnemonic = bip39.generateMnemonic();
        // console.log("generated shop mnemonic : " + mnemonic);

        let seed = await bip39.mnemonicToSeed(mnemonic);
        let hdwallet = HdKey.fromMasterSeed(seed);
        let key = hdwallet.derive("m/44'/60'/0'/0/0");

        let shop = new Shop(key, `shop${i}`, "1", "1");
        sendEther(shop._address);
        shops.push(await ShopContract.deploy(shop));
    }

    return shops;
}

async function sendEther(shopAddress) {
    let rawTx = {
        nonce: await web3.eth.getTransactionCount("0xd54aab16dad0af67368d99330b9de27c49b945d0"),
        from: "0xd54aab16dad0af67368d99330b9de27c49b945d0",
        to: shopAddress,
        value: web3.utils.toHex(web3.utils.toWei("1", "ether")),
        gasLimit: web3.utils.toHex("21000"),
        gasPrice: web3.utils.toHex(await web3.eth.getGasPrice())
    }

    let serializedTx = createSignedTransaction(rawTx, Buffer.from("4ff9767a92dadfa7f9d2bebd807ddfb78a4940ee776571ee08cbd8d05b658405", "hex"));

    let receipt = await web3.eth.sendSignedTransaction("0x" + serializedTx.toString("hex"));
    return receipt;
}

function createCustomers() {
    let customers = [];
    for (let i = 0; i < 10; i++) {
        const mnemonic = bip39.generateMnemonic();
        console.log("generated customer mnemonic : " + mnemonic);
        customers.push(new Customer(mnemonic));
    }
    return customers;
}

function createPath(customers, shops) {
    let customersWithPath = [];

    for (let i = 0; i < customers.length; i++) {
        let customer = customers[i];
        let path = [];
        for (let j = 0; j < shops.length / 2; j++) {
            let random = Math.floor(Math.random() * shops.length);
            if (path.includes(random)) {
                j--;
                continue;
            }
            path.push(random);
        }
        console.log(path);
        customersWithPath.push({
            "customer": customer,
            "path": path
        })
    }
    return customersWithPath;
}

async function visitShop(customersWithPath, shops) {
    for (let i = 0; i < customersWithPath.length; i++) {
        let customerWithPath = customersWithPath[i];
        let customer = customerWithPath["customer"];
        let path = customerWithPath["path"];

        for (let i = 0; i < path.length; i++) {
            let shop = shops[path[i]];
            let customerInfo = await customer.createMyInfo(shop.contractAddress);
            let receipt = await shop.visit(customerInfo);
            //console.log(re`ceipt);
        }
    }
}

async function confirmCorona(customer, date) {

    let xpub = customer.getDayPath(date);

    let contract = await new web3.eth.Contract(VisitedContract.abi, VisitedContract.address)
        .methods.alarmToPeople(xpub, Utils.calcDateDiff(new Date(date)));
    let data = contract.encodeABI();

    let privKey = Buffer.from("4ff9767a92dadfa7f9d2bebd807ddfb78a4940ee776571ee08cbd8d05b658405", "hex");

    let rawTx = {
        nonce: await web3.eth.getTransactionCount("0xd54aab16dad0af67368d99330b9de27c49b945d0"),
        from: "0xd54aab16dad0af67368d99330b9de27c49b945d0",
        to: VisitedContract.address,
        value: 0x00,
        data: data,
        gasLimit: await contract.estimateGas(),
        gasPrice: web3.utils.toHex(await web3.eth.getGasPrice())
    }
    let serializedTransaction = createSignedTransaction(rawTx, privKey);
    let receipt = await web3.eth.sendSignedTransaction("0x"+serializedTransaction.toString("hex"));

    return receipt;
}

async function showCustomerPath(customers) {
    for (let i = 0; i < customers.length; i++) {
        let customer = customers[i];
        console.log(await customer.getMyPath("2020-11-23"));
    }
}

async function showConfirmedPath() {
    let contract = new web3.eth.Contract(VisitedContract.abi, VisitedContract.address);

    let xpub = await contract.methods.getConfirmed(Utils.calcDateDiff(new Date("2020-11-23"))).call();

    let root = HdKey.fromExtendedKey(xpub);

    let paths = [];

    for (let i = 0; ; i++) {
        let key = root.derive(i);
        let address = ethUtil.pubToAddress(key._publicKey, true).toString("hex");
        let visited = await VisitedContract.find(address)
        if (visited["0"] == "0x0000000000000000000000000000000000000000") break;
        paths.push(visited);
    }

    console.log(paths);
}

async function run() {
    let shops = await createShops();
    let customers = createCustomers();
    let customersWithPath = createPath(customers, shops);

    await sleep(1000);

    await visitShop(customersWithPath, shops);
    await showCustomerPath(customers);

    await confirmCorona(customers[0], "2020-11-23");
    await showConfirmedPath();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

await run();

