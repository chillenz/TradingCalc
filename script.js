preset100 = document.getElementById('preset100');
preset1000 = document.getElementById('preset1000');
preset10000 = document.getElementById('preset10000');
preset100000 = document.getElementById('preset100000');
expectedvaluebutton = document.getElementById('expectedvaluebutton');
randombutton = document.getElementById('randombutton');
mode = "expectedvalue"
endbalancetext = document.getElementById('endbalancevalue');
expectedvaluetext = document.getElementById('expectedvaluevalue');
profitlosstext = document.getElementById('profitlossvalue');
riskrewardtext = document.getElementById('riskrewardvalue');
totalcommissionstext = document.getElementById('totalcommissionvalue');
numberoftradesinput = document.getElementById('numberoftradesinput');
error = document.getElementById('error');

endbalance = 0
expectedvalue = 0
profitloss = 0
riskreward = 0
totalcommission = 0

calculatebutton = document.getElementById('calculate');

let winrate, winamount, lossamount, startbalance, positionsize, numberoftrades, commission;

// ADD CHART

function drawChart(balanceHistory, initialBalance) {
    const canvas = document.getElementById('chart');
    const ctx = canvas.getContext('2d');
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const padding = 60;
    const width = canvas.width - (padding+10) * 2;
    const height = canvas.height - (padding-20)* 2;
    
    const maxBalance = Math.max(...balanceHistory, initialBalance);
    const minBalance = Math.min(...balanceHistory, initialBalance);
    const range = maxBalance - minBalance;
    
    ctx.beginPath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height + padding);
    ctx.lineTo(width + padding, height + padding);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.strokeStyle = '#4CAF50';
    ctx.lineWidth = 2;
    
    balanceHistory.forEach((balance, index) => {
        const x = padding + (width * (index / (balanceHistory.length - 1)));
        const y = padding + height - (height * ((balance - minBalance) / range));
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    
    ctx.stroke();
    
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let i = 0; i <= 4; i++) {
        const value = minBalance + (range * (i / 4));
        const y = height + padding - (height * (i / 4));
        ctx.fillText('$' + value.toFixed(2), padding - 5, y);
    }
    
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';
    for (let i = 0; i <= 4; i++) {
        const tradeNum = Math.floor((numberoftrades * i) / 4);
        const x = padding + (width * (i / 4));
        ctx.fillText(tradeNum, x, height + padding + 5);
    }
}

function updateValues() {
    winrate = parseFloat(document.getElementById('winrateinput').value);
    winamount = parseFloat(document.getElementById('winamountinput').value);
    lossamount = parseFloat(document.getElementById('lossamountinput').value);
    startbalance = parseFloat(document.getElementById('startbalanceinput').value);
    positionsize = parseFloat(document.getElementById('positionsizeinput').value);
    numberoftrades = parseInt(document.getElementById('numberoftradesinput').value);
    commission = parseFloat(document.getElementById('commissioninput').value);
}
updateValues();

expectedvaluebutton.addEventListener('click', function() {
    mode = "expectedvalue"
    expectedvaluebutton.style.border = "2px rgb(67, 175, 238) solid";
    randombutton.style.border = "none";
});

randombutton.addEventListener('click', function() {
    mode = "random"
    randombutton.style.border = "2px rgb(67, 175, 238) solid";
    expectedvaluebutton.style.border = "none";
});

preset100.addEventListener('click', function() {
    numberoftradesinput.value = 100;
    updateValues();
});
preset1000.addEventListener('click', function() {
    numberoftradesinput.value = 1000;
    updateValues();
});
preset10000.addEventListener('click', function() {
    numberoftradesinput.value = 10000;
    updateValues();
});
preset100000.addEventListener('click', function() {
    numberoftradesinput.value = 100000;
    updateValues();
});

calculatebutton.addEventListener('click', function() {
    updateValues();
    if (winrate < 0){
        winrate = 0;
        document.getElementById('winrateinput').value = 0;
    }
    if (winrate > 100){
        winrate = 100;
        document.getElementById('winrateinput').value = 100;
    }
    if (positionsize < 0){
        positionsize = 0;
        document.getElementById('positionsizeinput').value = 0;
    }
    if (positionsize > 100){
        positionsize = 100;
        document.getElementById('positionsizeinput').value = 100;
    }
    if (numberoftrades < 1){
        numberoftrades = 1;
        document.getElementById('numberoftradesinput').value = 1;
    }
    if (commission < 0){
        commission = 0;
        document.getElementById('commissioninput').value = 0;
    }
    if (commission > 100){
        commission = 100;
        document.getElementById('commissioninput').value = 100;
    }
    if (startbalance < 0){
        startbalance = 0;
        document.getElementById('startbalanceinput').value = 0;
    }
    if (lossamount < 0){
        lossamount = -lossamount;
        document.getElementById('lossamountinput').value = lossamount;
    }
    if (winamount < 0){
        winamount = -winamount;
        document.getElementById('winamountinput').value = winamount;
    }
    // no input (add error)
    if (isNaN(winrate) || isNaN(winamount) || isNaN(lossamount) || 
        isNaN(startbalance) || isNaN(positionsize) || isNaN(numberoftrades) || isNaN(commission)) {
        error.style.display = "block";
        return;
    }
    
    error.style.display = "none";
    endbalance = startbalance;
    let totalProfitLoss = 0;
    totalcommission = 0;
    
    riskreward = winamount / lossamount;
    
    const winProbability = winrate / 100;
    const lossProbability = 1 - winProbability;
    
    if (mode === "expectedvalue") {
        for (let i = 0; i < numberoftrades; i++) {
            let currentPosition = endbalance * (positionsize / 100);
            let commissionAmount = currentPosition * (commission / 100);
            
            let winGrowthFactor = 1 + (winamount / 100);
            let lossGrowthFactor = 1 - (lossamount / 100);
            
            let commissionFactor = 1 - (commission / 100);
            
            let expectedGrowth = (winProbability * Math.log(winGrowthFactor * commissionFactor)) + 
                                (lossProbability * Math.log(lossGrowthFactor * commissionFactor));
            
            let tradeExpectedReturn = currentPosition * (Math.exp(expectedGrowth) - 1);
            
            let winAmount = currentPosition * (winamount / 100);
            let lossAmount = currentPosition * (lossamount / 100);
            let linearExpectedValue = (winProbability * (winAmount - commissionAmount)) + 
                                     (lossProbability * (-lossAmount - commissionAmount));
            
            endbalance += tradeExpectedReturn;
            totalProfitLoss += linearExpectedValue; 
            totalcommission += commissionAmount;
            
            if (endbalance <= 0) {
                endbalance = 0;
                break;
            }
        }
        expectedvalue = totalProfitLoss / numberoftrades;
        
    } else if (mode === "random") {
        for (let i = 0; i < numberoftrades; i++) {
            let currentPosition = endbalance * (positionsize / 100);
            let commissionAmount = currentPosition * (commission / 100);
            
            let randomnum = Math.random() * 100;
            let tradeResult;
            
            if (randomnum <= winrate) {
                let winFactor = 1 + (winamount / 100);
                let afterCommission = winFactor * (1 - commission / 100);
                tradeResult = currentPosition * (afterCommission - 1);
            } else {
                let lossFactor = 1 - (lossamount / 100);
                let afterCommission = lossFactor * (1 - commission / 100);
                tradeResult = currentPosition * (afterCommission - 1);
            }
            
            endbalance += tradeResult;
            totalProfitLoss += tradeResult;
            totalcommission += commissionAmount;
            
            if (endbalance <= 0) {
                endbalance = 0;
                break;
            }
        }
        expectedvalue = totalProfitLoss / numberoftrades;
    }
    
    profitloss = endbalance - startbalance;
    
    let balanceHistory = [];
    let sampleInterval = Math.max(1, Math.floor(numberoftrades / 300)); // 300 max
    
    let historyBalance = startbalance;
    
    for (let i = 0; i < numberoftrades; i++) {
        let currentPosition = historyBalance * (positionsize / 100);
        let commissionAmount = currentPosition * (commission / 100);
        
        if (mode === "expectedvalue") {
            let winGrowthFactor = 1 + (winamount / 100);
            let lossGrowthFactor = 1 - (lossamount / 100);
            let commissionFactor = 1 - (commission / 100);
            let expectedGrowth = (winProbability * Math.log(winGrowthFactor * commissionFactor)) + 
                               (lossProbability * Math.log(lossGrowthFactor * commissionFactor));
            let tradeExpectedReturn = currentPosition * (Math.exp(expectedGrowth) - 1);
            historyBalance += tradeExpectedReturn;
        } else {
            let randomnum = Math.random() * 100;
            if (randomnum <= winrate) {
                let winFactor = 1 + (winamount / 100);
                let afterCommission = winFactor * (1 - commission / 100);
                historyBalance += currentPosition * (afterCommission - 1);
            } else {
                let lossFactor = 1 - (lossamount / 100);
                let afterCommission = lossFactor * (1 - commission / 100);
                historyBalance += currentPosition * (afterCommission - 1);
            }
        }
        
        if (historyBalance <= 0) {
            historyBalance = 0;
            balanceHistory.push(historyBalance);
            break;
        }
        
        if (i % sampleInterval === 0 || i === numberoftrades - 1) {
            balanceHistory.push(historyBalance);
        }
    }
    
    // display results 
    drawChart(balanceHistory, startbalance);    
    endbalancetext.textContent = "$" + endbalance.toFixed(2);
    expectedvaluetext.textContent = "$" + expectedvalue.toFixed(2);
    profitlosstext.textContent = "$" + profitloss.toFixed(2);
    riskrewardtext.textContent = riskreward.toFixed(2);
    totalcommissionstext.textContent = "$" + totalcommission.toFixed(2);
});