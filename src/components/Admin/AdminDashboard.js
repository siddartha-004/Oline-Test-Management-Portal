import React, { useState } from 'react';
import { MenuFoldOutlined, MenuUnfoldOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined ,SearchOutlined} from '@ant-design/icons';
import { Button, Layout, Menu, theme } from 'antd';
import { FileAddOutlined, SolutionOutlined, TeamOutlined, EditOutlined } from '@ant-design/icons';

import { useNavigate, Outlet } from 'react-router-dom'; 

const { Header, Sider, Content } = Layout;

const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();
  const navigate = useNavigate(); 

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="text-container" style={{ padding: '10px' }}>
          <h2 style={{ color: 'pink', textAlign: 'center' }}>Admin Panel</h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          style={{ marginTop: 10 }}
        >
        <Menu.Item key="1" icon={<FileAddOutlined />} onClick={() => navigate('/admin/addtest')}>
  Add Test
</Menu.Item>
<Menu.Item key="2" icon={<SolutionOutlined />} onClick={() => navigate('/admin/assigntest')}>
  Assign Test
</Menu.Item>
<Menu.Item key="3" icon={<TeamOutlined />} onClick={() => navigate('/admin/manageusers')}>
  Manage Users
</Menu.Item>
<Menu.Item key="4" icon={<EditOutlined />} onClick={() => navigate('/admin/modifytest')}>
  Modify Tests
</Menu.Item>
<Menu.Item key="5" icon={<SearchOutlined />} onClick={() => navigate('/admin/resultlist')}>
  Check Results
</Menu.Item>

        </Menu>
      </Sider>
      <Layout>
        <Header
          style={{
            padding: '0 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: colorBgContainer,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
              borderRadius: '20px',
              border: '1px solid white',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'green' }}>Welcome, Admin!</span>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: '#ccc',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                color: '#fff',
              }}
            >
              A
            </div>
          </div>
        </Header>

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 1300,
            maxHeight: 1300,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet /> 
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard;
