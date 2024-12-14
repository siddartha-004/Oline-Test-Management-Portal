import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Tag, Button } from "antd";
import UserModal from "./UserModal";
import {UserAddOutlined} from '@ant-design/icons'

const columns = [
  {
    title: "ID",
    dataIndex: "userId",
    key: "userId",
  },
  {
    title: "UserName",
    dataIndex: "userName",
    key: "userName",
  },
  {
    title: "Role",
    dataIndex: "admin",
    key: "admin",
    render: (admin) => (admin ? <Tag color="green">Admin</Tag> : <Tag color="red">User</Tag>),
  },
  {
    title: "User Test Title",
    dataIndex: "userTest",
    key: "userTest",
    render: (userTest) => (userTest && userTest.testTitle ? userTest.testTitle : "Test not Assigned"),
  },
];

const UsersDisplay = () => {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/user/users");
      const sortedUsers = response.data.sort((a, b) => a.userId - b.userId);
    setUsers(sortedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleUserAdded = () => {
    closeModal();
    fetchUsers();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>User Management</h1>
      <div style={{ textAlign: "right", marginBottom: "20px" }}>
      <Button
      type="primary"
      onClick={openModal}
      style={{ backgroundColor: "#FF5733", borderColor: "#FF5733" }} 
    >
      <UserAddOutlined style={{ color: "blue" }} /> Add New User
    </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="userId"
        pagination={{ pageSize: 5 }}
      />

    
      <UserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
};

export default UsersDisplay;
