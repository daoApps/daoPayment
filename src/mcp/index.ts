import MCPServer from './server';

// 启动 MCP 服务器
const server = new MCPServer(3000);

console.log('MCP Server started on port 3000');
console.log('Agent environments can now connect to this server to use the payment system');

// 处理进程终止
process.on('SIGINT', () => {
  console.log('Shutting down MCP Server...');
  server.stop();
  process.exit(0);
});