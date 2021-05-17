
const myUtil = require("./myUtil");

// 1.生成助记词
// let mnemonic = bip39.generateMnemonic()
// console.log(mnemonic)
const mnemonic = 'crew final panther below actor drop alpha ask toddler frown bronze scene';

(async function (mnemonic) {
    const hdWallet = await myUtil.createHDWalletByMnemonic(mnemonic);
    const { privateKey, address } = myUtil.getAccountFromHDWallet(hdWallet, 1);
    try {
        const balance = await myUtil.getBalanceFromPrivateKey(privateKey)
        console.log(balance, "show balance");
        const retBody = await myUtil.sendTransaction({
            fromaddress: address,
            toaddress: '0xD4047a6eC4eb850dDb04069130B9fAF727c5558A',
            number: '0.1',
            privatekey: privateKey
        })
        console.log(retBody, "show retBody");
    } catch (err) {
        console.log(err.message, "show err");
    }

})(mnemonic);
