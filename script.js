const cryptoData = [
    {
        id: 'trx',
        name: 'TRX/USDT',
        price: 0.276940,
        change: -2.49,
       img: "trx-icon.png"
    },
    {
        id: 'xlm',
        name: 'XLM/USDT',
        price: 0.435038,
        change: -0.34,
        img: "xlm-icon.png"
    },
    {
       id: 'atom',
        name: 'ATOM/USDT',
        price: 8.4499,
       change: -1.54,
       img: "atom-icon.png"
    },
    {
        id: 'sui',
        name: 'SUI/USDT',
        price: 4.5904,
        change: -3.49,
        img: "sui-icon.png"
    },
    {
        id: 'etc',
        name: 'ETC/USDT',
        price: 32.0858,
        change: -1.55,
       img: "etc-icon.png"
    },
    {
        id: 'dot',
        name: 'DOT/USDT',
        price: 8.3856,
        change: -2.54,
        img: "dot-icon.png"
    },
    {
      id: 'manta',
        name: 'MANTA/USDT',
        price: 0.9834,
        change: -5.21,
        img: "manta-icon.png"
    },
    {
        id: 'dash',
        name: 'DASH/USDT',
        price: 43.26,
        change: -2.19,
         img: "dash-icon.png"
    },
    {
        id: 'woo',
        name: 'WOO/USDT',
        price: 0.25404,
        change: -2.58,
        img: "woo-icon.png"
    },
    {
        id: 'ton',
        name: 'TON/USDT',
        price: 5.7813,
        change: -2.50,
        img: "ton-icon.png"
    },

];
let userBalances = {}; // Saldo simulato per le crypto
const cryptoList = document.getElementById('crypto-list');
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
             priceCell.textContent = crypto.price;
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

  updateCryptoList();
