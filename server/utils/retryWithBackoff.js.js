
async function retryWithBackoff(fn, retries = 3, delay = 1000) {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt >= retries) throw err;

      const backoffTime = delay * 2 ** (attempt - 1);
      console.warn(`[Retry] Attempt ${attempt} failed. Retrying in ${backoffTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, backoffTime));
    }
  }
}
module.exports = retryWithBackoff;
