// Example: TraderDashboard.js
import React from 'react';
import { Card, Button, Row, Col, Table } from 'react-bootstrap';

const TraderDashboard = () => {
  return (
    <Card className="mb-4">
      <Card.Header as="h2">Trader Dashboard</Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col>
            <h5>Wallet Balance</h5>
            <p>NGN: ₦1,000,000</p>
            <p>USD: $2,000</p>
          </Col>
          <Col>
            <Button variant="success" className="me-2">Deposit</Button>
            <Button variant="danger">Withdraw</Button>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Button variant="primary">Start Bot</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <h5>Live Trades</h5>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Pair</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>BTC/USDT</td>
                  <td>Buy</td>
                  <td>0.01</td>
                  <td>Open</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default TraderDashboard;
