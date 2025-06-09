import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';

const DemoTrading = () => {
  return (
    <Card className="mb-4">
      <Card.Header as="h2">Demo Trading</Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col>
            <h5>Virtual Balance</h5>
            <p>NGN: ₦100,000 (Demo)</p>
            <Button variant="primary">Start Demo Trade</Button>
          </Col>
        </Row>
        <Row>
          <Col>
            <h5>Demo Trade History</h5>
            <p>No demo trades yet.</p>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default DemoTrading;
