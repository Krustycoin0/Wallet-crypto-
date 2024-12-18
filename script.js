const API_KEY = 'C5CF3608-A514-45C1-88AD-35C48C2AF9EA';
const API_URL = 'https://rest.coinapi.io/v1/assets';
const walletAddress = '0xD54DF1e7F8A84D1e8d0444FA3824d6485672b8F8';
let userBalance = 1000; // Saldo iniziale simulato
let cryptoData = [];
const walletBalanceElement = document.getElementById('wallet-balance');
const cryptoList = document.getElementById('crypto-list');

async function fetchCryptoData() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        'X-CoinAPI-Key': API_KEY,
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
      cryptoData = data.filter(asset => asset.type_is_crypto && asset.price_usd)
          .map(asset => ({
        id: asset.asset_id,
        name: `${asset.asset_id}/${'USDT'}`,
        price: asset.price_usd,
        img: "crypto-icon.png",
        change: (Math.random() * (5 - -5) + -5).toFixed(2)
      }));

    updateCryptoList();
  } catch (error) {
    console.error('Errore nel recupero dei dati delle criptovalute:', error);
  }
}

function updateCryptoList(data = cryptoData){
       cryptoList.innerHTML = '';

       data.forEach(crypto =>{
           const row = document.createElement('tr');
            const imgCell = document.createElement('td');
            const img = document.createElement("img");
            img.src = crypto.img;
            img.alt = crypto.name
            imgCell.appendChild(img)
            row.appendChild(imgCell)

            const nameCell = document.createElement('td');
            nameCell.textContent = crypto.name;
            row.appendChild(nameCell);

             const priceCell = document.createElement('td');
             priceCell.textContent = crypto.price.toFixed(6);
            row.appendChild(priceCell);

            const changeCell = document.createElement('td');
             const changeSpan = document.createElement('span')
              changeSpan.textContent = `${crypto.change}%`
                if (crypto.change > 0) {
                 changeSpan.classList.add('change-positive');
                 }
             else {
                  changeSpan.classList.add('change-negative');
               }
           changeCell.appendChild(changeSpan);
          row.appendChild(changeCell);

        const tradeCell = document.createElement('td');
           const tradeButton = document.createElement('a');
           tradeButton.textContent = 'Trade';
            tradeButton.href = '#';
             tradeButton.classList.add('trade-button');
            tradeButton.onclick = () => openTradeModal(crypto);
          tradeCell.appendChild(tradeButton)
         row.appendChild(tradeCell);
             cryptoList.appendChild(row);
        });

    }
 function showTab(tabName) {
        const tabs = document.querySelectorAll('.tab');
        tabs.forEach(tab => tab.classList.remove('active'));
         event.target.classList.add('active');
    }

 const searchInput = document.getElementById("search-crypto")
    searchInput.addEventListener("input", function () {
      const searchTerm = searchInput.value.toLowerCase();
     const filteredData =  cryptoData.filter(crypto =>
          crypto.name.toLowerCase().includes(searchTerm)
      );
        updateCryptoList(filteredData)
    });

function updateWalletBalance() {
        walletBalanceElement.textContent = userBalance.toFixed(2)
    }
 function openTradeModal(crypto) {
        const modal = document.getElementById('tradeModal');
         modal.style.display = 'flex';
          const cryptoName = document.getElementById('trade-crypto')
            cryptoName.textContent = crypto.name
         modal.dataset.cryptoId = crypto.id
}

    function closeTradeModal() {
        const modal = document.getElementById('tradeModal');
        modal.style.display = 'none';
    }
 async  function executeTrade() {
      const modal = document.getElementById('tradeModal');
        const cryptoId = modal.dataset.cryptoId
      const amountInput = document.getElementById('trade-amount')
      const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
           alert("Inserisci un importo valido.");
         return;
     }
        if(userBalance < amount){
           alert("Saldo insufficiente")
           return
       }
      userBalance -= amount;
        const fee = amount * 0.002; // 0.002% di trattenuta
        userBalance -= fee;
        updateWalletBalance();
        closeTradeModal();
     alert("Trade eseguito con successo!")
  }
 fetchCryptoData();
  updateWalletBalance();
