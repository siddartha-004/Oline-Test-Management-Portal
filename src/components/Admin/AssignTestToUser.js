import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import successSound from '../success.mp3';
import { Card, Button, List, Empty, Typography, Checkbox ,Alert} from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const AssignTest = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
   
    axios.get('http://localhost:8080/user/users')  
      .then((response) => {
        const sortedUsers = response.data.sort((a, b) => a.userId - b.userId);
        setUsers(sortedUsers);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  useEffect(() => {
   
    axios.get('http://localhost:8080/user/tests')  
      .then((response) => {
        setTests(response.data);
      })
      .catch((error) => {
        console.error('Error fetching tests:', error);
      });
  }, []);

  const handleAssignTest = (userId, testId) => {
 
    axios.post(`http://localhost:8080/user/admin/${userId}/assign-test/${testId}`)
      .then(() => {
        const audio = new Audio(successSound);
          audio.play();
        Swal.fire({
            title: 'Success!',
            text: 'Test assigned successfully!',
            icon: 'success',
          }).then(() => {
            setSelectedTest(null); 
            setTimeout(() => {
              window.location.reload();
            }, 2000);
        
      })
    })
      .catch((error) => {
        setErrorMessage(
            'Failed to assign test: ' +
              (error.response?.data || 'Unexpected error occurred')
          );
        console.error('Error assigning test:', error);
      });
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user); 
    setSelectedTest(null);  
  };

  return (
    <div style={{ display: 'flex' }}>
     
      <Card style={{ width: '300px', marginRight: '20px' }}>
        <h3>Select a User</h3>
        <List
          itemLayout="horizontal"
          dataSource={users}
          renderItem={(user) => (
            <List.Item
              actions={[<Button onClick={() => handleSelectUser(user)}>Assign Test</Button>]}
            >
              <List.Item.Meta
                title={user.userName}
                description={`ID: ${user.userId}`}
              />
            </List.Item>
          )}
        />
      </Card>
      {selectedUser && (
        <Card title={`Assign Test to ${selectedUser.userName}`} style={{ width: '300px' }}>
      
          {selectedUser.userTest ? (
            <Typography.Text type="danger">Test already assigned: {selectedUser.userTest.testTitle}</Typography.Text>
          ) : (
            <>
              <h4>Select a Test</h4>
             
              {tests.length === 0 ? (
                <Empty
                  description={<span>No Tests Available</span>}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}  
                />
              ) : (
                tests.map((test) => (
                  <Button
                    key={test.testId}
                    onClick={() => setSelectedTest(test)}  
                    style={{ margin: '5px' }}
                  >
                    {test.testTitle}
                  </Button>
                ))
              )}
            </>
          )}
        </Card>
      )}
      {selectedTest && (
        <Card 
          title={`Test Details: ${selectedTest.testTitle}`} 
          style={{ width: '400px', marginLeft: '5px', height: '500px', overflowY: 'auto' }}
          extra={
            <Button 
              type="primary" 
              onClick={() => handleAssignTest(selectedUser.userId, selectedTest.testId)}
            >
              Assign Test
            </Button>
          }
        >
            {errorMessage && (
        <Alert
        message="Error"
        description={errorMessage}
        type="error"
        closable
        onClose={() => setErrorMessage(null)}
        style={{ padding: '8px', margin: '10px 0', fontSize: '14px' }}
      />
      
      )}
          <Typography.Text><strong>Duration:</strong> {selectedTest.testDuration}</Typography.Text><br />
          <Typography.Text><strong>Total Marks:</strong> {selectedTest.testTotalMarks}</Typography.Text><br />
          <Typography.Text><strong>Start Time:</strong> {selectedTest.startTime}</Typography.Text><br />
          <Typography.Text><strong>End Time:</strong> {selectedTest.endTime}</Typography.Text><br />

          <Typography.Title level={5}>Questions:</Typography.Title>
          <List
            dataSource={selectedTest.testQuestions}
            renderItem={(question) => (
              <List.Item key={question.questionId}>
                {/* Question and Marks displayed in a column */}
                <div style={{ marginBottom: '10px' }}>
                  <Typography.Text strong>{question.questionTitle}</Typography.Text>
                  <Typography.Text style={{ fontWeight: 'bold', textAlign: 'right', display: 'block' }}>
                    {question.questionMarks} Marks
                  </Typography.Text>
                  <div style={{ marginTop: '10px' }}>
                    {['option1', 'option2', 'option3', 'option4'].map((optionKey, index) => {
                      const option = question[optionKey];
                      const isCorrect = question.questionAnswer === index + 1; 
                      return (
                        <div key={optionKey} style={{ marginBottom: '5px' }}>
                          {isCorrect ? (
                            <Checkbox
                              checked
                              disabled
                              style={{ color: 'green', marginRight: '10px' }}
                              icon={<CheckOutlined />}
                            />
                          ) : (
                            <Checkbox
                              disabled
                              style={{ color: 'red', marginRight: '10px' }}
                              icon={<CloseOutlined />}
                            />
                          )}
                          {option}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  );
};

export default AssignTest;
