// Example: TraderDashboard.js
import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Table, Dropdown, DropdownButton, Spinner, Alert } from 'react-bootstrap';
import { getWalletBalance, getWalletLogs, deposit, withdraw } from '../api/wallet';
import { requestWithdrawal } from '../api/withdrawal';
import { startBot, stopBot, switchBotMarket } from '../api/bot';
import BotStatus from './BotStatus';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    // Log error to monitoring service if needed
  }
  render() {
    if (this.state.hasError) {
      return <div className="alert alert-danger">Something went wrong. Please refresh the page.</div>;
    }
    return this.props.children;
  }
}

const TraderDashboard = () => {
  const [balance, setBalance] = useState({ ngn: 0, usd: 0 });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [botStatus, setBotStatus] = useState('stopped');
  const [botMarket, setBotMarket] = useState('crypto');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const balRes = await getWalletBalance();
        if (balRes.data && balRes.data.balance) setBalance(balRes.data.balance);
        const logsRes = await getWalletLogs();
        if (logsRes.data && logsRes.data.logs) setLogs(logsRes.data.logs);
      } catch (e) {}
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleDeposit = async () => {
    setError(''); setSuccess('');
    try {
      await deposit(10000, 'NGN');
      setSuccess('Deposit initiated!');
    } catch (e) {
      setError('Deposit failed.');
    }
  };
  const handleWithdraw = async () => {
    setError(''); setSuccess('');
    try {
      await requestWithdrawal('user@example.com', 5000, 'NGN');
      setSuccess('Withdrawal requested! Check your email for OTP.');
    } catch (e) {
      setError('Withdrawal failed.');
    }
  };
  const handleBotAction = async (action) => {
    setError(''); setSuccess('');
    try {
      if (action === 'crypto') {
        await startBot('crypto');
        setBotMarket('crypto');
        setBotStatus('running');
        setSuccess('Crypto bot started!');
      } else if (action === 'forex') {
        await startBot('forex');
        setBotMarket('forex');
        setBotStatus('running');
        setSuccess('Forex bot started!');
      } else if (action === 'stop') {
        await stopBot();
        setBotStatus('stopped');
        setSuccess('Bot stopped.');
      }
    } catch (e) {
      setError('Bot action failed.');
    }
  };

  return (
    <ErrorBoundary>
      <Card className="mb-4">
        <Card.Header as="h2">Trader Dashboard <BotStatus status={botStatus} market={botMarket} /></Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          {loading ? <Spinner animation="border" /> : (
            <>
              <Row className="mb-3">
                <Col>
                  <h5>Wallet Balance</h5>
                  <p>NGN: ₦{balance.ngn.toLocaleString()}</p>
                  <p>USD: ${balance.usd.toLocaleString()}</p>
                </Col>
                <Col>
                  <Button variant="success" className="me-2" onClick={handleDeposit}>Deposit</Button>
                  <Button variant="danger" onClick={handleWithdraw}>Withdraw</Button>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col>
                  <DropdownButton title={botStatus === 'running' ? `Bot: ${botMarket}` : 'Start Bot'}>
                    <Dropdown.Item onClick={() => handleBotAction('crypto')}>Start Crypto Trading</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleBotAction('forex')}>Start Forex Trading</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleBotAction('stop')}>Stop Trading</Dropdown.Item>
                  </DropdownButton>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h5>Transaction Logs</h5>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Amount</th>
                        <th>Currency</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {logs.map((log, idx) => (
                        <tr key={idx}>
                          <td>{log.type}</td>
                          <td>{log.amount}</td>
                          <td>{log.currency}</td>
                          <td>{log.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </>
          )}
        </Card.Body>
      </Card>
    </ErrorBoundary>
  );
};

export default TraderDashboard;
