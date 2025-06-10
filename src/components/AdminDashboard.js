import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Spinner } from 'react-bootstrap';
import { getUsers, flagUser } from '../api/user';
import { approveWithdrawal } from '../api/withdrawal';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const res = await getUsers();
        if (res.data && res.data.users) setUsers(res.data.users);
      } catch (e) {}
      setLoading(false);
    }
    fetchUsers();
  }, []);

  const handleFlag = async (id) => {
    await flagUser(id, 'flagged');
    alert('User flagged!');
  };

  const handleApproveWithdrawal = async (userId) => {
    setApproving(true);
    // Demo: approve 5000 NGN for user
    await approveWithdrawal(userId, 5000, 'NGN');
    setApproving(false);
    alert('Withdrawal approved!');
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h2">Admin Dashboard</Card.Header>
      <Card.Body>
        <h5>Monitor Users</h5>
        {loading ? <Spinner animation="border" /> : (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>User</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.status || 'Active'}</td>
                  <td>
                    <Button size="sm" variant="warning" className="me-2" onClick={() => handleFlag(user.id)}>Flag</Button>
                    <Button size="sm" variant="success" disabled={approving} onClick={() => handleApproveWithdrawal(user.id)}>
                      {approving ? 'Approving...' : 'Approve Withdrawal'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <h5 className="mt-4">Platform Health</h5>
        <p>All systems operational.</p>
      </Card.Body>
    </Card>
  );
};

export default AdminDashboard;
