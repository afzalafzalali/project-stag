document.addEventListener("DOMContentLoaded", async () => {
    const apiUrl = "https://api.coingecko.com/api/v3/coins/markets";
    const coins = "bitcoin,ethereum,tether,binancecoin,solana,xrp,cardano,avalanche";
    const currency = "usd";
  
    const cryptoTableBody = document.getElementById("cryptoTableBody");
  
    try {
      const response = await fetch(`${apiUrl}?vs_currency=${currency}&ids=${coins}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Map through each coin and update the table rows
      const rowsHtml = data.map((coin, index) => {
        const priceChangeClass = coin.price_change_percentage_24h >= 0 ? "green" : "red";
        const chartImage = coin.price_change_percentage_24h >= 0 ? "chart-1.svg" : "chart-2.svg";
  
        return `
          <tr class="table-row">
            <td class="table-data">
              <button class="add-to-fav" aria-label="Add to favourite" data-add-to-fav>
                <ion-icon name="star-outline" aria-hidden="true" class="icon-outline"></ion-icon>
                <ion-icon name="star" aria-hidden="true" class="icon-fill"></ion-icon>
              </button>
            </td>
  
            <th class="table-data rank" scope="row">${index + 1}</th>
  
            <td class="table-data">
              <div class="wrapper">
                <img src="coin-${index + 1}.svg" width="20" height="20" alt="${coin.name} logo" class="img">
                <h3>
                  <a href="#" class="coin-name">${coin.name} <span class="span">${coin.symbol.toUpperCase()}</span></a>
                </h3>
              </div>
            </td>
  
            <td class="table-data last-price">$${coin.current_price.toLocaleString()}</td>
  
            <td class="table-data last-update ${priceChangeClass}">${coin.price_change_percentage_24h.toFixed(2)}%</td>
  
            <td class="table-data market-cap">$${coin.market_cap.toLocaleString()}</td>
  
            <td class="table-data">
              <img src="${chartImage}" width="100" height="40" alt="${priceChangeClass} chart" class="chart">
            </td>
  
            <td class="table-data">
              <button class="btn btn-outline">Trade</button>
            </td>
          </tr>
        `;
      }).join("");
  
      // Inject rows into the table body
      cryptoTableBody.innerHTML = rowsHtml;
    } catch (error) {
      console.error("Error fetching cryptocurrency data:", error);
      cryptoTableBody.innerHTML = `<tr><td colspan="8">Failed to load data. Please try again later.</td></tr>`;
    }
  });
  