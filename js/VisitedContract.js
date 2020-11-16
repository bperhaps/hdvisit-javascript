class VisitedContract {

  static _instance;

  async visit(signedTransaction) {
    return web3.eth.sendSignedTransaction(signedTransaction);
  }

  async find(address) {
    let contract = new web3.eth.Contract(this._abi, this._address, {
				from : "0x" + address,
		});

    let x = await contract.methods.find().call();
    return x;
  }

  constructor() {
    if(VisitedContract._instance) return VisitedContract._instance;

    this._address;
    this._abi;
    VisitedContract._instance = this;
  }

}