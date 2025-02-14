/*
    Here are explainations for the issue and the refactored verson of the code.

    Issue 1: Interface WalletBalance missing blockchain property
        - The WalletBalance interface is missing the blockchain property.
    Fix: Add the blockchain property to the WalletBalance interface.

    Issue 2: Incorrect flitering logic in useMemo
        - The variable lhsPriority is undefined in the filter function.
        - The condition lhsPriority > -99 should instead check the priority of the current balance.
    Fix: Replace lhsPriority with balancePriority.

    Issue 3: Unneccessary dependency in useMemo
        - The prices is included in the dependency array even though it's not used in sorting. This causes unnecessary recomputation when prices change.
    Fix: Remove prices from the dependency array.

    Issue 4: Inefficient map in formattedBalances
        - formattedBalances is derived from sortedBalances, but it does not need a separate map operation. This results in unnecessary computation.
    Fix: Remove the map operation for formattedBalances and include the formatted property in the sortedBalances.

    Issue 5: Inefficient Priority Calculation
        - The getPriority function uses a switch statement to calculate the priority based on the blockchain. This can be simplified and optimized.
    Fix: Refactor the getPriority function to use an object mapping for blockchain priorities.

    Issue 6: InEfficient getPriority calls
        - The getPriority function is called multiple times for each balance in the balances array. This can be optimized to avoid multiple calls.
    Fix: Add a priority property to each balance object in the map function to avoid multiple calls to getPriority.

    Issue 7: Inefficient key used in .map()
        - The key used in the .map() function is the index, which can cause React rendering inefficiencies.
    Fix: Use a unique identifier from the balance object as the key in the .map() function such as balance.currency.

    Issue 8: Incorrect type used in row.map()
        - The sortedBalances.map function uses FormattedWalletBalance in the type annotation, but sortedBalances contains WalletBalance, which does not have the formatted field.
    Fix: Either create formattedBalances correctly or ensure formatted is included in sortedBalances
*/

// Here is the refactored version of the code with the issues fixed:

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Added blockchain property
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {}

const getPriority = (blockchain: string): number => {
  const priorities: Record<string, number> = {
    Osmosis: 100,
    Ethereum: 50,
    Arbitrum: 30,
    Zilliqa: 20,
    Neo: 20,
  };
  return priorities[blockchain] ?? -99;
}; // Optimized getPriority function

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    return balances
      .map((balance) => ({
        ...balance,
        priority: getPriority(balance.blockchain), // added priority property in each balance to avoid multiple calls to getPriority
      }))
      .filter((balance) => balance.priority > -99 && balance.amount <= 0) // Fixed filtering logic
      .sort((lhs, rhs) => rhs.priority - lhs.priority)
      .map((balance) => ({
        ...balance,
        formatted: balance.amount.toFixed(),
      })); // Include formatted property in sortedBalances
  }, [balances]); // Removed prices from dependency array

  return (
    <div {...rest}>
      {sortedBalances.map((balance: FormattedWalletBalance) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
          <WalletRow
            className={classes.row}
            key={balance.currency} // Use balance.currency as key
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
          />
        );
      })}
    </div>
  );
};
