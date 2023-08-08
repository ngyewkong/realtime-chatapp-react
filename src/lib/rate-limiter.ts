
import { Ratelimit } from '@upstash/ratelimit'
import { db } from './db'

// Create a new ratelimiter, that allows 10 requests per 10 seconds
export const rateLimiter = new Ratelimit({
  redis: db,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: '@upstash/ratelimit',
})