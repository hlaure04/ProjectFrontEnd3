import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [depositAmount, setDepositAmount] = useState("");

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account.length > 0) {
      setAccount(account[0]);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const handleDepositInputChange = (event) => {
    setDepositAmount(event.target.value);
  };

  const deposit = async () => {
    if (atm) {
      const amount = parseFloat(depositAmount);
      if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid deposit amount.");
        return;
      }

      let tx = await atm.deposit(amount);
      await tx.wait();
      setDepositAmount("");
      getBalance();
    }
  };

  const withdraw = async (amount) => {
    if (atm) {
      let tx = await atm.withdraw(amount);
      await tx.wait();
      getBalance();
    }
  };

  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install Metamask</p>;
    }

    if (!account) {
      return <button onClick={connectAccount} className="button">Please connect your Metamask wallet</button>;
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div className="content">
        <p className="user-info">Hello, <span className="user-account">{account}</span>!</p>
        <p className="balance">Your Balance: {balance} ETH</p>
        <div className="deposit-section">
          <input
            type="number"
            value={depositAmount}
            onChange={handleDepositInputChange}
            placeholder="Enter deposit amount"
            className="input"
          />
          <button onClick={deposit} className="button">Deposit</button>
        </div>
        <div className="withdraw-buttons">
          <p className="withdraw-title">Beauty Products:</p>
          <button onClick={() => withdraw(5)} className="withdraw-button">Tolouse Tint (5 ETH)</button>
          <button onClick={() => withdraw(10)} className="withdraw-button">Ducheese Palette (10 ETH)</button>
          <button onClick={() => withdraw(20)} className="withdraw-button">Matisse Tint (20 ETH)</button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1 className="title">Aristocats</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          padding: 20px;
          font-family: 'Arial', sans-serif;
          background-color: #fff;
        }
        .title {
          font-size: 36px;
          color: #ff69b4;
          margin-bottom: 20px;
        }
        .user-info {
          font-size: 18px;
          margin-bottom: 10px;
        }
        .user-account {
          font-weight: bold;
          color: #ff69b4;
        }
        .balance {
          font-size: 20px;
          margin-bottom: 20px;
        }
        .deposit-section {
          margin-bottom: 20px;
        }
        .input {
          padding: 10px;
          margin-right: 10px;
          border: 1px solid #ccc;
          border-radius: 5px;
          width: 200px;
        }
        .button {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          background-color: #ff69b4;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
        }
        .button:hover {
          background-color: #ff1493;
        }
        .withdraw-buttons {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
        }
        .withdraw-title {
          font-size: 20px;
          font-weight: bold;
          color: #ff69b4;
        }
        .withdraw-button {
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          background-color: #ff69b4;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        .withdraw-button:hover {
          background-color: #ff1493;
        }
      `}</style>
    </main>
  );
}
