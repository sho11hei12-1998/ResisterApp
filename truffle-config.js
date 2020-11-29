var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = '';
var accessToken = 'https://rinkeby.infura.io/v3/59da26d8fe8b441c953d1c16f0bc275f';
const gas = 4000000;
const gasPrice = 1000000000 * 60;
module.exports = {
  networks: {
    rinkeby: {
      provider: function () {
        return new HDWalletProvider(
          mnemonic,
          accessToken
        );
      },
      network_id: 4,
      gas: gas,
      gasPrice: gasPrice,
      skipDryRun: true
    }
  },
  compilers: {
    solc: {
      version: "0.5.2",
    }
  }
};