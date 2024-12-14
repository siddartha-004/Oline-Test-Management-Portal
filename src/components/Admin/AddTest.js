import React, { useState } from 'react';
import { Button, Form, Input, TimePicker, Alert, Typography, DatePicker, Row, Col, Divider, Collapse, Card, Spin } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import successSound from '../success.mp3';
import { InfoCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import './AddTest.css'; 

const { TextArea } = Input;
const { Panel } = Collapse;
const { Title, Paragraph } = Typography;

const AddTest = () => {
    const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const onFinish = (values) => {
    setLoading(true); 
  
   
    setTimeout(() => {
      const data = {
        testTitle: values.testTitle,
        testDuration: values.testDuration.format('HH:mm:ss'),
        testTotalMarks: parseInt(values.testTotalMarks),
        startTime: values.startTime.format('YYYY-MM-DDTHH:mm:ss'),
        endTime: values.endTime.format('YYYY-MM-DDTHH:mm:ss'),
        testQuestions: [
          {
            questionTitle: values.question1Title,
            option1: values.option1,
            option2: values.option2,
            option3: values.option3,
            option4: values.option4,
            questionAnswer: parseInt(values.questionAnswer),
            questionMarks: parseInt(values.questionMarks),
          },
        ],
      };
  
      axios.post('http://localhost:8080/user/admin/addTest', data)
        .then(() => {
          const audio = new Audio(successSound);
          audio.play();
  
          Swal.fire({
            title: 'Success!',
            text: 'Test added successfully',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            form.resetFields();  
            setLoading(false);   
          });
        })
        .catch((error) => {
          console.log(error)
          if (error.response?.status === 409) {
            setErrorMessage(`${error.response.data.message} : ${error.response.data.error}`);
          } else {
            setErrorMessage('Failed to add test: ' + (error.response?.data?.message || 'An unexpected error occurred'));
          }
          setLoading(false); 
        });
    }, 2000);  
  };
  
  return (
    <>
      {loading && (
        <div className="spinner-overlay">
          <Spin size="large" />
        </div>
      )}

      <Alert
        message={
          <Typography>
            <Title level={4}>
              <InfoCircleOutlined style={{ marginRight: '8px', color: 'red' }} />
              Instructions for Adding a Test
            </Title>
            <Paragraph>
              Follow these steps:
              <ul>
                <li>Provide a descriptive title.</li>
                <li>Set the duration in HH:MM:SS format.</li>
                <li>Enter the total marks.</li>
                <li>Select valid start and end times.</li>
                <li>Provide the question details and options.</li>
                <li>Indicate the correct answer by number (1-4).</li>
              </ul>
            </Paragraph>
          </Typography>
        }
        type="info"
        style={{ marginBottom: '20px', marginLeft: '10px', paddingLeft: '30px', marginRight: '10px' }}
      />

      <Card title={<span style={{ color: 'crimson' }}>Add Test</span>} bordered style={{ margin: '20px', borderRadius: '8px' }}>
        <Collapse>
          <Panel header="Click to Add Test" key="1">
            <Form form={form} layout="vertical" onFinish={onFinish}>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="testTitle" label="Test Title" rules={[{ required: true, message: 'Please enter the test title' }]}>
                    <Input placeholder="Enter test title" />
                  </Form.Item>
                  <Form.Item
                    name="testDuration"
                    label="Test Duration"
                    rules={[{ required: true, message: 'Please select the test duration' }]}
                  >
                    <TimePicker format="HH:mm:ss" />
                  </Form.Item>
                  <Form.Item
                    name="testTotalMarks"
                    label="Total Marks"
                    rules={[{ required: true, message: 'Please enter total marks' }]}
                  >
                    <Input type="number" placeholder="Enter total marks" />
                  </Form.Item>

                  <Form.Item
                    name="startTime"
                    label="Start Time"
                    rules={[{ required: true, message: 'Please select the start time' }]}
                  >
                    <DatePicker showTime />
                  </Form.Item>

                  <Form.Item
                    name="endTime"
                    label="End Time"
                    rules={[{ required: true, message: 'Please select the end time' }]}
                  >
                    <DatePicker showTime />
                  </Form.Item>

                  <Form.Item
                    name="questionMarks"
                    label="Marks for Question"
                    rules={[{ required: true, message: 'Please enter the marks for the question' }]}
                  >
                    <Input type="number" placeholder="Enter marks" />
                  </Form.Item>
                </Col>

                <Col span={1}>
                  <Divider type="vertical" style={{ height: '100%' }} />
                </Col>

                <Col span={11}>
                  <Form.Item
                    name="question1Title"
                    label="Question 1"
                    rules={[{ required: true, message: 'Please enter the question title' }]}
                  >
                    <TextArea rows={3} placeholder="Enter question title" />
                  </Form.Item>

                  <Form.Item
                    name="option1"
                    label="Option 1"
                    rules={[{ required: true, message: 'Please enter option 1' }]}
                  >
                    <Input placeholder="Enter option 1" />
                  </Form.Item>

                  <Form.Item
                    name="option2"
                    label="Option 2"
                    rules={[{ required: true, message: 'Please enter option 2' }]}
                  >
                    <Input placeholder="Enter option 2" />
                  </Form.Item>

                  <Form.Item
                    name="option3"
                    label="Option 3"
                    rules={[{ required: true, message: 'Please enter option 3' }]}
                  >
                    <Input placeholder="Enter option 3" />
                  </Form.Item>

                  <Form.Item
                    name="option4"
                    label="Option 4"
                    rules={[{ required: true, message: 'Please enter option 4' }]}
                  >
                    <Input placeholder="Enter option 4" />
                  </Form.Item>

                  <Form.Item
                    name="questionAnswer"
                    label="Correct Answer (Option Number)"
                    rules={[{ required: true, message: 'Please enter the correct option number' }]}
                  >
                    <Input type="number" placeholder="Enter correct option (1-4)" />
                  </Form.Item>
                </Col>
              </Row>

              {errorMessage && (
                <Alert
                  message={
                    <Typography>
                      <Title level={5}>
                        <CloseCircleOutlined style={{ marginRight: '8px', color: 'white' }} />
                        Error
                      </Title>
                      <Paragraph>{errorMessage}</Paragraph>
                    </Typography>
                  }
                  type="error"
                  closable
                  onClose={() => setErrorMessage(null)}
                  style={{ backgroundColor: 'rgb(242, 150, 150)', color: 'white', paddingLeft: '30px',marginBottom:'10px' }}
                />
              )}

              <Form.Item>
                <Button type="primary" htmlType="submit" disabled={loading}>
                  Submit Test
                </Button>
              </Form.Item>
            </Form>
          </Panel>
        </Collapse>
      </Card>
    </>
  );
};

export default AddTest;
