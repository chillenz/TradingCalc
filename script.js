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
        
        positionsizeinput.style.setProperty('--track-fill', gradient);
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

    presets.forEach(p => {
        p.addEventListener('click', () => {
            const val = p.textContent || p.innerText;
            if (val.includes('k')){
                numberoftradesinput.value = parseInt(val.replace('k', '')) * 1000;
            }
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

    function magnitude(num) {
        if (num >= 1e5 && num < 1e6) {
            return (num / 1e3).toFixed(3) + 'K';
        }else if (num >= 1e6 && num < 1e9) {
            return (num / 1e6).toFixed(3) + 'M';
        } else if (num >= 1e9 && num < 1e12) {
            return (num / 1e9).toFixed(3) + 'B';
        } else if (num >= 1e12 && num < 1e15) {
            return (num / 1e12).toFixed(3) + 'T';
        } else if (num >= 1e15 && num < 1e18) {
            return (num / 1e15).toFixed(3) + 'Qa';  
        } else if (num >= 1e18 && num < 1e21) {
            return (num / 1e18).toFixed(3) + 'Qi'; 
        } else if (num >= 1e21 && num < 1e24) {
            return (num / 1e21).toFixed(3) + 'Sx';  
        } else if (num >= 1e24 && num < 1e27) {
            return (num / 1e24).toFixed(3) + 'Sp'; 
        } else if (num >= 1e27 && num < 1e30) {
            return (num / 1e27).toFixed(3) + 'Oc';  
        } else if (num >= 1e30 && num < 1e33) {
            return (num / 1e30).toFixed(3) + 'No'; 
        } else if (num >= 1e33 && num < 1e36) {
            return (num / 1e33).toFixed(3) + 'Dc'; 
        } else if (num >= 1e36) {
            return "Limit Exceeded";
        } else {
            return num.toFixed(2);
        }
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

        const winprob = winrate / 100;
        const lossprob = 1 - winprob;
        const riskreward = lossamount === 0 ? Infinity : (winamount / lossamount);

        if (mode === 'expectedvalue') {
            
            const growthfactor = 1 + (winamount / 100);
            const lossfactor = 1 - (lossamount / 100);
            const commissionfactor = 1 - (commission / 100);

            
            const expectedLogGrowth =
                (winprob * Math.log(growthfactor * commissionfactor)) +
                (lossprob * Math.log(lossfactor * commissionfactor));

            const expectedfactor = commissionfactor * (winprob * growthfactor + lossprob * lossfactor);

            
            for (let i = 0; i < numberoftrades; i++) {
                const currentPosition = endbalance * (positionsize / 100);
                const balanceNotInTrade = endbalance - currentPosition;
                
                
                const newposition = currentPosition * expectedfactor;
                endbalance = balanceNotInTrade + newposition;

                
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
                let newposition = 0;

                if (randomnum <= winrate) {
                    
                    const winFactor = 1 + (winamount / 100);
                    newposition = currentPosition * winFactor - commissionAmount;
                } else {
                    
                    const lossFactor = 1 - (lossamount / 100);
                    newposition = currentPosition * lossFactor - commissionAmount;
                }

                endbalance = balanceNotInTrade + newposition;
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
        const numOfpoints = Math.max(1, Math.floor(numberoftrades / 300));
        let historyBalance = startbalance;

        if (mode === 'expectedvalue') {
            const growthfactor = 1 + (winamount / 100);
            const lossfactor = 1 - (lossamount / 100);
            const commissionfactor = 1 - (commission / 100);

            const expectedfactor = commissionfactor * (winprob * growthfactor + lossprob * lossfactor);

            for (let i = 0; i < numberoftrades; i++) {
                const currentPosition = historyBalance * (positionsize / 100);
                const balanceNotInTrade = historyBalance - currentPosition;
                const newposition = currentPosition * expectedfactor;
                historyBalance = balanceNotInTrade + newposition;

                if (historyBalance <= 0) {
                    historyBalance = 0;
                    balanceHistory.push(historyBalance);
                    break;
                }

                if (i % numOfpoints === 0 || i === numberoftrades - 1) {
                    balanceHistory.push(historyBalance);
                }
            }
        } else {
            
            for (let i = 0; i < numberoftrades; i++) {
                const currentPosition = historyBalance * (positionsize / 100);
                const balanceNotInTrade = historyBalance - currentPosition;
                const commissionAmount = currentPosition * (commission / 100);

                const randomnum = Math.random() * 100;
                let newposition = 0;

                if (randomnum <= winrate) {
                    const winFactor = 1 + (winamount / 100);
                    newposition = currentPosition * winFactor - commissionAmount;
                } else {
                    const lossFactor = 1 - (lossamount / 100);
                    newposition = currentPosition * lossFactor - commissionAmount;
                }

                historyBalance = balanceNotInTrade + newposition;

                if (historyBalance <= 0) {
                    historyBalance = 0;
                    balanceHistory.push(historyBalance);
                    break;
                }

                if (i % numOfpoints === 0 || i === numberoftrades - 1) {
                    balanceHistory.push(historyBalance);
                }
            }
        }

        drawChart(balanceHistory, startbalance, numberoftrades);

        
        endbalancetext.textContent = '$' + magnitude(endbalance);
        expectedvaluetext.textContent = '$' + magnitude(expectedvaluePerTrade);
        riskrewardtext.textContent = (isFinite(riskreward) ? magnitude(riskreward) : '—');
        totalcommissionstext.textContent = '$' + magnitude(totalcommission);
        accountriskvalue.textContent = (positionsize * lossamount / 100) + '%';

        
        if (profitloss > 0) {
            profitlosstext.textContent = '+$' + magnitude(profitloss);
            profitlosstext.classList.add('text-green');
            profitlosstext.classList.remove('text-red');
            endbalancetext.classList.add('text-green');
            endbalancetext.classList.remove('text-red');
        } else if (profitloss < 0) {
            profitlosstext.classList.add('text-red');
            profitlosstext.classList.remove('text-green');
            profitlosstext.textContent = '-$' + magnitude(-1 * profitloss);
            endbalancetext.classList.add('text-red');
            endbalancetext.classList.remove('text-green');
        } else {
            profitlosstext.textContent = '$0.00';
            profitlosstext.classList.remove('text-green', 'text-red');
            endbalancetext.classList.remove('text-green', 'text-red');
        }
    });
});