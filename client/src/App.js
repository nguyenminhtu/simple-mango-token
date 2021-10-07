import React, { useEffect, useState } from 'react';
import MyTokenContract from './contracts/MyToken.json';
import MyTokenSaleContract from './contracts/MyTokenSale.json';
import KYCContract from './contracts/KYCContract.json';
import getWeb3 from './getWeb3';

import './App.css';

function App() {
  const [loaded, setLoaded] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [kycAddress, setKycAddress] = useState('');
  const [kycInstance, setKycInstance] = useState(null);
  const [myTokenInstance, setMyTokenInstance] = useState(null);
  const [myTokenSaleInstance, setMyTokenSaleInstance] = useState(null);
  const [tokenSaleAddress, setTokenSaleAddress] = useState(null);
  const [tokenAmount, setTokenAmount] = useState(0);

  useEffect(() => {
    const initialize = async () => {
      try {
        const web3 = await getWeb3();
        const accounts = await web3.eth.getAccounts();
        const networkId = await web3.eth.net.getId();

        const myTokenInstanceInit = new web3.eth.Contract(
          MyTokenContract.abi,
          MyTokenContract.networks[networkId] && MyTokenContract.networks[networkId].address,
        );

        const myTokenSaleInstanceInit = new web3.eth.Contract(
          MyTokenSaleContract.abi,
          MyTokenSaleContract.networks[networkId] && MyTokenSaleContract.networks[networkId].address,
        );

        const kycInstance = new web3.eth.Contract(
          KYCContract.abi,
          KYCContract.networks[networkId] && KYCContract.networks[networkId].address,
        );

        setMyTokenInstance(myTokenInstanceInit);
        setMyTokenSaleInstance(myTokenSaleInstanceInit);
        setTokenSaleAddress(MyTokenSaleContract.networks[networkId].address);
        setKycInstance(kycInstance);
        setLoaded(true);
        setWeb3(web3);
        setAccounts(accounts);
      } catch (error) {
        console.error(error);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (myTokenInstance && accounts.length) {
      listenToTransferEvent();
      updateTokenAmount();
    }
  }, [myTokenInstance, accounts]);

  const handleKycWhiteListing = async () => {
    await kycInstance.methods.setKycCompleted(kycAddress).send({ from: accounts[0] });
    alert(`KYC for ${kycAddress} is completed !`);
  };

  const updateTokenAmount = async () => {
    const amount = await myTokenInstance.methods.balanceOf(accounts[0]).call();

    setTokenAmount(amount);
  };

  const listenToTransferEvent = () => {
    myTokenInstance.events.Transfer({ to: accounts[0] }).on('data', (data) => {
      console.log('data: ', data);
      return updateTokenAmount();
    });
  };

  const handleBuyMoreToken = async () => {
    await myTokenSaleInstance.methods
      .buyTokens(accounts[0])
      .send({ from: accounts[0], value: web3.utils.toWei('1', 'wei') });
  };

  if (!loaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <h1>Mango Token Sale</h1>
      <p>Get your tokens today.</p>
      <h2>Kyc Whitelisting</h2>
      Address to allow:{' '}
      <input name="kycAddress" value={kycAddress} onChange={(event) => setKycAddress(event.target.value)} />
      <button onClick={handleKycWhiteListing}>Add to whitelist</button>
      <h2>Buy Tokens</h2>
      <p>If you want to buy tokens send Wei to this address: {tokenSaleAddress}</p>
      <p>You currently have: {tokenAmount} MGT Token</p>
      <button onClick={handleBuyMoreToken}>Buy more token</button>
    </div>
  );
}

export default App;
