import { Connection, clusterApiUrl, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import {  TOKEN_PROGRAM_ID } from "@solana/spl-token";

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
const connectButton = document.getElementById('connect-button');
const walletAddressElement = document.getElementById('wallet-address');
const walletBalanceElement = document.getElementById('wallet-balance');
const tradeButton = document.getElementById('trade-button');
const ordersBody = document.getElementById('orders-body')
const walletBody = document.getElementById('wallet-body')
let userWallet = null;
let userBalance = 0;
let orders = [];
let walletTokens = {};
const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybz1qCz8seytnqh");

const tokens = [
    { name: "SOL", mint: null }, // Mint per SOL è null
];

const tokenSelect = document.getElementById('token-select');
tokens.forEach((token) => {
    const option = document.createElement("option");
    option.value = token.name;
    option.text = token.name;
    tokenSelect.appendChild(option)
});

function addTokenToSelect(tokenName, mint) {
    const option = document.createElement('option');
    option.value = tokenName;
    option.text = tokenName;
    option.dataset.mint = mint;
    tokenSelect.appendChild(option);
  }
   const findAssociatedTokenAddress = async (
       walletAddress,
    tokenMint,
   ) => {
   return await PublicKey.findProgramAddress(
       [walletAddress.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), tokenMint.toBuffer()],
    TOKEN_PROGRAM_ID,
   );
  }

 connectButton.addEventListener('click', async () => {
        try {
            // @ts-ignore
            const provider = window.phantom?.solana;
             if (!provider) {
                 alert("Phantom wallet not found, install it!");
                 return;
             }
            await provider.connect();
            userWallet = provider.publicKey;
              if(userWallet) {
                   walletAddressElement.textContent = userWallet.toBase58()
                   await updateBalance();
                    await updateWalletTokens();
             }
            console.log("Wallet connected:", userWallet.toBase58());
        } catch (error) {
            console.error("Error connecting wallet:", error);
              alert("Error connecting wallet")
        }
    });

      async function updateBalance() {
          if(!userWallet) return
        try {
             const balance = await connection.getBalance(userWallet);
               userBalance = balance / LAMPORTS_PER_SOL;
                walletBalanceElement.textContent = userBalance.toFixed(2);
            } catch (error) {
                console.error("Error fetching balance:", error);
              alert("Error fetching balance")
            }
       }
        async function fetchTokensMetadata() {
             for (let i = 0; i < tokens.length; i++) {
                const token = tokens[i];
                 if (token.mint === null) continue;
                  try {
                    const metadataAddress = await PublicKey.findProgramAddress(
                       [Buffer.from("metadata"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), new PublicKey(token.mint).toBuffer()],
                       TOKEN_METADATA_PROGRAM_ID
                      );
                     const accountInfo = await connection.getAccountInfo(metadataAddress[0]);
                     if (accountInfo){
                        const data = accountInfo.data;
                         const name = data.slice(36,68).toString().replace(/\0/g, '')
                      addTokenToSelect(name, token.mint)
                     }
                  } catch (error) {
                      console.log("errore token metadata:", token.mint, error)
                   }
            }
      }
    async function updateWalletTokens(){
       if(!userWallet) return;
      const tableBody = document.getElementById('wallet-body')
        tableBody.innerHTML = "";
       for (let i = 0; i < tokens.length; i++) {
          const token = tokens[i];
           if(token.mint === null) {
                const row = document.createElement("tr");
                const tokenCell = document.createElement("td");
                tokenCell.textContent = token.name;
                const balanceCell = document.createElement("td");
               balanceCell.textContent = userBalance.toFixed(2)
                row.appendChild(tokenCell);
                row.appendChild(balanceCell);
                tableBody.appendChild(row);
           }else {
               try {
                     const tokenMint = new PublicKey(token.mint);
                    const associatedTokenAddress = await findAssociatedTokenAddress(
                         userWallet, tokenMint,
                     );
                       const accountInfo = await connection.getAccountInfo(associatedTokenAddress[0]);
                       if (accountInfo){
                           const data = accountInfo.data;
                           const balance = data.slice(0, 8).readBigInt64LE()
                            const row = document.createElement("tr");
                            const tokenCell = document.createElement("td");
                           tokenCell.textContent = token.name;
                             const balanceCell = document.createElement("td");
                             balanceCell.textContent = (Number(balance) / 1000000000).toFixed(2);
                           row.appendChild(tokenCell);
                          row.appendChild(balanceCell);
                          tableBody.appendChild(row);
                         }
                }catch(e){
                    console.log("errore token balance:", token.name, e)
               }
          }
       }
    }

    tradeButton.addEventListener('click', async () => {
          if (!userWallet) {
              alert("Connetti prima il tuo wallet");
             return;
        }
        const tradeType = document.getElementById('trade-type').value;
        const tokenMint = tokenSelect.selectedOptions[0].dataset.mint;
        const amount = parseFloat(document.getElementById('trade-amount').value);
        if(isNaN(amount) || amount <= 0) {
            alert("Inserisci un importo valido");
             return;
         }
         try {
             if(tokenMint === undefined) {
                await executeSolTransaction(tradeType, amount);
            }else {
                await executeTokenTransaction(tradeType, new PublicKey(tokenMint), amount )
             }
           updateBalance()
         updateOrders();
       } catch (error) {
            console.error("Error executing trade:", error);
             alert("Error executing trade");
        }
    });
 async function executeTokenTransaction(type, tokenMint, amount){
        const associatedTokenAddress = await findAssociatedTokenAddress(
        userWallet, tokenMint,
     );
     const transaction = new Transaction();
     if (type == 'buy') {
            //  TODO: implementare creazione ordine acquisto
       }else{
        // TODO: implementare creazione ordine vendita
    }

      alert("Trade Token eseguito con successo")
    }
    async function executeSolTransaction(type, amount) {
            const transaction = new Transaction();
            if (type === "buy"){
                //TODO implementare creazione ordine acquisto
            }else{
                //TODO implementare creazione ordine vendita
           }
             alert("Trade SOL eseguito con successo");
    }

 function updateOrders(){
     const tableBody = document.getElementById('orders-body')
     tableBody.innerHTML = "";
   orders.forEach(order => {
           const row = document.createElement("tr");
             const typeCell = document.createElement("td");
              typeCell.textContent = order.type;
             const tokenCell = document.createElement("td");
              tokenCell.textContent = order.token;
              const amountCell = document.createElement("td");
            amountCell.textContent = order.amount;
            const statusCell = document.createElement("td");
            statusCell.textContent = order.status
              row.appendChild(typeCell)
              row.appendChild(tokenCell)
            row.appendChild(amountCell)
              row.appendChild(statusCell)
             tableBody.appendChild(row);
        })
 }

updateOrders()
fetchTokensMetadata(
