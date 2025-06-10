import React, { useEffect, useState } from 'react';
import { Card, Button, Row, Col, Dropdown, DropdownButton, Spinner, Table } from 'react-bootstrap';
import { getDemoBalance, getDemoLogs, startDemoTrade, stopDemoTrade, switchDemoMarket } from '../api/demo';

const DemoTrading = () => {
  const [balance, setBalance] = useState({ ngn: 100000, usd: 0 });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [demoStatus, setDemoStatus] = useState('stopped');
  const [demoMarket, setDemoMarket] = useState('crypto');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const balRes = await getDemoBalance();
        if (balRes.data && balRes.data.balance) setBalance(balRes.data.balance);
        const logsRes = await getDemoLogs();
        if (logsRes.data && logsRes.data.logs) setLogs(logsRes.data.logs);
      } catch (e) {}
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleDemoAction = async (action) => {
    if (action === 'crypto' || action === 'forex') {
      setDemoMarket(action);
      setDemoStatus('running');
      await startDemoTrade(action);
    } else if (action === 'stop') {
      setDemoStatus('stopped');
      await stopDemoTrade();
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h2">Demo Trading</Card.Header>
      <Card.Body>
        {loading ? <Spinner animation="border" /> : (
          <>
            <Row className="mb-3">
              <Col>
                <h5>Virtual Balance</h5>
                <p>NGN: ₦{balance.ngn.toLocaleString()} (Demo)</p>
                <DropdownButton title={demoStatus === 'running' ? `Demo: ${demoMarket}` : 'Start Demo Trade'}>
                  <Dropdown.Item onClick={() => handleDemoAction('crypto')}>Demo Crypto</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleDemoAction('forex')}>Demo Forex</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleDemoAction('stop')}>Stop Demo</Dropdown.Item>
                </DropdownButton>
              </Col>
            </Row>
            <Row>
              <Col>
                <h5>Demo Trade History</h5>
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
                      <tr><td colSpan={4}>No demo trades yet.</td></tr>
                    ) : logs.map((log, idx) => (
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
  );
};

export default DemoTrading;
