var Web3 = require("web3")
let bip39 = require('bip39')
let hdkey = require('ethereumjs-wallet').hdkey
let util = require('ethereumjs-util')

const ENDPOINTS = "https://ropsten.infura.io/v3/b186ce03905e4f759fb7243fac5fc0df"
var web3 = new Web3(Web3.givenProvider || ENDPOINTS);

module.exports = {
    async createHDWalletByMnemonic(mnemonic) {
        const seed = await bip39.mnemonicToSeed(mnemonic)
        const hdWallet = hdkey.fromMasterSeed(seed)
        return hdWallet;
    },
    getAccountFromHDWallet(hdWallet, nthPrivateKey) {
        for (let i = 0; i <= nthPrivateKey; i++) {
            let key = hdWallet.derivePath("m/44'/60'/0'/0/" + i)
            const privateKey = util.bufferToHex(key._hdkey._privateKey);
            const publicKey = util.bufferToHex(key._hdkey._publicKey)
            const address = util.toChecksumAddress("0x" + util.pubToAddress(key._hdkey._publicKey, true).toString('hex'))
            if (i === nthPrivateKey - 1) {
                return {
                    privateKey,
                    publicKey,
                    address
                }
            }
        }
    },
    getBalanceFromPrivateKey(privateKey) {
        const account = web3.eth.accounts.privateKeyToAccount(privateKey);
        return web3.eth.getBalance(account.address)
    },
    async sendTransaction({ fromaddress, toaddress, number, privatekey }) {
        let nonce = await web3.eth.getTransactionCount(fromaddress)
        let gasPrice = await web3.eth.getGasPrice()
        let balance = await web3.utils.toWei(number)

        var Tx = require('ethereumjs-tx').Transaction
        var privateKey = new Buffer.from(privatekey.slice(2), 'hex')

        var rawTx = {
            from: fromaddress,
            nonce: nonce,
            gasPrice: gasPrice,
            to: toaddress,
            value: balance,
            data: '0x00'//转Token代币会用到的一个字段
        }
        //需要将交易的数据进行预估gas计算，然后将gas值设置到数据参数中
        let gas = await web3.eth.estimateGas(rawTx)
        rawTx.gas = gas

        var tx = new Tx(rawTx, { chain: 'ropsten', hardfork: 'petersburg' });
        tx.sign(privateKey);

        var serializedTx = tx.serialize();
        let responseData;
        await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, data) {
            if (err) {
                responseData = (err)
            }
        }).then(function (data) {
            console.log(data)
            if (data) {
                responseData = success({
                    "transactionHash": data.transactionHash
                })
            } else {
                responseData = ("交易失败")
            }
        })
        return responseData;
    },
}