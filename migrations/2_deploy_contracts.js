require('dotenv').config({ path: '../.env' });
const MyToken = artifacts.require('../contracts/MyToken.sol');
const MyTokenSale = artifacts.require('../contracts/MyTokenSale.sol');
const MyKYCContract = artifacts.require('../contracts/KYCContract.sol');

module.exports = async (deployer) => {
  const addresses = await web3.eth.getAccounts();

  await deployer.deploy(MyKYCContract);
  await deployer.deploy(MyToken, process.env.TOKEN_AMOUNT);
  await deployer.deploy(MyTokenSale, 1, addresses[0], MyToken.address, MyKYCContract.address);

  const instance = await MyToken.deployed();

  await instance.transfer(MyTokenSale.address, process.env.TOKEN_AMOUNT);
};
