#!/usr/bin/env node
import MCPServer from './server.js';

const server = new MCPServer();
server.startStdio().catch((error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});
