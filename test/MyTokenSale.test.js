require('dotenv').config({ path: '../.env' });
const MyTokenSale = artifacts.require('MyTokenSale');
const MyToken = artifacts.require('MyToken');
const KYCContract = artifacts.require('KYCContract');

const chai = require('./setupTest');

const BN = web3.utils.BN;
const expect = chai.expect;

contract('MyTokenSale test', async (accounts) => {
  const [deployerAccount, recipient, anotherAccount] = accounts;

  it('should not have any tokens in my deployerAccount', async () => {
    const instance = await MyToken.deployed();

    return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
  });

  it('all tokens should be in the MyTokenSale SC by default', async () => {
    const instance = await MyToken.deployed();
    const totalSupply = await instance.totalSupply();

    return expect(instance.balanceOf(MyTokenSale.address)).to.eventually.be.a.bignumber.equal(totalSupply);
  });

  it('should be possible to buy token', async () => {
    const tokenInstance = await MyToken.deployed();
    const tokenSaleInstance = await MyTokenSale.deployed();
    const kycInstance = await KYCContract.deployed();

    let balanceBefore = await tokenInstance.balanceOf(deployerAccount);
    await kycInstance.setKycCompleted(deployerAccount, { from: deployerAccount });

    await tokenSaleInstance.sendTransaction({ from: deployerAccount, value: web3.utils.toWei('1', 'wei') });
    return expect(tokenInstance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(
      balanceBefore.add(new BN(1)),
    );
  });
});
