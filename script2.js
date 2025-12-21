document.addEventListener('DOMContentLoaded', () => {
    const presets = Array.from(document.querySelectorAll('.presettag'));
    const evbutton = document.getElementById('expectedvaluebutton');
    const randombutton = document.getElementById('randombutton');
    const calculate = document.getElementById('calculate');

    const endbalancetext = document.getElementById('endbalancevalue');
    const evtext = document.getElementById('expectedvaluevalue');
    const profitlosstext = document.getElementById('profitlossvalue');
    const riskrewardtext = document.getElementById('riskrewardvalue');
    const totalcommissionstext = document.getElementById('totalcommissionvalue');
    const numberoftradesinput = document.getElementById('numberoftradesinput');
    const accountriskvalue = document.getElementById('accountriskvalue');
    const error = document.getElementById('error');
    const leg1 = document.getElementById('leg1');
    const leg2 = document.getElementById('leg2');
    const positionsizeinput = document.getElementById('positionsizeinput');
    const inputvaluetext = document.getElementById('inputvaluetext');

    const themetoggle = document.getElementById('themetoggle');
    const themecircle = document.getElementById('themecircle');
    const updatetoggle = document.getElementById('updatetoggle');
    const updatecircle = document.getElementById('updatecircle');
    const animationtoggle = document.getElementById('animationtoggle');
    const animationcircle = document.getElementById('animationcircle');

    const indicator = document.getElementById('switchbg');
    
    const burger = document.getElementById('borgor');
    const sidebar = document.getElementById('sidebar');
    const darkscreen = document.getElementById('darkscreen');

    const navmain = document.getElementById('navmain');
    const navsize = document.getElementById('navsize');

    const sizepage = document.getElementById('sizepage');
    const mainpage = document.getElementById('mainpage');

    const calculatesize = document.getElementById('calculatesize');
    const errorsize = document.getElementById('errorsize')
    const riskvaluestext = Array.from(document.querySelectorAll('.riskvalue'));
    
    const inputs = Array.from(document.querySelectorAll('input'));

    navmain.addEventListener('click', () => {
        navsize.classList.remove('currentpage')
        navmain.classList.add('currentpage')
        mainpage.style.display = "block";
        sizepage.style.display = 'none';
    });

    navsize.addEventListener('click', () => {
        navmain.classList.remove('currentpage');
        navsize.classList.add('currentpage');
        mainpage.style.display = "none";
        sizepage.style.display = "block";
    });

    let bgmode = localStorage.getItem('mode') || 'dark';
    let autoupdate = localStorage.getItem('update') === 'true';
    let animate = localStorage.getItem('animate') === 'true';

    let prevendbalance = 0;
    let prevEV = 0;
    let prevpl = 0;
    let prevrr = 0;
    let prevcomm = 0;
    let prevaccountrisk = 0;

    let prevriskvalues = [0, 0, 0]

    positionsizeinput.addEventListener('input', (event) => {
        inputvaluetext.textContent = event.target.value + '% Bal'; 
        const gradient = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${positionsizeinput.value}%, #ccc ${positionsizeinput.value}%, #ccc 100%)`;
        
        positionsizeinput.style.setProperty('--track-fill', gradient);
    });
    
    darkscreen.addEventListener('click', () => {sidebar.style.transform = 'translateX(-100%)';darkscreen.style.opacity = '0';
            darkscreen.style.pointerEvents = 'none'; document.body.style.overflow = 'auto';})
            
    burger.addEventListener('click', () => {
        if (sidebar.style.transform === 'translateX(0%)') {
            sidebar.style.transform = 'translateX(-100%)';
            darkscreen.style.opacity = '0';
            darkscreen.style.pointerEvents = 'none';
            document.body.style.overflow = 'auto';
        } else {
            sidebar.style.transform = 'translateX(0%)';
            darkscreen.style.opacity = '1';
            darkscreen.style.pointerEvents = 'auto';
            document.body.style.overflow = 'hidden';
        }
    });



    function valueanimation(el, start, end, formatter = v => v) {
        let startTime = null;

        if (!el) return;
        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / 500, 1);
            const value = start + (end - start) * progress;

            el.textContent = formatter(value);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    function changebg(modeVal) {
        bgmode = modeVal;
        if (bgmode === 'dark') {
            document.body.classList.add('dark');
            gridcolor = 'rgba(179, 179, 179, 0.1)';
            if (themecircle) themecircle.style.left = '24px';
            if (themetoggle) {
                themetoggle.style.backgroundColor = '#1c2731ff';
                leg1.style.fill = 'white';
                leg2.style.fill = 'white';
            }
            if (updatetoggle && animationtoggle) {
                updatetoggle.style.backgroundColor = '#1c2731ff';
                animationtoggle.style.backgroundColor = '#1c2731ff';
            }
        } else {
            document.body.classList.remove('dark');
            gridcolor = 'rgba(0, 0, 0, 0.18)';
            if (themecircle) themecircle.style.left = '0px';
            if (themetoggle) {
                themetoggle.style.backgroundColor = '#e0e0e0';
                leg1.style.fill = '#1A2B5F';
                leg2.style.fill = '#1A2B5F';
            }
            if (updatetoggle && animationtoggle) {
                updatetoggle.style.backgroundColor = '#e0e0e0';
                animationtoggle.style.backgroundColor = '#e0e0e0';
            }
        }
        try { localStorage.setItem('mode', bgmode); } catch (e) {}
    }

    if (themetoggle) {
        themetoggle.addEventListener('click', () => {
            changebg(bgmode === 'light' ? 'dark' : 'light');
        });
    }

    function toggleupdate(){
        if (autoupdate === false){
            updatecircle.style.left = '24px';
            updatecircle.style.backgroundColor = '#14B5A7'
            autoupdate = true;
        } else{
            updatecircle.style.left = '0px';
            updatecircle.style.backgroundColor = 'gray'
            autoupdate = false;     
        }
        try { localStorage.setItem('update', autoupdate); } catch (e) {}
    }

    function toggleanimation(){
        if (animate === false){
            animationcircle.style.left = '24px';
            animationcircle.style.backgroundColor = '#14B5A7'
            animate = true;
        } else{
            animationcircle.style.left = '0px';
            animationcircle.style.backgroundColor = 'gray'
            animate = false;     
        }
        try { localStorage.setItem('animate', animate); } catch (e) {}
    }

    if (updatetoggle){
        updatetoggle.addEventListener('click', () => {
            toggleupdate();
        });
    }

    if (animationtoggle){
        animationtoggle.addEventListener('click', () => {
            toggleanimation();
        });
    }

    

    if (autoupdate === false){
        updatecircle.style.left = '0px';
        updatecircle.style.backgroundColor = 'gray'
    } else{
        updatecircle.style.left = '24px';
        updatecircle.style.backgroundColor = '#14B5A7'
    }
    if (animate === false){
        animationcircle.style.left = '0px';
        animationcircle.style.backgroundColor = 'gray'
    } else{
        animationcircle.style.left = '24px';
        animationcircle.style.backgroundColor = '#14B5A7'
    }
    changebg(bgmode);

    let mode = 'ev';
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

    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (autoupdate === true){   
                if (input.classList.contains('sizeinput')){
                    updatecalculationsize()
                } else{
                    updatecalculation()
                }
            }
        })
    });

    evbutton.addEventListener('click', () => {
        mode = 'ev';
        indicator.style.transform = 'translateX(0)';
        evbutton.classList.add('active');
        randombutton.classList.remove('active');
    });

    randombutton.addEventListener('click', () => {
        mode = 'random';
        indicator.style.transform = 'translateX(100%)';
        randombutton.classList.add('active');
        evbutton.classList.remove('active');
    });

    function drawChart(balanceHistory, initialBalance, numberoftrades) {
        const ctx = document.getElementById('chart').getContext('2d');
        if (!ctx) return;
        const step = numberoftrades / (balanceHistory.length - 1);
        const labels = balanceHistory.map((_, i) => Math.round(i * step));
        if (chartInstance) {chartInstance.destroy();}

        chartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Balance',
                        data: balanceHistory,
                        borderWidth: 2,
                        backgroundColor: 'rgba(25, 212, 196, 1)',
                        borderColor: 'rgba(25, 212, 196, 1)',
                        tension: 0.2,
                    },
                    {
                        label: 'Initial Balance',
                        data: Array(balanceHistory.length).fill(initialBalance),
                        borderWidth: 1.5,
                        borderDash: [5, 5],
                        backgroundColor: 'rgba(221, 78, 78, 1)',
                        borderColor: 'rgba(221, 83, 83, 1)'
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
                            callback: val => '$' + magnitude(val, 0)
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: ctx => '$' + magnitude(ctx.raw, 2)
                        }
                    }
                },
                elements: {
                    point: {
                        borderWidth: 0,
                        radius:0,
                    }
                }
            }
        });
    }

    function magnitude(num, round=2) {
        if (num >= 1e5 && num < 1e6) {
            return (num / 1e3).toFixed(round) + 'K';
        }else if (num >= 1e6 && num < 1e9) {
            return (num / 1e6).toFixed(round) + 'M';
        } else if (num >= 1e9 && num < 1e12) {
            return (num / 1e9).toFixed(round) + 'B';
        } else if (num >= 1e12 && num < 1e15) {
            return (num / 1e12).toFixed(round) + 'T';
        } else if (num >= 1e15 && num < 1e18) {
            return (num / 1e15).toFixed(round) + 'Qa';  
        } else if (num >= 1e18 && num < 1e21) {
            return (num / 1e18).toFixed(round) + 'Qi'; 
        } else if (num >= 1e21 && num < 1e24) {
            return (num / 1e21).toFixed(round) + 'Sx';  
        } else if (num >= 1e24 && num < 1e27) {
            return (num / 1e24).toFixed(round) + 'Sp'; 
        } else if (num >= 1e27 && num < 1e30) {
            return (num / 1e27).toFixed(round) + 'Oc';  
        } else if (num >= 1e30 && num < 1e33) {
            return (num / 1e30).toFixed(round) + 'No'; 
        } else if (num >= 1e33 && num < 1e36) {
            return (num / 1e33).toFixed(round) + 'Dc'; 
        } else if (num >= 1e36) {
            return "Limit Exceeded";
        } else {
            return num.toFixed(round);
        }
    }

    function updatecalculation(){
        let winrate = parseFloat(document.getElementById('winrateinput').value);
        let winamount = parseFloat(document.getElementById('winamountinput').value);
        let lossamount = parseFloat(document.getElementById('lossamountinput').value);
        let startbalance = parseFloat(document.getElementById('startbalanceinput').value);
        let positionsize = parseFloat(document.getElementById('positionsizeinput').value);
        let numberoftrades = parseInt(document.getElementById('numberoftradesinput').value, 10);
        let commission = parseFloat(document.getElementById('commissioninput').value);

        if (
            isNaN(winrate) || isNaN(winamount) || isNaN(lossamount) ||
            isNaN(startbalance) || isNaN(positionsize) || isNaN(numberoftrades) ||
            isNaN(commission)
        ) {
            error.style.display = 'block';
            return;
        }
        error.style.display = 'none';

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

        let endbalance = startbalance;
        let totalcommission = 0;
        let evPerTrade = 0;

        const riskreward = lossamount === 0 ? Infinity : (winamount / lossamount);

        const balancehistory = [startbalance]

        const expected = 1 + ((winrate/100) * winamount - ((100-winrate)/100) * lossamount) * (positionsize / 10000) - (commission * positionsize / 10000);

        if (mode === 'ev') {
            for (let i = 0; i < numberoftrades; i++) {
                const commissionAmount = (commission * positionsize * endbalance) / 10000;
                totalcommission += commissionAmount;
                endbalance *= expected;
                balancehistory.push(endbalance);
            }
        } else {
            for (let i = 0; i < numberoftrades; i++) {
                const commissionAmount = (commission * positionsize * endbalance) / 10000;
                totalcommission += commissionAmount;
                const win = Math.random() < winrate/100;
                if (win) {
                    endbalance *= 1 + (winamount * positionsize / 10000) - (commission * positionsize / 10000);
                } else {
                    endbalance *= 1 - (lossamount * positionsize / 10000) - (commission * positionsize / 10000);
                }
                balancehistory.push(endbalance);
            }
        }
        const profitloss = endbalance - startbalance;
        evPerTrade = profitloss / numberoftrades;

        const charthistory = []
        for (let i = 0; i < numberoftrades; i+=Math.max(300, numberoftrades)/300) {
            charthistory.push(balancehistory[Math.round(i)]);
        }


        drawChart(charthistory, startbalance, numberoftrades);

        if (animate) {
            valueanimation(endbalancetext,prevendbalance,endbalance,v => '$' + magnitude(v));
        } else {
            endbalancetext.textContent = '$' + magnitude(endbalance);
        }
        prevendbalance = endbalance;

        if (animate) {
            valueanimation(evtext,prevEV,evPerTrade,v => '$' + magnitude(v));
        } else {
            evtext.textContent = '$' + magnitude(evPerTrade);
        }
        prevEV = evPerTrade;

        if (isFinite(riskreward)) {
            if (animate) {
                valueanimation(riskrewardtext,prevrr,riskreward,v => magnitude(v));
            } else {
                riskrewardtext.textContent = magnitude(riskreward);
            }
            prevrr = riskreward;
        } else {
            riskrewardtext.textContent = '—';
            prevrr = 0;
        }

        if (animate) {
            valueanimation(
                totalcommissionstext,
                prevcomm,
                totalcommission,
                v => '$' + magnitude(v)
            );
        } else {
            totalcommissionstext.textContent = '$' + magnitude(totalcommission);
        }
        prevcomm = totalcommission;

        const accountRisk = positionsize * lossamount / 10000 * 100;
        if (animate) {
            valueanimation(accountriskvalue,prevaccountrisk,accountRisk,v => v.toFixed(2) + '%');
        } else {
            accountriskvalue.textContent = accountRisk.toFixed(2) + '%';
        }
        prevaccountrisk = accountRisk;

        const absProfitLoss = Math.abs(profitloss);
        const prefix = profitloss > 0 ? '+$' : profitloss < 0 ? '-$' : '$';
        if (animate) {
            valueanimation(profitlosstext,Math.abs(prevpl),absProfitLoss,
                v => {
                    return prefix + magnitude(v);
                }
            );
        } else {
            profitlosstext.textContent = prefix + magnitude(absProfitLoss);
        }
        prevpl = profitloss;

        
        if (profitloss > 0) {
            profitlosstext.classList.add('greentext');
            profitlosstext.classList.remove('redtext');
            endbalancetext.classList.add('greentext');
            endbalancetext.classList.remove('redtext');
        } else if (profitloss < 0) {
            profitlosstext.classList.add('redtext');
            profitlosstext.classList.remove('greentext');
            endbalancetext.classList.add('redtext');
            endbalancetext.classList.remove('greentext');
        } else {
            profitlosstext.classList.remove('greentext', 'redtext');
            endbalancetext.classList.remove('greentext', 'redtext');
        }
    }

    calculate.addEventListener('click', () => {updatecalculation()});

    function updatecalculationsize(){
        accsize = parseFloat(document.getElementById('accsizeinput').value);
        stoploss = parseFloat(document.getElementById('stoplossinput').value);
        console.log(accsize, stoploss)
        if (isNaN(accsize) || isNaN(stoploss)) {
            errorsize.style.display = 'block';
            return;
        }
        console.log('yes')
        errorsize.style.display = 'none';
    
        riskvalues = []
        riskvalues.push(accsize * 0.5 / stoploss)
        riskvalues.push(accsize / stoploss)
        riskvalues.push(accsize * 2 / stoploss)
        current = 0
            riskvaluestext.forEach(t => {
                if (animate) {
                    valueanimation(
                        t,
                        prevriskvalues[current],
                        riskvalues[current],
                        v => '$' + magnitude(v)
                    );
                } else {
                    t.textContent = '$' + magnitude(riskvalues[current]);
                }
                current+=1
            });

        prevriskvalues = riskvalues
    }

    calculatesize.addEventListener('click', () => {updatecalculationsize()});
});
