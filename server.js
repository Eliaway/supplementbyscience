// Entry point for Hostinger deployment
// This runs the pre-built server
import('./dist/index.js').catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
