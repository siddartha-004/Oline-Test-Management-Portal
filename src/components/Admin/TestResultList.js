import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Avatar, Progress, Tag, Space, Button } from 'antd';
import axios from 'axios';

const TestResultList = () => {
  const [dataSource, setDataSource] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/user/users')
      .then(response => {
        setDataSource(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('Error fetching user data');
        setLoading(false);
      });
  }, []);

  const selectedUser = dataSource.find(user => user.userId === selectedUserId);

  const defaultAvatar = 'http://localhost:8080/path/to/avatar.jpg';  
  return (
    <div>
      
      {loading && <p>Loading data...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

     
      {selectedUser && (
        <div style={{ marginBottom: 20 }}>
          <Card
            title={`Test Results for ${selectedUser.userName}`}
            extra={
              <Button onClick={() => setSelectedUserId(null)} type="default">
                Close
              </Button>
            }
          >
            <p><strong>Test Title:</strong> {selectedUser.userTest?.testTitle}</p>
            <p><strong>Marks Scored:</strong> {selectedUser.userTest?.testMarksScored} / {selectedUser.userTest?.testTotalMarks}</p>
            <p><strong>Number of Questions:</strong> {selectedUser.userTest?.testQuestions?.length || 0}</p> 
            <p><strong>Test Duration:</strong> {selectedUser.userTest?.testDuration}</p>
          </Card>
        </div>
      )}

      <Row gutter={16}>
        {dataSource.map(user => (
          <Col span={8} key={user.userId}>
            <Card
              style={{ marginBottom: 20 }}
              actions={[
                <Button
                  type="primary"
                  onClick={() => setSelectedUserId(user.userId)}
                >
                  View Details
                </Button>,
              ]}
            >
              <Card.Meta
                avatar={<Avatar src='https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg' />} 
                title={user.userName}
                description={user.userTest?.testTitle || 'No test assigned'}
              />
              <Space direction="vertical" style={{ marginTop: 10 }}>
                {user.userTest ? (
                  <Progress
                    percent={(user.userTest.testMarksScored / user.userTest.testTotalMarks) * 100}
                    format={(percent) => `${user.userTest.testMarksScored} / ${user.userTest.testTotalMarks}`}
                  />
                ) : (
                  <Tag color="red">No Test Assigned</Tag>
                )}
                <Tag color="blue">{user.userTest?.testDuration || 'N/A'}</Tag>
                <Tag color="green">{`Number of Questions: ${user.userTest?.testQuestions?.length || 0}`}</Tag> 
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TestResultList;
