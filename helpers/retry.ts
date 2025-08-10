const retry = async <T>(
  operation: () => Promise<T>,
  retries: number = 3,
  delay: number = 1000
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    console.warn(`Operation failed, retrying in ${delay}ms...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
    await retry(operation, retries - 1, delay * 2);
  }

  throw new Error("Max retries exceeded");
};

export default retry;
