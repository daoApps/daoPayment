import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import registry from './tools/registry.js';
import { ITool } from './tools/types.js';

class MCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'monad-agentic-payment',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = Array.from(registry.values()).map((tool: ITool) => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema,
      }));

      return {
        tools,
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const tool = registry.get(request.params.name);
      if (!tool) {
        throw new McpError(
          ErrorCode.MethodNotFound,
          `Unknown tool: ${request.params.name}`
        );
      }

      try {
        const result = await tool.execute(request.params.arguments);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2),
            },
          ],
        };
      } catch (error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${(error as Error).message}`
        );
      }
    });
  }

  async startStdio() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Monad Agentic Payment MCP Server running on stdio');
  }

  getServer(): Server {
    return this.server;
  }
}

export default MCPServer;

import { fileURLToPath } from 'url';
if (import.meta.url === `file://${fileURLToPath(import.meta.url)}` && process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = new MCPServer();
  server.startStdio().catch((error) => {
    console.error('Fatal error starting MCP server:', error);
    process.exit(1);
  });
}
