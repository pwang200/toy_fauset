const ethers = require("ethers");
//const fs = require("fs-extra");
require("dotenv").config();

exports.get_address = function (req, res, next) {
  res.render("index", { title: "Faucet" });
};

exports.submit_address = async function (req, res, next) {
  console.log("client address:", req.body.client_address);

  if (req.body.client_address.length === 42) {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.FAUCET_PRIVATE_KEY, provider);
    const nonce = await wallet.getTransactionCount();
    console.log("nonce:", nonce);
    const fund = "50000000000000000000";
    const gas_price = "20000000000";
    const gas_limit = "100000";
    const tx = {
      from: process.env.FAUCET_ADDRESS,
      to: req.body.client_address,
      nonce: nonce,
      gasPrice: gas_price,
      gasLimit: gas_limit,
      value: fund,
      chainId: 60,
    };
    //const signedTxResponse = await wallet.signTransaction(tx);
    //const sentTxResponse =

    const sentTxResponse = await wallet.sendTransaction(tx);
    sentTxResponse.wait();
    // let balance_after = await wallet.getBalance(req.body.client_address);
    // console.log("funded:", balance_after - balance_before);
    let balance = await provider.getBalance(req.body.client_address);
    console.log("balance:", ethers.utils.formatUnits(balance));
    res
      .status(200)
      .send("<p>Balance: " + ethers.utils.formatUnits(balance) + "</p>");
  } else {
    console.log("address length:", req.body.client_address.length);
    res.redirect("/");
  }
};
