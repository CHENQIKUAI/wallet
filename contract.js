
const getCqkContract = () => {
    const web3 = require("./myUtil").getWeb3();
    const ABI = [
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_spender",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_to",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "transfer",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "constant": false,
            "inputs": [
                {
                    "name": "_from",
                    "type": "address"
                },
                {
                    "name": "_to",
                    "type": "address"
                },
                {
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [
                {
                    "name": "",
                    "type": "bool"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "name": "_token_name",
                    "type": "string"
                },
                {
                    "name": "_symbol",
                    "type": "string"
                },
                {
                    "name": "_claim_amount",
                    "type": "uint256"
                },
                {
                    "name": "_decimals",
                    "type": "uint8"
                },
                {
                    "name": "_initial_account",
                    "type": "address"
                }
            ],
            "payable": false,
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "_owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "_spender",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "Approval",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "name": "_from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "name": "_to",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "name": "_value",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_owner",
                    "type": "address"
                },
                {
                    "name": "_spender",
                    "type": "address"
                }
            ],
            "name": "allowance",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [
                {
                    "name": "_owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "claimAmount",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "decimals",
            "outputs": [
                {
                    "name": "",
                    "type": "uint8"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "name": "",
                    "type": "string"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        },
        {
            "constant": true,
            "inputs": [],
            "name": "totalSupply",
            "outputs": [
                {
                    "name": "",
                    "type": "uint256"
                }
            ],
            "payable": false,
            "stateMutability": "view",
            "type": "function"
        }
    ]

    let contractAddress = "0xcB7E0bAdc5aCD39221011c56B1F6CF1c1b76449E"
    let myContract = new web3.eth.Contract(ABI, contractAddress)
    return myContract
}

const getCqkContractData = async (address) => {
    const myContract = getCqkContract()
    let myBalance = await myContract.methods.balanceOf(address).call()
    let decimals = await myContract.methods.decimals().call()
    myBalance = myBalance / Math.pow(10, decimals)
    let symbol = await myContract.methods.symbol().call()

    const data = {
        tokenbalance: myBalance,
        symbol,
    }
    return data;
}


const sendTokenTransaction = ({ fromaddress, toaddress, number, privatekey }) => {
    return new Promise(async (resolve, reject) => {
        const web3 = require("./myUtil").getWeb3();
        const myContract = getCqkContract();

        let nonce = await web3.eth.getTransactionCount(fromaddress)
        let gasPrice = await web3.eth.getGasPrice()

        let decimals = await myContract.methods.decimals().call()
        let balance = number * Math.pow(10, decimals)

        let myBalance = await myContract.methods.balanceOf(fromaddress).call()
        if (myBalance < balance) {
            reject("余额不足")
        }
        let tokenData = await myContract.methods.transfer(toaddress, balance).encodeABI()

        var Tx = require('ethereumjs-tx');
        var privateKey = new Buffer.from(privatekey.slice(2), 'hex')

        var rawTx = {
            from: fromaddress,
            nonce: nonce,
            gasPrice: gasPrice,
            to: myContract.options.address,//如果转的是Token代币，那么这个to就是合约地址
            data: tokenData//转Token会用到的一个字段
        }
        //需要讲交易的数据进行预估Gas计算，然后将Gas值设置到数据参数中
        let gas = await web3.eth.estimateGas(rawTx)
        rawTx.gas = gas

        var Tx = require('ethereumjs-tx').Transaction
        var tx = new Tx(rawTx, { chain: 'ropsten', hardfork: 'petersburg' });
        tx.sign(privateKey);

        var serializedTx = tx.serialize();
        await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), function (err, data) {
            if (err) {
                reject(err)
            }
        })
            .then(function (data) {
                if (data) {
                    resolve({
                        "transactionHash": data.transactionHash
                    })
                } else {
                    reject("交易失败")
                }
            })
    })
}




module.exports = {
    getCqkContract,
    getCqkContractData,
    sendTokenTransaction
}