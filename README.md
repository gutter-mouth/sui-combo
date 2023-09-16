**Assumption**
In the context of LSD (Leveraged Staking Derivatives), there is an active pursuit of yield acquisition. Investors have devised a strategy that combines lending/swap as one of the methods to optimize yields, known as the spot leverage position construction strategy. This strategy involves depositing A → borrowing B → swapping B to A repeatedly. Due to the stability in the price changes of the currency pair, it is relatively safe to construct leverage positions.

**Challenge**
To construct or unwind a spot leverage position, it is necessary to execute various transactions across multiple DApps, which can be cumbersome. When building an LSD leverage position, assuming Token A as LST and Token B as the native token, the following actions are required:
- To construct a leverage position, you need to repeat the following multiple times:
  - Hold Token A (e.g., stSui).
  - Deposit Token A in Dapp X.
  - Borrow Token B in Dapp X (e.g., Sui).
  - Swap Token B to Token A in Dapp Y.
- To unwind a leverage position, you need to repeat the following multiple times:
  - Repay Token B in Dapp X.
  - Withdraw Token A in Dapp X.
  - Swap Token A to B in Dapp Y.

**Solution/Features**
- A tool that allows for the easy construction of spot leverage positions from a single UI.
- An intuitive UI where users can add and remove transactions they want to execute.
- By combining as many compatible transactions as possible, it reduces the number of signature steps compared to traditional methods.
- The ability to execute a set of configured transactions with one click from the UI.

**Future Feature Implementation**
- Expanding the library of transaction templates.
- Expanding support for DApps and transactions.
- Integrating support for LST (Leveraged Staking Tokens).
- Adding support for staking actions.
- Implementing automatic distribution of stakes across multiple validators.
