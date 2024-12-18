let wallets = {}
let balances = {btc: 0, eth: 0}
let transactions = []

function manageWallet() {
  const action = document.getElementById("wallet-action").value;
  const walletInput = document.getElementById("wallet-input").value;
  if (action === "create") {
   const newPrivateKey = generatePrivateKey();
   const newAddress = generatePublicKeyFromPrivateKey(newPrivateKey);
      wallets[newAddress] = newPrivateKey;
      alert(`Nuovo wallet creato. Indirizzo: ${newAddress} Privata: ${newPrivateKey}`);
      updateBalances();
  } else if (action === "import") {
    if(walletInput){
      const address = generatePublicKeyFromPrivateKey(walletInput);
      wallets[address] = walletInput;
      alert(`Wallet importato. Indirizzo: ${address} Privata: ${walletInput}`);
     updateBalances();
    }else{
       alert("Inserisci una chiave privata o una frase seed.");
      }
}
}

function generatePrivateKey() {
   return Math.random().toString(36).substring(2);
 }

 function generatePublicKeyFromPrivateKey(privateKey){
      return `0x${privateKey.slice(0, 16)}`;
}
function updateBalances() {
   const balancesBody = document.getElementById("balances-body");
    balancesBody.innerHTML = "";
      for (const currency in balances) {
        const row = document.createElement("tr");
          const currencyCell = document.createElement("td");
        currencyCell.textContent = currency.toUpperCase();
          const balanceCell = document.createElement("td");
          balanceCell.textContent = balances[currency];
            row.appendChild(currencyCell);
         row.appendChild(balanceCell);
          balancesBody.appendChild(row);
 }
}
 function sendTransaction() {
        const currency = document.getElementById("send-currency").value;
        const address = document.getElementById("send-address").value;
        const amount = parseFloat(document.getElementById("send-amount").value);
         if (!address || isNaN(amount) || amount <= 0 ) {
            alert("Inserisci un indirizzo valido e un importo corretto.");
            return;
        }

        if(balances[currency] < amount){
            alert("Saldo non sufficiente")
            return;
         }

      balances[currency] -= amount;
       updateBalances();
        addTransaction("send", currency, amount, address);
        alert("Transazione inviata.");
 }
  function addTransaction(type, currency, amount, address) {
       transactions.push({
         type: type,
         currency: currency.toUpperCase(),
         amount: amount,
         address: address,
         date: new Date().toLocaleString()
    });
      updateTransactions();
   }
   function updateTransactions() {
        const transactionsBody = document.getElementById("transactions-body");
        transactionsBody.innerHTML = "";
    transactions.forEach((transaction) => {
            const row = document.createElement("tr");
            const typeCell = document.createElement("td");
            typeCell.textContent = transaction.type;
            const currencyCell = document.createElement("td");
            currencyCell.textContent = transaction.currency;
            const amountCell = document.createElement("td");
            amountCell.textContent = transaction.amount;
            const addressCell = document.createElement("td");
            addressCell.textContent = transaction.address;
             const dateCell = document.createElement("td");
            dateCell.textContent = transaction.date;

             row.appendChild(typeCell);
             row.appendChild(currencyCell);
            row.appendChild(amountCell);
            row.appendChild(addressCell);
            row.appendChild(dateCell);

           transactionsBody.appendChild(row);
    });
   }
function generateReceiveAddress() {
     const currency = document.getElementById("receive-currency").value;
    if (wallets){
        const address = Object.keys(wallets)[0];
         document.getElementById("receive-address").value = address
         alert(`Indirizzo pubblico per ${currency.toUpperCase()} generato e copiato.`);
     }
}
