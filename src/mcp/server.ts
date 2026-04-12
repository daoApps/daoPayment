import { createServer, IncomingMessage, ServerResponse } from 'http';
import MainManager from '../core/mainManager';

class MCPServer {
  private server: ReturnType<typeof createServer>;
  private manager: MainManager;

  constructor(port: number = 3000) {
    this.manager = new MainManager();
    this.server = createServer(this.handleRequest.bind(this));
    this.server.listen(port, () => {
      console.log(`MCP Server running on port ${port}`);
    });
  }

  private handleRequest(req: IncomingMessage, res: ServerResponse) {
    res.setHeader('Content-Type', 'application/json');

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const request = JSON.parse(body);
          this.handleMCPRequest(request, res);
        } catch (error) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Invalid JSON' }));
        }
      });
    } else {
      res.statusCode = 405;
      res.end(JSON.stringify({ error: 'Method not allowed' }));
    }
  }

  private handleMCPRequest(request: any, res: ServerResponse) {
    const { toolcall } = request;
    if (!toolcall) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Missing toolcall' }));
      return;
    }

    const { name, params } = toolcall;
    switch (name) {
      case 'createWallet':
        this.handleCreateWallet(res);
        break;
      case 'getWalletBalance':
        this.handleGetWalletBalance(params, res);
        break;
      case 'executePayment':
        this.handleExecutePayment(params, res);
        break;
      case 'generateSessionKey':
        this.handleGenerateSessionKey(params, res);
        break;
      case 'listAuditRecords':
        this.handleListAuditRecords(params, res);
        break;
      case 'createPolicy':
        this.handleCreatePolicy(params, res);
        break;
      case 'createTemplatePolicy':
        this.handleCreateTemplatePolicy(params, res);
        break;
      case 'setBudget':
        this.handleSetBudget(params, res);
        break;
      case 'getBudget':
        this.handleGetBudget(params, res);
        break;
      default:
        res.statusCode = 404;
        res.end(JSON.stringify({ error: 'Tool not found' }));
    }
  }

  private handleCreateWallet(res: ServerResponse) {
    try {
      const walletAddress = this.manager.createWallet();
      res.statusCode = 200;
      res.end(JSON.stringify({ result: { walletAddress } }));
    } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: (error as Error).message }));
      }
  }

  private async handleGetWalletBalance(params: any, res: ServerResponse) {
    try {
      const { walletAddress } = params;
      const balance = await this.manager.getAgentInterface().getWalletBalance(walletAddress);
      res.statusCode = 200;
      res.end(JSON.stringify({ result: { balance } }));
    } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: (error as Error).message }));
      }
  }

  private async handleExecutePayment(params: any, res: ServerResponse) {
    try {
      // 检查是否使用 session key
      if (params.sessionKeyId) {
        const { sessionKeyId, walletAddress, ...paymentRequest } = params;
        const result = await this.manager.executePaymentWithSessionKey(
          sessionKeyId,
          walletAddress,
          paymentRequest
        );
        res.statusCode = 200;
        res.end(JSON.stringify({ result }));
      } else {
        // 传统方式：使用 Agent 权限系统
        const result = await this.manager.getAgentInterface().executePayment(params);
        res.statusCode = 200;
        res.end(JSON.stringify({ result }));
      }
    } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: (error as Error).message }));
      }
  }

  private handleGenerateSessionKey(params: any, res: ServerResponse) {
    try {
      const { agentId, walletAddress, permissions, expiration, maxAmount, dailyLimit } = params;
      const sessionKey = this.manager.generateSessionKey(
        agentId,
        walletAddress,
        permissions,
        expiration,
        maxAmount,
        dailyLimit
      );
      res.statusCode = 200;
      res.end(JSON.stringify({ result: sessionKey }));
    } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: (error as Error).message }));
      }
  }

  private handleListAuditRecords(params: any, res: ServerResponse) {
    try {
      const records = this.manager.getAuditIntegrator().listAuditRecords(params);
      res.statusCode = 200;
      res.end(JSON.stringify({ result: records }));
    } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: (error as Error).message }));
      }
  }

  private handleCreatePolicy(params: any, res: ServerResponse) {
    try {
      const { policyId, name, description, rules } = params;
      this.manager.getSecurityManager().createPolicy(policyId, name, description, rules);
      res.statusCode = 200;
      res.end(JSON.stringify({ result: { success: true } }));
    } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: (error as Error).message }));
      }
  }

  private handleCreateTemplatePolicy(params: any, res: ServerResponse) {
    try {
      const { templateType } = params;
      const policy = this.manager.createTemplatePolicy(templateType);
      res.statusCode = 200;
      res.end(JSON.stringify({ result: policy }));
    } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: (error as Error).message }));
      }
  }

  private handleSetBudget(params: any, res: ServerResponse) {
    try {
      const { walletAddress, dailyLimit, weeklyLimit } = params;
      this.manager.getSecurityManager().getBudgetManager().setBudget(walletAddress, dailyLimit, weeklyLimit);
      res.statusCode = 200;
      res.end(JSON.stringify({ result: { success: true } }));
    } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: (error as Error).message }));
      }
  }

  private handleGetBudget(params: any, res: ServerResponse) {
    try {
      const { walletAddress } = params;
      const budget = this.manager.getSecurityManager().getBudgetManager().getBudget(walletAddress);
      res.statusCode = 200;
      res.end(JSON.stringify({ result: budget }));
    } catch (error) {
        res.statusCode = 500;
        res.end(JSON.stringify({ error: (error as Error).message }));
      }
  }

  stop() {
    this.server.close();
  }
}

export default MCPServer;