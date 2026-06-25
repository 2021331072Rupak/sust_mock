# QueueStorm Warmup: Mock Preliminary Task

A rule-based web service that reads customer CRM messages and automatically classifies their case type, severity, and department for immediate routing. 

## Tech Stack
* Node.js
* Express.js

## Features
* `GET /health` - Returns a simple service health response.
* `POST /sort-ticket` - Accepts a JSON ticket body and returns a structured classification response.
* **Safety Rules Compliant:** The agent summaries are strictly neutral and never request sensitive information (PIN, OTP, password, card number).
* **Speed:** Rule-based architecture guarantees response times well under the 30-second constraint.

## Local Deployment Runbook

1. **Clone the repository:**
   ```bash
   git clone <YOUR_GITHUB_REPO_URL>
   cd <REPO_NAME>
