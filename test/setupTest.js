const chai = require('chai');
const BN = web3.utils.BN;
const chaiBN = require('chai-bn')(BN);
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiBN);
chai.use(chaiAsPromised);

module.exports = chai;
