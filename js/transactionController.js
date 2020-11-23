import Common from "ethereumjs-common";
import Transaction from "ethereumjs-tx";

function createSignedTransaction(rawTx, privateKey) {
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

    tx.sign(Buffer.from(privateKey, "hex"));
    let serializedTx = tx.serialize();

    return serializedTx;
}

export {createSignedTransaction};