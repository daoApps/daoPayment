# Monad Agentic Payment

Agent-native secure payment system for Monad blockchain.

## Features
- Non-custodial wallet management
- Budget and policy management
- X402 protocol integration
- Auditing and security logs
- MCP Server integration

## Run Instructions (Python FastAPI)

This project has been migrated to Python using FastAPI and Typer.

### 1. Install Dependencies
Make sure you have Python 3.14+ installed. Create a virtual environment and install the required dependencies:

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Run the FastAPI Server
To start the FastAPI development server, use `uvicorn`:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
The API will be available at `http://localhost:8000`. You can also view the interactive API documentation at `http://localhost:8000/docs`.

### 3. Run the CLI
To use the CLI tool, run:

```bash
python3 -m app.cli --help
```
