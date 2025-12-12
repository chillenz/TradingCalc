
# Trading Strategy Calculator

Trading Strategy Calculator is a website based tool for testing and analyzing your trading strategy based on parameters like win rates and commission with methods like expected value and Monte Carlo simulation.

## Input Parameters

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

## Outputs
| Parameters             | Description                                                                |
| ----------------- | ------------------------------------------------------------------ |
| Ending Balance | Account capital after all trades |
| Total P/L | Total Profit/Loss after all trades |
| Account Risk | Percentage of account risked on each trade |
| Expected Value | Average Profit/Loss on eaach trade |
| Risk/Reward | The ratio of win amount to loss amount |
| Fees Paid | Total amount of fees paid after all trades |
| Balance Graph | Equity curve of account balance over time |

## Demo

Website Demo

![demo video](https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExYjcwdzd1bWdjejQ0ZmhzNG8wNDRpMHAxMW1hdmNnNDJxMW1sZnNlciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/FOUJMfx8eeSMPz69N7/giphy.gif)
## Change Logs

**Version 2.2 (Current)**
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
## Tech Stack

**Frontend:** HTML5, CSS3, Javascript

**Chart:** Chart.js

**Calculation:** Javascript

**Storage:** LocalStorage
