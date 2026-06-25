const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.get('/', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'QueueStorm backend is running' });
});

function classifyTicket(message) {
    const lowerMsg = message.toLowerCase();
    
    let case_type = "other";
    let severity = "low";
    let department = "customer_support";
    let agent_summary = "Customer reported an uncategorized issue or general query.";
    let human_review_required = false;

    if (/(otp|pin|password|scam|someone called|fraud)/.test(lowerMsg)) {
        case_type = "phishing_or_social_engineering";
        severity = "critical";
        department = "fraud_risk";
        agent_summary = "Customer reported a suspicious interaction potentially involving compromised credentials or social engineering.";
        human_review_required = true;
    } else if (/(wrong number|wrong transfer|sent .* wrong)/.test(lowerMsg)) {
        case_type = "wrong_transfer";
        severity = "high";
        department = "dispute_resolution";
        agent_summary = "Customer reports sending funds to an incorrect recipient and requests recovery assistance.";
    } else if (/(failed|deducted|didn't go through)/.test(lowerMsg)) {
        case_type = "payment_failed";
        severity = "high";
        department = "payments_ops";
        agent_summary = "Customer experienced a failed transaction, potentially with funds deducted from their balance.";
    } else if (/(refund|changed my mind)/.test(lowerMsg)) {
        case_type = "refund_request";
        severity = "low";
        department = "customer_support";
        agent_summary = "Customer is requesting a refund for a previous transaction.";
    } else if (/(crash|bug|error)/.test(lowerMsg)) {
        case_type = "other";
        severity = "low";
        department = "customer_support";
        agent_summary = "Customer is reporting a technical glitch or app crash.";
    }

    return { case_type, severity, department, agent_summary, human_review_required };
}

app.get('/health', (req, res) => {
    res.status(200).json({ status: "ok", message: "Service is healthy" });
});

app.post('/sort-ticket', (req, res) => {
    try {
        const { ticket_id, channel, locale, message } = req.body;

        if (!ticket_id || !message) {
            return res.status(400).json({ error: "ticket_id and message are required fields." });
        }

        const classification = classifyTicket(message);

        const responseData = {
            ticket_id: ticket_id,
            case_type: classification.case_type,
            severity: classification.severity,
            department: classification.department,
            agent_summary: classification.agent_summary,
            human_review_required: classification.human_review_required,
            confidence: 0.90
        };

        res.status(200).json(responseData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`QueueStorm backend running on http://localhost:${PORT}`);
    });
}

module.exports = app;
