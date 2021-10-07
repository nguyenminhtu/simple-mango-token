require('dotenv').config({ path: '../.env' });
const MyToken = artifacts.require('MyToken');

const chai = require('./setupTest');

const BN = web3.utils.BN;
const expect = chai.expect;

contract('MyToken test', async (accounts) => {
  beforeEach(async () => {
    this.myToken = await MyToken.new(process.env.TOKEN_AMOUNT);
  });

  const [deployerAccount, recipient, anotherAccount] = accounts;

  it('is not possible to send more tokens than available in total', async () => {
    const instance = this.myToken;
    const balanceOfDeployer = await instance.balanceOf(deployerAccount);

    expect(instance.transfer(recipient, new BN(balanceOfDeployer + 1))).to.eventually.be.rejected;
    return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(balanceOfDeployer);
  });

  it('all token should be in my account', async () => {
    const instance = this.myToken;
    const totalSupply = await instance.totalSupply();
    const balanceOfFirstAccount = await instance.balanceOf(deployerAccount);

    return expect(balanceOfFirstAccount.valueOf()).to.be.a.bignumber.equal(totalSupply);
  });

  it('is possible to send tokens between accounts', async () => {
    const sendTokens = 1;
    const instance = this.myToken;
    const totalSupply = await instance.totalSupply();

    expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);

    await instance.transfer(recipient, new BN(sendTokens));
    expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply.sub(new BN(sendTokens)));
    return expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
  });
});
