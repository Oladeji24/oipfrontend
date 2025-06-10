// Example: TraderDashboard.js
import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Table, Dropdown, DropdownButton, Spinner, Modal } from 'react-bootstrap';
import { getWalletBalance, getWalletLogs, deposit, withdraw } from '../api/wallet';
import { requestWithdrawal } from '../api/withdrawal';
import { startBot, stopBot, switchBotMarket } from '../api/bot';
import BotStatus from './BotStatus';
import { useToast } from '../utils/ToastContext';
import TradeDetailModal from './TradeDetailModal';

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
  const [depositing, setDepositing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
  const [showBotConfirm, setShowBotConfirm] = useState(false);
  const [pendingBotAction, setPendingBotAction] = useState(null);
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const { showToast } = useToast();

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
    setDepositing(true);
    try {
      await deposit(10000, 'NGN');
      showToast('Deposit initiated!', 'success');
    } catch (e) {
      showToast('Deposit failed.', 'danger');
    }
    setDepositing(false);
  };
  const handleWithdraw = async () => {
    setWithdrawing(true);
    try {
      await requestWithdrawal('user@example.com', 5000, 'NGN');
      showToast('Withdrawal requested! Check your email for OTP.', 'success');
    } catch (e) {
      showToast('Withdrawal failed.', 'danger');
    }
    setWithdrawing(false);
    setShowWithdrawConfirm(false);
  };
  const handleBotAction = async (action) => {
    if (action === 'stop') {
      setPendingBotAction(action);
      setShowBotConfirm(true);
      return;
    }
    await doBotAction(action);
  };
  const doBotAction = async (action) => {
    try {
      if (action === 'crypto') {
        await startBot('crypto');
        setBotMarket('crypto');
        setBotStatus('running');
        showToast('Crypto bot started!', 'success');
      } else if (action === 'forex') {
        await startBot('forex');
        setBotMarket('forex');
        setBotStatus('running');
        showToast('Forex bot started!', 'success');
      } else if (action === 'stop') {
        await stopBot();
        setBotStatus('stopped');
        showToast('Bot stopped.', 'success');
      }
    } catch (e) {
      showToast('Bot action failed.', 'danger');
    }
    setShowBotConfirm(false);
  };
  const handleTradeClick = (trade) => {
    setSelectedTrade(trade);
    setShowTradeModal(true);
  };

  return (
    <ErrorBoundary>
      <Card className="mb-4">
        <Card.Header as="h2">Trader Dashboard <BotStatus status={botStatus} market={botMarket} /></Card.Header>
        <Card.Body>
          {loading ? <Spinner animation="border" /> : (
            <>
              <Row className="mb-3">
                <Col>
                  <h5>Wallet Balance</h5>
                  <p>NGN: ₦{balance.ngn.toLocaleString()}</p>
                  <p>USD: ${balance.usd.toLocaleString()}</p>
                </Col>
                <Col>
                  <Button variant="success" className="me-2" onClick={handleDeposit} disabled={depositing}>
                    {depositing ? <Spinner size="sm" animation="border" /> : 'Deposit'}
                  </Button>
                  <Button variant="danger" onClick={() => setShowWithdrawConfirm(true)} disabled={withdrawing}>
                    {withdrawing ? <Spinner size="sm" animation="border" /> : 'Withdraw'}
                  </Button>
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
                      {logs.length === 0 ? (
                        <tr><td colSpan={4}>No transactions yet.</td></tr>
                      ) : logs.map((log, idx) => (
                        <tr key={idx} style={{ cursor: 'pointer' }} onClick={() => handleTradeClick(log)}>
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
      {/* Withdraw Confirmation Modal */}
      <Modal show={showWithdrawConfirm} onHide={() => setShowWithdrawConfirm(false)}>
        <Modal.Header closeButton><Modal.Title>Confirm Withdrawal</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to withdraw 5,000 NGN?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowWithdrawConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleWithdraw} disabled={withdrawing}>
            {withdrawing ? <Spinner size="sm" animation="border" /> : 'Confirm Withdraw'}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Bot Stop Confirmation Modal */}
      <Modal show={showBotConfirm} onHide={() => setShowBotConfirm(false)}>
        <Modal.Header closeButton><Modal.Title>Stop Bot</Modal.Title></Modal.Header>
        <Modal.Body>Are you sure you want to stop the trading bot?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBotConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => doBotAction(pendingBotAction)}>Stop Bot</Button>
        </Modal.Footer>
      </Modal>
      {/* Trade Detail Modal */}
      <TradeDetailModal show={showTradeModal} onHide={() => setShowTradeModal(false)} trade={selectedTrade} />
    </ErrorBoundary>
  );
};

export default TraderDashboard;
