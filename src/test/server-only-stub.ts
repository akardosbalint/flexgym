// Stubs the "server-only" marker package for Vitest, which doesn't go
// through Next.js's bundler (the thing that normally makes that package's
// throw only fire when it ends up in a client bundle). See vitest.config.ts.
export {};
