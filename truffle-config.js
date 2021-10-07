const path = require('path');
const HDWalletProvider = require('@truffle/hdwallet-provider');

const Mnemonic = '';
const AccountIndex = 0;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, 'client/src/contracts'),
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*',
    },
    ganache_local: {
      provider: function () {
        return new HDWalletProvider(Mnemonic, 'http://127.0.0.1:8545', AccountIndex);
      },
      network_id: 5777,
    },
    goerli_infura: {
      provider: function () {
        return new HDWalletProvider(Mnemonic, '', AccountIndex);
      },
      network_id: 5,
    },
    ropsten_infura: {
      provider: function () {
        return new HDWalletProvider(Mnemonic, '', AccountIndex);
      },
      network_id: 3,
    },
  },
  compilers: {
    solc: {
      version: '0.8.7',
    },
  },
};
