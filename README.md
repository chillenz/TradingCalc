
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
# Trading Strategy Calculator

This is a website based tool for testing and analyzing your trading strategy based on parameters like win rates and commission with methods like expected value and Monte Carlo simulation. It can also do other things like calculate optimal position size.



## Strategy Input Parameters

| Parameters             | Description                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Win Rate | The probability of winning each trade |
| Win Amount | Profit per winning trade in percentage |
| Loss Amount | Loss per losing trade in percentage |
| Starting balance | Initial account capital |
| Position size | Percentage of account to put in each trade |
| Number of trades | Total trades to simulate |
| Commission | Fee per trade |
| Calculation Mode | How each trade's result is determined |

## Strategy Outputs
| Parameters             | Description                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Ending Balance | Account capital after all trades |
| Total P/L | Total Profit or Loss after all trades |
| Account Risk | Percentage of account risked on each trade |
| Expected Value | Average Profit/Loss on eaach trade |
| Risk/Reward | The ratio of win amount to loss amount |
| Fees Paid | Total amount of fees paid after all trades |
| Balance Graph | Equity curve of account balance over time |

## Features
- **Multiple Calculation Modes**: Expected Value and Monte Carlo Simulation
- **Risk management**: Optimal position sizing calculator
- **Visualization**: Interactive equity curve with chart.js
- **Responsive design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Toggle between themes for comfortable viewing

## Demo
Website Demo

![demo video](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjcwdzd1bWdjejQ0ZmhzNG8wNDRpMHAxMW1hdmNnNDJxMW1sZnNlciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FOUJMfx8eeSMPz69N7/giphy.gif)
## Tech Stack

**Frontend:** HTML5, CSS3, Javascript

**Chart:** Chart.js

**Calculation:** Javascript

**Storage:** LocalStorage
## Change Logs

**Version 4 (current)**
- Changed name to TradingCalc
- Added icon
- Added home page
- Added compounding calculator 

**Version 3.3**
- Fixed account risk not showing
- Fixed default settings
- Fixed instant update not working on presets

**Version 3.2**
- Changed from vh to dvh to account for bookmarks and bars
- Added icon for each navigation
- Added settings

**Version 3.1**
- Fixed position size page in mobile
- Fixed theme toggle overlap with mobile nav bar
- Updated strategy calculator size in mobile

**Version 3**
- Added position size calculator
- Fixed trade # in chart
- Added hamburger and sidebar
- Moved dark mode toggle to sidebar

**Version 2.4**
- Updated calculation logic
- Changed chart color
- Improved mobile UI
- Win/loss amount -> Win/loss return
- Added number animation and sliding animation

**Version 2.3**
- Fixed shadow
- Fixed chart border
- Added tooltips for results
- Made input and output sides' height equal
- Better chart in mobile version

**Version 2.2**
- Changed default mode to dark
- Combined everything into one window
- Fixed mobile overflow
- Improved UI
- Removed an unnecessary function (parsepreset)
- Added magnitude (M,B,T, and more)

**Version 2.1**
- Added parameters' max value
- Changed postion size into range input
- Added README.md 

**Version 2**
- UI redesign
- Change chart to Chart.js
- Changed expected value mode calculation logic

**Version 1.2**
- Color palette change
- Added key levels to chart

**Version 1.1**
- Added input error handling

**Version 1**
- Initial Release
