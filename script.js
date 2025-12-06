document.addEventListener('DOMContentLoaded', () => {
    const presets = Array.from(document.querySelectorAll('.preset-tag'));
    const expectedvaluebutton = document.getElementById('expectedvaluebutton');
    const randombutton = document.getElementById('randombutton');
    const calculatebutton = document.getElementById('calculate');

    const endbalancetext = document.getElementById('endbalancevalue');
    const expectedvaluetext = document.getElementById('expectedvaluevalue');
    const profitlosstext = document.getElementById('profitlossvalue');
    const riskrewardtext = document.getElementById('riskrewardvalue');
    const totalcommissionstext = document.getElementById('totalcommissionvalue');
    const numberoftradesinput = document.getElementById('numberoftradesinput');
    const accountriskvalue = document.getElementById('accountriskvalue');
    const errorEl = document.getElementById('error');
    const leg1 = document.getElementById('leg1');
    const leg2 = document.getElementById('leg2');
    const positionsizeinput = document.getElementById('positionsizeinput');
    const inputvaluetext = document.getElementById('inputvaluetext');

    const bgbutton = document.getElementById('bgbutton');
    const circle = document.getElementById('circle');

    let bgmode = localStorage.getItem('mode') || 'light';

    positionsizeinput.addEventListener('input', (event) => {
        inputvaluetext.textContent = event.target.value + '% Bal'; 
        const value = positionsizeinput.value;
        const max = positionsizeinput.max;
        const percentage = (value / max) * 100;
        
        const gradient = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${percentage}%, #ccc ${percentage}%, #ccc 100%)`;
        
        positionsizeinput.style.setProperty('--track-background', gradient);
        
        positionsizeinput.style.background = gradient;
    });

    function changebg(modeVal) {
        bgmode = modeVal;
        if (bgmode === 'dark') {
            document.body.classList.add('dark-mode');
            if (circle) circle.style.left = '30px';
            if (bgbutton) {
                bgbutton.style.backgroundColor = '#1c2731ff';
                leg1.style.fill = 'white';
                leg2.style.fill = 'white';
            }
        } else {
            document.body.classList.remove('dark-mode');
            if (circle) circle.style.left = '0px';
            if (bgbutton) {
                bgbutton.style.backgroundColor = '#e0e0e0';
                leg1.style.fill = '#1A2B5F';
                leg2.style.fill = '#1A2B5F';
            }
        }
        try { localStorage.setItem('mode', bgmode); } catch (e) { /* i */ }
    }

    if (bgbutton) {
        bgbutton.addEventListener('click', () => {
            changebg(bgmode === 'light' ? 'dark' : 'light');
        });
    }

    
    changebg(bgmode);

    let mode = 'expectedvalue';
    let chartInstance = null;

    function parsePreset(text) {
        const t = text.trim().toLowerCase();
        if (t.endsWith('k')) return Math.round(parseFloat(t) * 1000);
        if (t.endsWith('m')) return Math.round(parseFloat(t) * 1000000);
        return parseInt(t, 10) || 0;
    }

    presets.forEach(p => {
        p.addEventListener('click', () => {
            const val = parsePreset(p.textContent || p.innerText);
            if (val > 0) {
                numberoftradesinput.value = val;
            }
        });
    });

    expectedvaluebutton.addEventListener('click', () => {
        mode = 'expectedvalue';
        expectedvaluebutton.classList.add('active');
        randombutton.classList.remove('active');
    });

    randombutton.addEventListener('click', () => {
        mode = 'random';
        randombutton.classList.add('active');
        expectedvaluebutton.classList.remove('active');
    });

    function drawChart(balanceHistory, initialBalance, numberOfTrades) {
        const ctx = document.getElementById('chart').getContext('2d');
        if (!ctx) return;

        const labels = balanceHistory.map((_, index) => index);

        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Balance',
                        data: balanceHistory,
                        borderWidth: 2,
                        tension: 0.25
                    },
                    {
                        label: 'Initial Balance',
                        data: Array(balanceHistory.length).fill(initialBalance),
                        borderWidth: 1.5,
                        borderDash: [5, 5]
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: { display: true, text: 'Trade #' }
                    },
                    y: {
                        title: { display: true, text: 'Balance ($)' },
                        ticks: {
                            callback: val => '$' + Math.floor(val)
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: ctx => `$${ctx.raw.toFixed(2)}`
                        }
                    }
                },
                elements: {
                    point: {
                        borderWidth: 0,
                        radius: 0,
                    }
                }
            }
        });
    }

    function updateValues() {
        const winrate = parseFloat(document.getElementById('winrateinput').value);
        const winamount = parseFloat(document.getElementById('winamountinput').value);
        const lossamount = parseFloat(document.getElementById('lossamountinput').value);
        const startbalance = parseFloat(document.getElementById('startbalanceinput').value);
        const positionsize = parseFloat(document.getElementById('positionsizeinput').value);
        const numberoftrades = parseInt(document.getElementById('numberoftradesinput').value, 10);
        const commission = parseFloat(document.getElementById('commissioninput').value);
        return { winrate, winamount, lossamount, startbalance, positionsize, numberoftrades, commission };
    }

    calculatebutton.addEventListener('click', () => {
        const vals = updateValues();
        let { winrate, winamount, lossamount, startbalance, positionsize, numberoftrades, commission } = vals;

        if (
            isNaN(winrate) || isNaN(winamount) || isNaN(lossamount) ||
            isNaN(startbalance) || isNaN(positionsize) || isNaN(numberoftrades) ||
            isNaN(commission)
        ) {
            if (errorEl) errorEl.style.display = 'block';
            return;
        }
        if (errorEl) errorEl.style.display = 'none';

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

        winrate = Math.min(100, Math.max(0, winrate));
        positionsize = Math.min(100, Math.max(0, positionsize));
        numberoftrades = Math.max(1, Math.floor(numberoftrades));
        commission = Math.min(100, Math.max(0, commission));
        startbalance = Math.max(0, startbalance);
        lossamount = Math.abs(lossamount);
        winamount = Math.abs(winamount);

        let endbalance = startbalance;
        let totalcommission = 0;
        let expectedvaluePerTrade = 0;

        const winProbability = winrate / 100;
        const lossProbability = 1 - winProbability;
        const riskreward = lossamount === 0 ? Infinity : (winamount / lossamount);

        if (mode === 'expectedvalue') {
            
            const winGrowthFactor = 1 + (winamount / 100);
            const lossGrowthFactor = 1 - (lossamount / 100);
            const commissionFactor = 1 - (commission / 100);

            
            const expectedLogGrowth =
                (winProbability * Math.log(winGrowthFactor * commissionFactor)) +
                (lossProbability * Math.log(lossGrowthFactor * commissionFactor));

            const expectedGrowthFactor = commissionFactor * (winProbability * winGrowthFactor + lossProbability * lossGrowthFactor);

            
            for (let i = 0; i < numberoftrades; i++) {
                const currentPosition = endbalance * (positionsize / 100);
                const balanceNotInTrade = endbalance - currentPosition;
                
                
                const newPosition = currentPosition * expectedGrowthFactor;
                endbalance = balanceNotInTrade + newPosition;

                
                const commissionAmount = currentPosition * (commission / 100);
                totalcommission += commissionAmount;

                if (endbalance <= 0) { 
                    endbalance = 0; 
                    break; 
                }
            }

            
            

        } else {
            
            for (let i = 0; i < numberoftrades; i++) {
                const currentPosition = endbalance * (positionsize / 100);
                const balanceNotInTrade = endbalance - currentPosition;
                const commissionAmount = currentPosition * (commission / 100);

                const randomnum = Math.random() * 100;
                let newPosition = 0;

                if (randomnum <= winrate) {
                    
                    const winFactor = 1 + (winamount / 100);
                    newPosition = currentPosition * winFactor - commissionAmount;
                } else {
                    
                    const lossFactor = 1 - (lossamount / 100);
                    newPosition = currentPosition * lossFactor - commissionAmount;
                }

                endbalance = balanceNotInTrade + newPosition;
                totalcommission += commissionAmount;

                if (endbalance <= 0) { 
                    endbalance = 0; 
                    break; 
                }
            }

            
        }

        const profitloss = endbalance - startbalance;
        expectedvaluePerTrade = profitloss / numberoftrades;
        
        const balanceHistory = [];
        const sampleInterval = Math.max(1, Math.floor(numberoftrades / 300));
        let historyBalance = startbalance;

        if (mode === 'expectedvalue') {
            const winGrowthFactor = 1 + (winamount / 100);
            const lossGrowthFactor = 1 - (lossamount / 100);
            const commissionFactor = 1 - (commission / 100);

            const expectedGrowthFactor = commissionFactor * (winProbability * winGrowthFactor + lossProbability * lossGrowthFactor);

            for (let i = 0; i < numberoftrades; i++) {
                const currentPosition = historyBalance * (positionsize / 100);
                const balanceNotInTrade = historyBalance - currentPosition;
                const newPosition = currentPosition * expectedGrowthFactor;
                historyBalance = balanceNotInTrade + newPosition;

                if (historyBalance <= 0) {
                    historyBalance = 0;
                    balanceHistory.push(historyBalance);
                    break;
                }

                if (i % sampleInterval === 0 || i === numberoftrades - 1) {
                    balanceHistory.push(historyBalance);
                }
            }
        } else {
            
            for (let i = 0; i < numberoftrades; i++) {
                const currentPosition = historyBalance * (positionsize / 100);
                const balanceNotInTrade = historyBalance - currentPosition;
                const commissionAmount = currentPosition * (commission / 100);

                const randomnum = Math.random() * 100;
                let newPosition = 0;

                if (randomnum <= winrate) {
                    const winFactor = 1 + (winamount / 100);
                    newPosition = currentPosition * winFactor - commissionAmount;
                } else {
                    const lossFactor = 1 - (lossamount / 100);
                    newPosition = currentPosition * lossFactor - commissionAmount;
                }

                historyBalance = balanceNotInTrade + newPosition;

                if (historyBalance <= 0) {
                    historyBalance = 0;
                    balanceHistory.push(historyBalance);
                    break;
                }

                if (i % sampleInterval === 0 || i === numberoftrades - 1) {
                    balanceHistory.push(historyBalance);
                }
            }
        }

        drawChart(balanceHistory, startbalance, numberoftrades);

        
        endbalancetext.textContent = '$' + endbalance.toFixed(2);
        expectedvaluetext.textContent = '$' + expectedvaluePerTrade.toFixed(2);
        riskrewardtext.textContent = (isFinite(riskreward) ? riskreward.toFixed(2) : '—');
        totalcommissionstext.textContent = '$' + totalcommission.toFixed(2);
        accountriskvalue.textContent = (positionsize * lossamount / 100).toFixed(2) + '%';

        
        if (profitloss > 0) {
            profitlosstext.textContent = '+$' + profitloss.toFixed(2);
            profitlosstext.classList.add('text-green');
            profitlosstext.classList.remove('text-red');
            endbalancetext.classList.add('text-green');
            endbalancetext.classList.remove('text-red');
        } else if (profitloss < 0) {
            profitlosstext.classList.add('text-red');
            profitlosstext.classList.remove('text-green');
            profitlosstext.textContent = '-$' + (-1 * profitloss).toFixed(2);
            endbalancetext.classList.add('text-red');
            endbalancetext.classList.remove('text-green');
        } else {
            profitlosstext.textContent = '$0.00';
            profitlosstext.classList.remove('text-green', 'text-red');
            endbalancetext.classList.remove('text-green', 'text-red');
        }
    });
});