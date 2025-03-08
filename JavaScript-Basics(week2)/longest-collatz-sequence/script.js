// Cache for storing sequence lengths
const collatzCache = new Map();

const collatzLength = (n) => {
  let original = n;
  let count = 0;

  while (n > 1 && !collatzCache.has(n)) {
    count++;
    n = n % 2 === 0 ? n / 2 : 3 * n + 1;
  }

  //Add cached value to the count if it exists in the cache
  if (collatzCache.has(n)) {
    count += collatzCache.get(n);
  }

  // Store in cache
  collatzCache.set(original, count);
  return count;
};

// Function to find the longest Collatz sequence under a given limit
const findLongestCollatz = (limit) => {
  let maxLength = 0;
  let bestNumber = 1;

  for (let i = limit - 1; i > 0; i -= 2) {
    const length = collatzLength(i);
    if (length > maxLength) {
      maxLength = length;
      bestNumber = i;
    }
  }

  return { bestNumber, maxLength };
};

// Function for interactive Collatz sequence generation
const collatzSequence = function* (n) {
  while (n > 1) {
    yield n;
    n = n % 2 === 0 ? n / 2 : 3 * n + 1;
  }
  yield 1; // Yield 1 at the end
};

function runCollatz() {
  const input = prompt(
    "Enter a positive integer to generate the Collatz sequence (or leave empty to find longest under 1,000,000):"
  );
  const startingNumber = Number(input);

  // If user input is valid, generate sequence
  if (Number.isInteger(startingNumber) && startingNumber > 0) {
    let count = 0;
    console.log("Collatz sequence:");
    for (const num of collatzSequence(startingNumber)) {
      console.log(num);
      count++;
    }
    console.log(`Sequence length: ${count}`);
  } else {
    // If no input, find the longest sequence under 1,000,000
    const limit = 1_000_000;
    const result = findLongestCollatz(limit);
    console.log(
      `Longest sequence under ${limit}: Starting number ${result.bestNumber}, Length: ${result.maxLength}`
    );
  }
}

window.onload = runCollatz;
