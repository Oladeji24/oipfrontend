import React, { useEffect, useState } from 'react';
import { Card, Table, Button, Spinner, Form, InputGroup, Pagination } from 'react-bootstrap';
import { getUsers, flagUser } from '../api/user';
import { approveWithdrawal } from '../api/withdrawal';
import { useToast } from '../utils/ToastContext';
import UserDetailModal from './UserDetailModal';
import KucoinSymbolCacheAdmin from './KucoinSymbolCacheAdmin';
import DerivSymbolCacheAdmin from './DerivSymbolCacheAdmin';
import DerivAnalytics from './DerivAnalytics';
import AuditLogViewer from './AuditLogViewer';

const PAGE_SIZE = 10;

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const { showToast } = useToast();

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
    try {
      await flagUser(id, 'flagged');
      showToast('User flagged!', 'warning');
    } catch (e) {
      showToast('Failed to flag user.', 'danger');
    }
  };

  const handleApproveWithdrawal = async (userId) => {
    setApproving(true);
    try {
      await approveWithdrawal(userId, 5000, 'NGN');
      showToast('Withdrawal approved!', 'success');
    } catch (e) {
      showToast('Failed to approve withdrawal.', 'danger');
    }
    setApproving(false);
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handlePromote = async (id) => {
    try {
      await promoteUser(id);
      showToast('User promoted to admin!', 'success');
      setUsers(users.map(u => u.id === id ? { ...u, role: 'admin' } : u));
    } catch (e) {
      showToast('Failed to promote user.', 'danger');
    }
  };
  const handleDemote = async (id) => {
    try {
      await demoteUser(id);
      showToast('User demoted to user!', 'warning');
      setUsers(users.map(u => u.id === id ? { ...u, role: 'user' } : u));
    } catch (e) {
      showToast('Failed to demote user.', 'danger');
    }
  };

  // Filter and paginate users
  const filteredUsers = users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()));
  const totalPages = Math.ceil(filteredUsers.length / PAGE_SIZE) || 1;
  const pagedUsers = filteredUsers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <Card className="mb-4">
      <Card.Header as="h2">Admin Dashboard</Card.Header>
      <Card.Body>
        <h5>Monitor Users</h5>
        <InputGroup className="mb-3" style={{ maxWidth: 300 }}>
          <Form.Control
            placeholder="Search by email"
            value={search}
            onChange={handleSearchChange}
          />
        </InputGroup>
        {loading ? <Spinner animation="border" /> : (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedUsers.length === 0 ? (
                  <tr><td colSpan={3} className="text-center">No users found.</td></tr>
                ) : pagedUsers.map((user) => (
                  <tr key={user.id}>
                    <td style={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={() => handleUserClick(user)}>{user.email}</td>
                    <td>{user.status || 'Active'}</td>
                    <td>
                      <Button size="sm" variant="warning" className="me-2" onClick={() => handleFlag(user.id)}>Flag</Button>
                      <Button size="sm" variant="success" disabled={approving} onClick={() => handleApproveWithdrawal(user.id)}>
                        {approving ? 'Approving...' : 'Approve Withdrawal'}
                      </Button>
                      {user.role !== 'superadmin' && (
                        <>
                          <Button size="sm" variant="info" className="ms-2" onClick={() => handlePromote(user.id)}>Promote</Button>
                          <Button size="sm" variant="secondary" className="ms-2" onClick={() => handleDemote(user.id)}>Demote</Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination className="justify-content-center">
              <Pagination.First onClick={() => handlePageChange(1)} disabled={page === 1} />
              <Pagination.Prev onClick={() => handlePageChange(page - 1)} disabled={page === 1} />
              {[...Array(totalPages)].map((_, idx) => (
                <Pagination.Item
                  key={idx + 1}
                  active={page === idx + 1}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} />
              <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={page === totalPages} />
            </Pagination>
          </>
        )}
        <h5 className="mt-4">Platform Health</h5>
        <p>All systems operational.</p>
        <KucoinSymbolCacheAdmin />
        <DerivSymbolCacheAdmin />
        <DerivAnalytics />
      </Card.Body>
      <UserDetailModal show={showUserModal} onHide={() => setShowUserModal(false)} user={selectedUser} />
      <AuditLogViewer />
    </Card>
  );
};

export default AdminDashboard;
