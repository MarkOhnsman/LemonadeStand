// Game State
let gameState = {
  day: 1,
  week: 1,
  money: 50.0,
  totalProfit: 0.0,
  supplies: {
    lemons: 0,
    cups: 0,
    sugar: 0,
  },
  costs: {
    lemons: 0.15,
    cups: 0.05,
    sugar: 0.1,
  },
  price: 0.5,
  weather: {
    type: 'sunny',
    temperature: 75,
    icon: '☀️',
    description: 'Sunny Day',
    forecast: 'Perfect weather for lemonade!',
  },
  dailyStats: {
    customersSold: 0,
    customersLost: 0,
    revenue: 0,
    expenses: 0,
    profit: 0,
  },
};

// Weather data for the summer
const weatherTypes = {
  sunny: {
    icon: '☀️',
    description: 'Sunny Day',
    demandMultiplier: 1.3,
    priceMultiplier: 1.2,
    customerBase: 1.0,
  },
  hot: {
    icon: '🌡️',
    description: 'Very Hot',
    demandMultiplier: 1.8,
    priceMultiplier: 1.5,
    customerBase: 1.2,
  },
  cloudy: {
    icon: '☁️',
    description: 'Cloudy',
    demandMultiplier: 0.8,
    priceMultiplier: 0.9,
    customerBase: 0.8,
  },
  rainy: {
    icon: '🌧️',
    description: 'Rainy',
    demandMultiplier: 0.3,
    priceMultiplier: 0.7,
    customerBase: 0.4,
  },
  partlyCloudy: {
    icon: '⛅',
    description: 'Partly Cloudy',
    demandMultiplier: 1.0,
    priceMultiplier: 1.0,
    customerBase: 0.9,
  },
};

// Initialize game
function initGame() {
  updateDisplay();
  updateWeather();
  updateSupplyCosts();
  updatePriceSlider();
  // Set initial tip
  setMarqueeTip(
    'Welcome to your lemonade stand! Buy supplies, set your price, and start selling!'
  );
}

// Update all display elements
function updateDisplay() {
  document.getElementById('current-day').textContent = gameState.day;
  document.getElementById('current-week').textContent = gameState.week;
  document.getElementById('current-money').textContent =
    gameState.money.toFixed(2);
  document.getElementById('total-profit').textContent =
    gameState.totalProfit.toFixed(2);

  // Update supply counts
  document.getElementById('lemon-count').textContent =
    gameState.supplies.lemons;
  document.getElementById('cup-count').textContent = gameState.supplies.cups;
  document.getElementById('sugar-count').textContent = gameState.supplies.sugar;

  // Update supply costs
  document.getElementById('lemon-cost').textContent =
    gameState.costs.lemons.toFixed(2);
  document.getElementById('cup-cost').textContent =
    gameState.costs.cups.toFixed(2);
  document.getElementById('sugar-cost').textContent =
    gameState.costs.sugar.toFixed(2);

  updateSupplyTotal();
}

// Update weather display
function updateWeather() {
  const weather = generateWeather();
  gameState.weather = weather;

  document.getElementById('weather-icon').textContent = weather.icon;
  document.getElementById('weather-description').textContent =
    weather.description;
  document.getElementById('weather-temp').textContent =
    weather.temperature + '°F';
  document.getElementById('weather-forecast').textContent = weather.forecast;
}

// Generate weather based on current week
function generateWeather() {
  const week = gameState.week;
  let weatherOptions = [];
  let baseTemp = 70;

  // June (weeks 1-4): Mild, mixed weather
  if (week <= 4) {
    weatherOptions = ['sunny', 'cloudy', 'partlyCloudy', 'rainy'];
    baseTemp = 70;
  }
  // July (weeks 5-8): Mostly sunny, hotter
  else if (week <= 8) {
    weatherOptions = ['sunny', 'sunny', 'hot', 'partlyCloudy'];
    baseTemp = 78;
  }
  // August (weeks 9-12): Very hot, drought-like
  else {
    weatherOptions = ['hot', 'hot', 'sunny', 'sunny'];
    baseTemp = 85;
  }

  const weatherType =
    weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
  const weatherData = weatherTypes[weatherType];
  const temperature = baseTemp + Math.floor(Math.random() * 15) - 5;

  let forecast = getForecastMessage(weatherType, temperature);

  return {
    type: weatherType,
    icon: weatherData.icon,
    description: weatherData.description,
    temperature: temperature,
    forecast: forecast,
    ...weatherData,
  };
}

// Get weather forecast message
function getForecastMessage(weatherType, temperature) {
  const messages = {
    sunny: [
      'Perfect weather for lemonade!',
      'Customers will be thirsty today!',
      'Great day for outdoor sales!',
    ],
    hot: [
      "It's going to be scorching! Customers will pay premium prices!",
      'Perfect lemonade weather - people will be very thirsty!',
      'Hot day ahead - expect lots of customers!',
    ],
    cloudy: [
      'Cloudy day - fewer customers might stop by.',
      'Not the best lemonade weather, but still okay.',
      'Moderate day for sales.',
    ],
    rainy: [
      'Rainy day - very few customers expected.',
      'People will stay indoors today.',
      'Tough day for lemonade sales.',
    ],
    partlyCloudy: [
      'Decent weather for lemonade sales.',
      'Should be a fair day for business.',
      'Moderate customer traffic expected.',
    ],
  };

  const typeMessages = messages[weatherType];
  return typeMessages[Math.floor(Math.random() * typeMessages.length)];
}

// Update supply costs with slight daily fluctuation
function updateSupplyCosts() {
  const fluctuation = () => Math.random() * 0.04 - 0.02; // ±2 cents

  gameState.costs.lemons = Math.max(0.1, Math.min(0.2, 0.15 + fluctuation()));
  gameState.costs.cups = Math.max(0.03, Math.min(0.08, 0.05 + fluctuation()));
  gameState.costs.sugar = Math.max(0.07, Math.min(0.15, 0.1 + fluctuation()));
}

// Handle supply buying
function buySupply(supplyType, amount) {
  // Map supply types to their input IDs
  const inputMap = {
    lemons: 'lemon-buy',
    cups: 'cup-buy',
    sugar: 'sugar-buy',
  };

  const input = document.getElementById(inputMap[supplyType]);
  if (!input) return; // Safety check

  let currentAmount = parseInt(input.value) || 0;

  if (amount > 0) {
    currentAmount += amount;
  } else {
    currentAmount = Math.max(0, currentAmount + amount);
  }

  input.value = currentAmount;
  updateSupplyTotal();
}

// Update total supply cost
function updateSupplyTotal() {
  const lemonBuy = parseInt(document.getElementById('lemon-buy').value) || 0;
  const cupBuy = parseInt(document.getElementById('cup-buy').value) || 0;
  const sugarBuy = parseInt(document.getElementById('sugar-buy').value) || 0;

  const total =
    lemonBuy * gameState.costs.lemons +
    cupBuy * gameState.costs.cups +
    sugarBuy * gameState.costs.sugar;

  document.getElementById('supply-total').textContent = total.toFixed(2);
}

// Handle price slider
function updatePriceSlider() {
  const slider = document.getElementById('price-slider');
  const display = document.getElementById('price-display');
  const advice = document.getElementById('price-advice');

  slider.addEventListener('input', function () {
    const price = parseFloat(this.value);
    gameState.price = price;
    display.textContent = price.toFixed(2);

    // Update pricing advice
    if (price < 0.5) {
      advice.textContent =
        "Very low price - you'll sell lots but make little profit per cup.";
    } else if (price < 0.75) {
      advice.textContent = 'Good price - nice balance of sales and profit!';
    } else if (price < 1.25) {
      advice.textContent =
        'Moderate price - fewer sales but higher profit per cup.';
    } else if (price < 1.75) {
      advice.textContent =
        'High price - only customers who really want lemonade will buy.';
    } else {
      advice.textContent =
        'Very high price - you might scare away most customers!';
    }
  });
}

// Start the selling day
function startDay() {
  // Purchase supplies
  const lemonBuy = parseInt(document.getElementById('lemon-buy').value) || 0;
  const cupBuy = parseInt(document.getElementById('cup-buy').value) || 0;
  const sugarBuy = parseInt(document.getElementById('sugar-buy').value) || 0;

  const totalCost =
    lemonBuy * gameState.costs.lemons +
    cupBuy * gameState.costs.cups +
    sugarBuy * gameState.costs.sugar;

  // Check if player has enough money
  if (totalCost > gameState.money) {
    alert(
      "You don't have enough money to buy all those supplies! Try buying less."
    );
    return;
  }

  // Check if player has supplies to make lemonade
  const currentLemons = gameState.supplies.lemons + lemonBuy;
  const currentCups = gameState.supplies.cups + cupBuy;
  const currentSugar = gameState.supplies.sugar + sugarBuy;

  if (currentLemons === 0 || currentCups === 0 || currentSugar === 0) {
    alert(
      'You need lemons, cups, AND sugar to make lemonade! Make sure to buy some of each.'
    );
    return;
  }

  // Purchase supplies
  gameState.money -= totalCost;
  gameState.supplies.lemons += lemonBuy;
  gameState.supplies.cups += cupBuy;
  gameState.supplies.sugar += sugarBuy;

  // Reset supply inputs
  document.getElementById('lemon-buy').value = 0;
  document.getElementById('cup-buy').value = 0;
  document.getElementById('sugar-buy').value = 0;

  // Simulate the day
  const results = simulateDay();
  gameState.dailyStats = results;

  // Update game state
  gameState.money += results.revenue;
  gameState.totalProfit += results.profit;

  // Update supplies (each cup uses 1 lemon, 1 cup, 1 sugar)
  const cupsToMake = Math.min(
    gameState.supplies.lemons,
    gameState.supplies.cups,
    gameState.supplies.sugar
  );
  const cupsSold = Math.min(results.customersSold, cupsToMake);

  gameState.supplies.lemons -= cupsSold;
  gameState.supplies.cups -= cupsSold;
  gameState.supplies.sugar -= cupsSold;

  // Update displays
  updateDisplay();
  showResults(results);

  // Switch buttons
  document.getElementById('start-day-btn').style.display = 'none';
  document.getElementById('next-day-btn').style.display = 'block';
}

// Simulate a day of sales
function simulateDay() {
  const weather = gameState.weather;
  const price = gameState.price;

  // Calculate maximum cups we can make
  const maxCups = Math.min(
    gameState.supplies.lemons,
    gameState.supplies.cups,
    gameState.supplies.sugar
  );

  if (maxCups === 0) {
    return {
      customersSold: 0,
      customersLost: 0,
      customersLostToPrice: 0,
      customersLostToSupply: 0,
      revenue: 0,
      expenses: 0,
      profit: 0,
      potentialRevenue: 0,
      optimalPrice: 0,
      missedOpportunity: 0,
    };
  }

  // Generate customers based on weather and week
  const baseCustomers = 15 + gameState.week * 2; // More customers as summer progresses
  const weatherCustomers = Math.floor(
    baseCustomers * weather.customerBase * weather.demandMultiplier
  );
  const totalCustomers = Math.max(
    5,
    weatherCustomers + Math.floor(Math.random() * 10)
  );

  let customersSold = 0;
  let customersLostToPrice = 0;
  let customersLostToSupply = 0;

  // Store customer willingness data for optimization analysis
  const customerWillingness = [];

  // Simulate each customer
  for (let i = 0; i < totalCustomers; i++) {
    // Customer's willingness to pay based on weather
    const baseWillingness = 0.75 + Math.random() * 0.5; // $0.75 - $1.25
    const weatherWillingness = baseWillingness * weather.priceMultiplier;
    const finalWillingness = weatherWillingness + (Math.random() * 0.3 - 0.15); // ±15 cents variance

    customerWillingness.push(finalWillingness);

    if (price <= finalWillingness) {
      // Customer wants to buy
      if (customersSold < maxCups) {
        customersSold++;
      } else {
        // Customer wants to buy but we're out of supplies
        customersLostToSupply++;
      }
    } else {
      // Customer doesn't want to buy at this price
      customersLostToPrice++;
    }
  }

  // Calculate optimal pricing and potential revenue
  const optimizationResults = calculateOptimalRevenue(
    customerWillingness,
    maxCups,
    totalCustomers
  );

  const revenue = customersSold * price;
  const expenses = gameState.dailyStats.expenses || 0; // Supply costs were already deducted
  const profit = revenue - expenses;

  return {
    customersSold: customersSold,
    customersLost: customersLostToPrice + customersLostToSupply,
    customersLostToPrice: customersLostToPrice,
    customersLostToSupply: customersLostToSupply,
    revenue: revenue,
    expenses: expenses,
    profit: profit,
    totalCustomers: totalCustomers,
    potentialRevenue: optimizationResults.maxRevenue,
    optimalPrice: optimizationResults.optimalPrice,
    missedOpportunity: Math.max(0, optimizationResults.maxRevenue - revenue),
    optimalSales: optimizationResults.optimalSales,
    neededSupplies: optimizationResults.neededSupplies,
  };
}

// Calculate optimal revenue given customer willingness and constraints
function calculateOptimalRevenue(customerWillingness, maxCups, totalCustomers) {
  // Sort customers by willingness to pay (highest first)
  const sortedWillingness = [...customerWillingness].sort((a, b) => b - a);

  let maxRevenue = 0;
  let optimalPrice = 0;
  let optimalSales = 0;
  let neededSupplies = 0;

  // Test different price points to find optimal revenue
  const pricePoints = [];
  for (let i = 0.25; i <= 2.0; i += 0.05) {
    pricePoints.push(i);
  }

  // Also test prices equal to customer willingness values for more precision
  customerWillingness.forEach((w) => {
    if (w >= 0.25 && w <= 2.0) {
      pricePoints.push(w);
    }
  });

  // Remove duplicates and sort
  const uniquePrices = [...new Set(pricePoints)].sort((a, b) => a - b);

  uniquePrices.forEach((testPrice) => {
    let sales = 0;
    let revenue = 0;

    // Count how many customers would buy at this price
    sortedWillingness.forEach((willingness) => {
      if (willingness >= testPrice && sales < totalCustomers) {
        sales++;
        revenue += testPrice;
      }
    });

    // Limit sales to available supply
    const actualSales = Math.min(sales, maxCups);
    const actualRevenue = actualSales * testPrice;

    if (actualRevenue > maxRevenue) {
      maxRevenue = actualRevenue;
      optimalPrice = testPrice;
      optimalSales = actualSales;
      neededSupplies = sales; // Total demand at this price
    }
  });

  return {
    maxRevenue,
    optimalPrice,
    optimalSales,
    neededSupplies,
  };
}

// Show daily results
function showResults(results) {
  const modal = document.getElementById('results-modal');
  const content = document.getElementById('results-content');

  const profitClass = results.profit >= 0 ? 'profit' : 'loss';

  content.innerHTML = `
        <div class="result-item">
            <h3>🛒 Daily Summary</h3>
            <p><strong>Weather:</strong> ${gameState.weather.description} (${
    gameState.weather.temperature
  }°F)</p>
            <p><strong>Your Price:</strong> $${gameState.price.toFixed(
              2
            )} per cup</p>
        </div>
        
        <div class="result-item">
            <h3>👥 Customer Activity</h3>
            <p><strong>Total Customers:</strong> ${results.totalCustomers}</p>
            <p><strong>Cups Sold:</strong> ${results.customersSold}</p>
            <p><strong>Total Customers Lost:</strong> ${
              results.customersLost
            }</p>
            ${
              results.customersLostToPrice > 0
                ? `<p style="color: #FF6347;"><strong>• Lost to High Price:</strong> ${results.customersLostToPrice} customers</p>`
                : ''
            }
            ${
              results.customersLostToSupply > 0
                ? `<p style="color: #FFA500;"><strong>• Lost to Supply Shortage:</strong> ${results.customersLostToSupply} customers</p>`
                : ''
            }
            ${
              results.customersLost === 0
                ? '<p style="color: #32CD32;"><strong>🎉 No customers lost today!</strong></p>'
                : ''
            }
        </div>
        
        <div class="result-item ${profitClass}">
            <h3>💰 Financial Results</h3>
            <p><strong>Revenue:</strong> $${results.revenue.toFixed(2)}</p>
            <p><strong>Profit:</strong> $${results.profit.toFixed(2)}</p>
        </div>
        
        ${
          results.missedOpportunity > 0.1
            ? `
        <div class="result-item" style="border-color: #FFD700; background: rgba(255, 215, 0, 0.1);">
            <h3>🎯 Optimization Analysis</h3>
            <p><strong>Potential Revenue:</strong> $${results.potentialRevenue.toFixed(
              2
            )}</p>
            <p><strong>Missed Opportunity:</strong> $${results.missedOpportunity.toFixed(
              2
            )}</p>
            ${
              results.optimalPrice !== gameState.price
                ? `<p style="color: #FF6347;"><strong>💡 Better Price:</strong> $${results.optimalPrice.toFixed(
                    2
                  )} (would have sold ${results.optimalSales} cups)</p>`
                : ''
            }
            ${
              results.neededSupplies >
              Math.min(
                gameState.supplies.lemons + results.customersSold,
                gameState.supplies.cups + results.customersSold,
                gameState.supplies.sugar + results.customersSold
              )
                ? `<p style="color: #FFA500;"><strong>📦 Needed Supplies:</strong> ${results.neededSupplies} cups total demand</p>`
                : ''
            }
            <p style="font-size: 0.9em; color: #666; margin-top: 10px;"><em>This shows what you could have earned with perfect pricing and sufficient supplies.</em></p>
        </div>
        `
            : ''
        }
        
        <div class="result-item">
            <h3>📦 Supplies Remaining</h3>
            <p><strong>Lemons:</strong> ${gameState.supplies.lemons}</p>
            <p><strong>Cups:</strong> ${gameState.supplies.cups}</p>
            <p><strong>Sugar:</strong> ${gameState.supplies.sugar}</p>
            ${
              results.customersLostToSupply > 0
                ? '<p style="color: #FFA500;"><strong>⚠️ Tip:</strong> You ran out of supplies! Buy more tomorrow to avoid missing sales.</p>'
                : results.customersSold > 0 &&
                  Math.min(
                    gameState.supplies.lemons,
                    gameState.supplies.cups,
                    gameState.supplies.sugar
                  ) < 5
                ? '<p style="color: #FFD700;"><strong>💡 Tip:</strong> Running low on supplies! Consider stocking up.</p>'
                : '<p style="color: #32CD32;"><strong>✅ Supply Status:</strong> Good supply levels!</p>'
            }
        </div>
    `;

  modal.style.display = 'flex';

  // Results determine next tip in marquee
  if (results.profit > 5) {
    if (results.missedOpportunity > 2) {
      setMarqueeTip(
        `Great profit! But you could have made $${results.missedOpportunity.toFixed(
          2
        )} more with optimal pricing!`
      );
    } else {
      setMarqueeTip('Excellent work! You made great profit today!');
    }
  } else if (results.profit > 0) {
    if (results.missedOpportunity > 1) {
      setMarqueeTip(
        `Good profit! Check the optimization analysis - you missed $${results.missedOpportunity.toFixed(
          2
        )} in potential revenue!`
      );
    } else {
      setMarqueeTip('Good job! You made some profit today!');
    }
  } else if (results.customersSold === 0) {
    if (results.customersLostToPrice > 0) {
      setMarqueeTip(
        `All customers thought your price was too high! Try $${results.optimalPrice.toFixed(
          2
        )} instead.`
      );
    } else {
      setMarqueeTip(
        'No sales today. Make sure you have supplies and set a reasonable price!'
      );
    }
  } else {
    // Some sales but could improve
    if (results.missedOpportunity > 1) {
      setMarqueeTip(
        `You missed $${results.missedOpportunity.toFixed(
          2
        )} in potential revenue! Check the optimization tips.`
      );
    } else if (results.customersLostToPrice > results.customersLostToSupply) {
      setMarqueeTip(
        `You lost ${results.customersLostToPrice} customers to high prices. Consider lowering your price!`
      );
    } else if (results.customersLostToSupply > 0) {
      setMarqueeTip(
        `You ran out of supplies! ${results.customersLostToSupply} customers wanted to buy but couldn't. Buy more supplies!`
      );
    } else {
      setMarqueeTip(
        'You sold some lemonade! Keep experimenting with prices and supplies!'
      );
    }
  }
}

// Close results modal
function closeResults() {
  document.getElementById('results-modal').style.display = 'none';
}

// Move to next day
function nextDay() {
  gameState.day++;

  // Check if week is complete
  if ((gameState.day - 1) % 7 === 0) {
    gameState.week++;
  }

  // Check if game is complete
  if (gameState.day > 84) {
    showGameOver();
    return;
  }

  // Update weather and costs for new day
  updateWeather();
  updateSupplyCosts();
  updateDisplay();

  // Switch buttons back
  document.getElementById('start-day-btn').style.display = 'block';
  document.getElementById('next-day-btn').style.display = 'none';

  // Give helpful tips based on progress
  if (gameState.day % 7 === 1) {
    setMarqueeTip(
      `Welcome to week ${gameState.week}! The weather is changing as summer progresses!`
    );
  } else {
    setMarqueeTip(
      'New day, new opportunities! Check the weather and adjust your strategy!'
    );
  }
}

// Show game over screen
function showGameOver() {
  const modal = document.getElementById('game-over-modal');
  const content = document.getElementById('final-results');

  const avgProfit = (gameState.totalProfit / 84).toFixed(2);
  let performance = '';

  if (gameState.totalProfit > 200) {
    performance = "🏆 Outstanding Business Owner! You're a lemonade mogul!";
  } else if (gameState.totalProfit > 100) {
    performance = '🥇 Excellent Entrepreneur! Great job this summer!';
  } else if (gameState.totalProfit > 50) {
    performance = '🥈 Good Business Sense! Nice work!';
  } else if (gameState.totalProfit > 0) {
    performance = '🥉 Learning Entrepreneur! You made profit!';
  } else {
    performance = '📚 Keep Learning! Business takes practice!';
  }

  content.innerHTML = `
        <div class="result-item profit">
            <h3>${performance}</h3>
        </div>
        
        <div class="result-item">
            <h3>📊 Summer Summary</h3>
            <p><strong>Days Operated:</strong> 84 days</p>
            <p><strong>Total Profit:</strong> $${gameState.totalProfit.toFixed(
              2
            )}</p>
            <p><strong>Average Daily Profit:</strong> $${avgProfit}</p>
            <p><strong>Final Money:</strong> $${gameState.money.toFixed(2)}</p>
        </div>
        
        <div class="result-item">
            <h3>🎓 What You Learned</h3>
            <p>• How weather affects customer demand</p>
            <p>• Balancing price and sales volume</p>
            <p>• Managing inventory and supplies</p>
            <p>• Making business decisions under uncertainty</p>
            <p>• Analyzing missed opportunities and optimization</p>
            <p>• Understanding the relationship between pricing and revenue</p>
        </div>
    `;

  modal.style.display = 'flex';
}

// Restart the game
function restartGame() {
  gameState = {
    day: 1,
    week: 1,
    money: 50.0,
    totalProfit: 0.0,
    supplies: {
      lemons: 0,
      cups: 0,
      sugar: 0,
    },
    costs: {
      lemons: 0.15,
      cups: 0.05,
      sugar: 0.1,
    },
    price: 0.5,
    weather: {
      type: 'sunny',
      temperature: 75,
      icon: '☀️',
      description: 'Sunny Day',
      forecast: 'Perfect weather for lemonade!',
    },
    dailyStats: {
      customersSold: 0,
      customersLost: 0,
      revenue: 0,
      expenses: 0,
      profit: 0,
    },
  };

  // Reset UI
  document.getElementById('game-over-modal').style.display = 'none';
  document.getElementById('start-day-btn').style.display = 'block';
  document.getElementById('next-day-btn').style.display = 'none';
  document.getElementById('price-slider').value = 0.5;

  // Clear supply inputs
  document.getElementById('lemon-buy').value = 0;
  document.getElementById('cup-buy').value = 0;
  document.getElementById('sugar-buy').value = 0;

  initGame();
}

// Set marquee tip
function setMarqueeTip(tip) {
  document.getElementById('tips-marquee').textContent = `💡 Tip: ${tip}`;
}

// Cycle through tips automatically
function startTipCycle() {
  const tips = [
    'Watch the weather forecast - hot days mean more customers!',
    "Don't set your price too high or customers will walk away!",
    'Make sure you have enough supplies for the day!',
    'Your profit is revenue minus expenses!',
    'Summer gets hotter as weeks go by - adjust your strategy!',
    'Running out of supplies means missed sales opportunities!',
    'Rainy days are tough for lemonade sales!',
    'Each cup of lemonade needs 1 lemon, 1 cup, and 1 sugar!',
    'Higher prices mean fewer sales but more profit per cup!',
    'Buy supplies in bulk when you have extra money!',
    'Check your remaining supplies before starting each day!',
    'Check why customers were lost - price too high or supply shortage?',
    'Red losses = price too high, Orange losses = not enough supplies!',
    'Balance your inventory - too little supply means missed sales!',
    'Look for the Optimization Analysis to see how much more you could have made!',
    'The optimal price balances volume and profit per cup!',
  ];

  let currentTipIndex = 0;

  setInterval(() => {
    setMarqueeTip(tips[currentTipIndex]);
    currentTipIndex = (currentTipIndex + 1) % tips.length;
  }, 8000); // Change tip every 8 seconds
}

// Add event listeners for supply inputs
document.addEventListener('DOMContentLoaded', function () {
  // Initialize the game
  initGame();

  // Start the tip cycling marquee
  startTipCycle();

  // Add event listeners for supply input changes
  ['lemon-buy', 'cup-buy', 'sugar-buy'].forEach((id) => {
    document.getElementById(id).addEventListener('input', updateSupplyTotal);
  });
});
