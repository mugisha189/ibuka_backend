import { ConfigType, registerAs } from '@nestjs/config';

export const cacheRegToken = 'cache';

export const CacheConfig = registerAs(cacheRegToken, () => ({
    cache_key_jobs: process.env.CACHING_KEY_JOBS,
    cache_key_categories: process.env.CACHING_KEY_CATEGORIES,
    cache_key_types: process.env.CACHING_KEY_TYPES,
    cache_key_tags: process.env.CACHING_KEY_TAGS,
    cache_duration: process.env.CACHING_DURATION,
    cache_business: process.env.CACHING_KEY_BUSINESS,
    cache_events: process.env.CACHING_KEY_EVENTS,
    cache_messages: process.env.CACHING_KEY_MESSAGES,
    cache_users: process.env.CACHING_CHANNEL_USERS,
    cache_paypal_duration: process.env.CACHING_PAYPAL_TOKEN_DURATION,
    cache_paypal_key: process.env.CACHING_PAYPAL_KEY,
    cache_paypal_transactions: process.env.CACHING_PAYPAL_TRANSACTIONS || 'all_transactions',
    cache_all_channels: process.env.CACHING_ALL_CHANNELS || 'all_channels'
}));
export type ICachingConfig = ConfigType<typeof CacheConfig>;

