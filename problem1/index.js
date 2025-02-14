/*Provide 3 unique implementations of the following function in JavaScript.

**Input**: `n` - any integer

*Assuming this input will always produce a result lesser than `Number.MAX_SAFE_INTEGER`*.

**Output**: `return` - summation to `n`, i.e. `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`*/

var validateInput = function (n) {
  if (n <= 0) {
    return false;
  }
  return true;
};

// implementation 1 - using loop
var sum_to_n_a = function (n) {
  if (!validateInput(n)) {
    return 0;
  }
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

// implementation 2 - using mathematical formula
var sum_to_n_b = function (n) {
  if (!validateInput(n)) {
    return 0;
  }
  return (n * (n + 1)) / 2;
};

// implementation 3 - using recursion
var sum_to_n_c = function (n) {
  if (!validateInput(n)) {
    return 0;
  }
  if (n === 1) {
    return 1;
  }
  return n + sum_to_n_b(n - 1);
};

// Testcases

console.log(sum_to_n_a(5)); // 15
console.log(sum_to_n_a(10)); // 55
console.log(sum_to_n_a(0)); // 0
console.log(sum_to_n_a(-5)); // 0

console.log(sum_to_n_b(5)); // 15
console.log(sum_to_n_b(10)); // 55
console.log(sum_to_n_b(0)); // 0
console.log(sum_to_n_b(-5)); // 0

console.log(sum_to_n_c(5)); // 15
console.log(sum_to_n_c(10)); // 55
console.log(sum_to_n_c(0)); // 0
console.log(sum_to_n_c(-5)); // 0
