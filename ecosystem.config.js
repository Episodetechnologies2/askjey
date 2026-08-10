module.exports = {
  apps: [
    {
      name: 'askjey',
      // For standard deployment:
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      // For standalone deployment:
      // script: './.next/standalone/server.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
