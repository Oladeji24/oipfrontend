import React from 'react';
import { Card, Table } from 'react-bootstrap';

const AdminDashboard = () => {
  return (
    <Card className="mb-4">
      <Card.Header as="h2">Admin Dashboard</Card.Header>
      <Card.Body>
        <h5>Monitor Users</h5>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>User</th>
              <th>Wallet</th>
              <th>Trades</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>user1@example.com</td>
              <td>₦500,000</td>
              <td>12</td>
              <td>Active</td>
            </tr>
          </tbody>
        </Table>
        <h5 className="mt-4">Platform Health</h5>
        <p>All systems operational.</p>
      </Card.Body>
    </Card>
  );
};

export default AdminDashboard;
