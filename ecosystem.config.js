module.exports = {
  apps: [
    {
      name: "hebronai-v2",
      script: "./node_modules/next/dist/bin/next",
      args: "start",
      cwd: "/home/USERNAME/public_html/hebronai-v2",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "./logs/error.log",
      out_file: "./logs/output.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      min_uptime: "10s",
      max_restarts: 10,
      restart_delay: 4000,
    },
  ],
};
