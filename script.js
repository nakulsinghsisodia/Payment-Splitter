let web3;
let contract;
let userAccount;
let contractAddress = "0x2F8bfe82eb669dc3Ee52a298096Fb935Ac3f822e"; // Replace with your contract address
let transactionHistory = []; // Store transaction history

const contractABI = [
    {
        "inputs": [
            {
                "internalType": "address payable",
                "name": "_recipient",
                "type": "address"
            }
        ],
        "name": "addRecipient",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "distribute",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
];

async function connectMetaMask() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = await web3.eth.getAccounts();
            document.getElementById('wallet-address').innerText = `Connected: ${userAccount[0]}`;
            contract = new web3.eth.Contract(contractABI, contractAddress);
            triggerNotification('Wallet connected successfully!', 'success');
        } catch (err) {
            console.error("User denied account access");
            triggerNotification('Please grant access to your wallet!', 'fail');
        }
    } else {
        alert("Please install MetaMask");
        triggerNotification('MetaMask is required to connect.', 'fail');
    }
}

function triggerNotification(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = type;
    status.style.opacity = 1;

    setTimeout(() => {
        status.style.opacity = 0;
    }, 4000);
}

async function distributeFunds() {
    const amount = document.getElementById('amount').value;
    if (amount && web3.utils.isAddress(userAccount[0])) {
        const share = web3.utils.toWei(amount.toString(), 'ether');
        const status = document.getElementById('status');

        try {
            // Distribute funds to the contract
            await contract.methods.distribute().send({
                from: userAccount[0],
                value: share
            });

            const transaction = {
                date: new Date().toLocaleString(),
                amount: amount,
            };
            transactionHistory.push(transaction);
            updateTransactionHistory();

            triggerNotification(`Successfully distributed ${amount} ETH!`, 'success');
        } catch (error) {
            console.error(error);
            triggerNotification('Transaction failed! Please check your balance and try again.', 'fail');
        }
    } else {
        triggerNotification('Please enter a valid amount!', 'fail');
    }
}

async function withdrawFunds() {
    const amount = document.getElementById('withdrawAmount').value;
    if (amount && web3.utils.isAddress(userAccount[0])) {
        const share = web3.utils.toWei(amount.toString(), 'ether');
        const status = document.getElementById('status');

        try {
            // Withdraw funds from the contract
            await contract.methods.withdraw().send({
                from: userAccount[0],
                value: share
            });

            const transaction = {
                date: new Date().toLocaleString(),
                amount: amount,
                type: 'Withdrawal'
            };
            transactionHistory.push(transaction);
            updateTransactionHistory();

            triggerNotification(`Successfully withdrew ${amount} ETH!`, 'success');
        } catch (error) {
            console.error(error);
            triggerNotification('Withdrawal failed! Please try again later.', 'fail');
        }
    } else {
        triggerNotification('Please enter a valid withdrawal amount!', 'fail');
    }
}

function updateTransactionHistory() {
    const transactionList = document.getElementById('transaction-history');
    transactionList.innerHTML = ''; // Clear the list before updating

    if (transactionHistory.length === 0) {
        transactionList.innerHTML = '<li>No transactions yet</li>';
    } else {
        transactionHistory.forEach((transaction, index) => {
            const li = document.createElement('li');
            li.textContent = `Transaction ${index + 1}: ${transaction.amount} ETH on ${transaction.date} (${transaction.type || 'Distribution'})`;
            transactionList.appendChild(li);
        });
    }
}

// Initialize bubbles dynamically
window.onload = function() {
    const numberOfBubbles = 30;
    const body = document.body;

    // Loop to create multiple bubbles
    for (let i = 0; i < numberOfBubbles; i++) {
        let bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.classList.add('bubble-large');
        bubble.style.setProperty('--i', i);
        bubble.style.setProperty('--x', `${Math.random() * 100}vw`); // Random horizontal movement
        bubble.style.setProperty('--y', `${Math.random() * 100}vh`); // Random vertical movement
        body.appendChild(bubble);
    }
}

// Trigger wallet connection on page load
connectMetaMask();