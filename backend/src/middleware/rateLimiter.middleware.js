const buckets = new Map();

const capacity = 2;
const refillRate = 1 / 5;

export const tokenBucket = (req, res, next) => {
  const key = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket) {
    bucket = {
      tokens: capacity,
      lastRefill: now,
    };
    buckets.set(key, bucket);
  }

  const elapsedTime = (now - bucket.lastRefill) / 1000;
  const tokensToAdd = elapsedTime * refillRate;
  bucket.tokens = Math.min(bucket.tokens + tokensToAdd, capacity);
  bucket.lastRefill = now;

  if (bucket.tokens < 1) {
    return res.status(429).json({
      message: "Too many requests. Please try again later.",
    });
  }

  bucket.tokens -= 1;

  next();
};
