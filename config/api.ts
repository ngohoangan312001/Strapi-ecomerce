export default ({ env }) => ({
  responses: {
    privateAttributes: ['_v', 'id', 'created_at'],
  },
  rest: {
    prefix: env('API_PREFIX', '/'),
    defaultLimit: 25,
    maxLimit: 100,
    withCount: true,
  },
});
