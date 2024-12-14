import React, { useEffect, useState } from 'react';
import { Collapse, Card, Button, Modal,Form, Drawer,Input, Space, message,Alert,DatePicker } from 'antd';
import axios from 'axios';
import Swal from 'sweetalert2';
import successSound from '../success.mp3';
import moment from 'moment';

const { Panel } = Collapse;
const { TextArea } = Input;

const ModifyTest = () => {
  const [tests, setTests] = useState([]);
  const [form] = Form.useForm();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [error, setError] = useState('');
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [nestedDrawerVisible, setNestedDrawerVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalForm] = Form.useForm();
  const [mainDrawerVisible, setMainDrawerVisible] = useState(false);
  const [childrenDrawerVisible, setChildrenDrawerVisible] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [id,setid]=useState(null);
  const [addingQuestion, setAddingQuestion] = useState(false);
  useEffect(() => {
    axios.get('http://localhost:8080/user/tests')
      .then((response) => setTests(response.data))
      .catch(() => message.error('Failed to load tests.'));
  }, []);
  const openEditModal = (id,question) => {
    console.log(id);
    setid(id);
    setSelectedQuestion(question);
    modalForm.setFieldsValue(question);
    setEditModalVisible(true);
  };
  const handleSaveEditedQuestion = async (testId) => {
    console.log(testId)
    try {
      const updatedQuestion = await modalForm.validateFields();
      const payload = { ...updatedQuestion, questionId: selectedQuestion.questionId };

      await axios.put(
        `http://localhost:8080/user/admin/${testId}/questions`,
        payload
      );

      message.success('Question updated successfully!');
      setEditModalVisible(false);

    } catch (error) {
      message.error('Failed to update the question');
    }
  };
  const openMainDrawer = (test) => {
    setLoading(true);
    setTimeout(() => {
      setSelectedTest(test);
      form.setFieldsValue(test);
      setMainDrawerVisible(true);
      setLoading(false);
    }, 1000);
  };

  const closeMainDrawer = () => {
    setMainDrawerVisible(false);
    setSelectedTest(null);
  };
  const showChildrenDrawer = (question) => {
    
      setChildrenDrawerVisible(true);
    // }, 100);
  };
  

  const closeChildrenDrawer = () => {
    setChildrenDrawerVisible(false);
  };

  const handleDeleteTest = (testId) => {
    axios.delete(`http://localhost:8080/user/admin/deleteTest/${testId}`)
      .then((response) => {
       
        setTests(tests.filter((test) => test.id !== testId));
        const audio = new Audio(successSound);
        audio.play();
      Swal.fire({
          title: 'Success!',
          text: 'Test Deleted successfully!',
          icon: 'success',
        }).then(() => {
          setError(null); 
        
          setTimeout(() => {
            window.location.reload();
          }, 2000);
      
    })
      })
      .catch((response) => {message.error('Failed to delete test.');
    setError(response.data.message)});
  };

  const handleUpdateTest = (testId) => {
    form.validateFields().then((values) => {
      axios.put(`http://localhost:8080/user/admin/updateTest/${testId}`, values)
        .then(() => {
          message.success('Test updated successfully!');
        })
        .catch(() => message.error('Failed to update test.'));
    });
  };
  const handleUpdateTestmain = async () => {
    try {
      const values = await form.validateFields();
      const updatedData = {
        testTitle: values.testTitle,
        testDuration: values.testDuration,
        testTotalMarks: values.testTotalMarks,
       startTime:selectedTest?.startTime,
       endTime:selectedTest?.endTime,
        testQuestions: selectedTest?.testQuestions, 
      };

  
      await axios.put(`http://localhost:8080/user/admin/updateTest/${selectedTest?.testId}`, updatedData);

      message.success('Test details updated successfully');
      closeMainDrawer();
    } catch (error) {
      message.error('Failed to update test');
    }
  };
  const handleSaveChanges = async () => {
    try {
      const testDetails = await form.validateFields();
      const questionsFormData = await form.getFieldsValue();

      const testQuestions = Object.keys(questionsFormData)
        .filter((key) => key.startsWith('questionTitle')) 
        .map((key, index) => ({
          questionId: selectedTest?.testQuestions?.[index]?.questionId || null,
          questionTitle: questionsFormData[`questionTitle_${index}`] || '',
          option1: questionsFormData[`option1_${index}`] || '',
          option2: questionsFormData[`option2_${index}`] || '',
          option3: questionsFormData[`option3_${index}`] || '',
          option4: questionsFormData[`option4_${index}`] || '',
          questionMarks: questionsFormData[`questionMarks_${index}`] || '',
          questionAnswer: questionsFormData[`questionAnswer_${index}`] || '',
        }));

      const payload = {
        ...testDetails,
        testQuestions,
      };

      await axios.put(`http://localhost:8080/user/admin/updateTest/${selectedTest?.testId}`, payload);

      message.success('Changes saved successfully!');
      closeChildrenDrawer();
    } catch (error) {
      message.error('Failed to save changes');
    }
  };

  const handleDeleteQuestion = (testId, question) => {
    const cleanQuestion = {
      questionId: question.questionId,
      questionTitle: question.questionTitle,
      option1: question.option1,
      option2: question.option2,
      option3: question.option3,
      option4: question.option4,
      questionAnswer: question.questionAnswer,
      questionMarks: question.questionMarks,
    };
    console.log(testId,cleanQuestion)
    axios.delete(`http://localhost:8080/user/admin/deleteqn/${testId}/questions`,{
      data: cleanQuestion, 
    })
      .then(() => {message.success('Question deleted successfully!');
        const audio = new Audio(successSound);
        audio.play();
      Swal.fire({
          title: 'Success!',
          text: 'Test Deleted successfully!',
          icon: 'success',
        }).then(() => {
          setError(null); 
        
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        })
      })
      .catch(() => message.error('Failed to delete question.'));
  };

  const handleAddQuestion = (testId) => {
    form.validateFields().then((values) => {
      console.log(values)
      axios.post(`http://localhost:8080/user/admin/addqntotest/${testId}/questions`, values)
        .then(() => {
          message.success('Question added successfully!');
          form.resetFields();
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        })
        .catch((error) => {console.log(error.response.data);message.error('Failed to add question,bcz'+`${error.response.data}`)});
    });
  };

  return (
    <div>
      <h1>Modify Tests</h1>
      {error && (
        <Alert
        message="Error"
        description={error}
        type="error"
        closable
        onClose={() => setError(null)}
        style={{ padding: '8px', margin: '10px 0', fontSize: '14px' }}
      />
      
      )}
      <Collapse>
        {tests.map((test) => (
          <Panel
            key={test.id}
            header={
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>{test.testTitle}</span>
                <div>
                  <Button
                    style={{ marginRight: '10px',color:'blueviolet',border:'none' }}
                    onClick={() => openMainDrawer(test)}
                  >
                    Update Test
                  </Button>
                  <Button
                   
                    style={{marginRight: '10px',color:'red',border:'none'}}
                    onClick={() => {console.log(test);handleDeleteTest(test.testId)}}
                  >
                    Delete Test
                  </Button>
                </div>
              </div>
            }
          >
            <p><b>Duration:</b> {test.testDuration}</p>
            <p><b>Total Marks:</b> {test.testTotalMarks}</p>
            <p><b>Start Time:</b> {new Date(test.startTime).toLocaleString()}</p>
            <p><b>End Time:</b> {new Date(test.endTime).toLocaleString()}</p>

            <h3>Questions</h3>
            <Collapse>
              {test.testQuestions.map((question) => (
                <Panel key={question.questionId} header={`Question: ${question.questionTitle}`} extra={
                  <div>
                    <Button
                      type="link" onClick={() => openEditModal(test.testId,question)}
                      
                    >
                      Edit
                    </Button>
                    <Button
  type="link"
  danger 
  onClick={() => handleDeleteQuestion(test.testId, question)}
>
  Delete
</Button>
                  </div>
                }>
                  <Card style={{ marginBottom: '10px' }}>
                    <p><b>Options:</b> {question.option1}, {question.option2}, {question.option3}, {question.option4}</p>
                    <p><b>Answer:</b> Option {question.questionAnswer}</p>
                    <p><b>Marks:</b> {question.questionMarks}</p>
                  </Card>
                </Panel>
              ))}
            </Collapse>

            <Collapse>
              <Panel header="Add New Question" key="add-question">
                <Form form={form} layout="vertical" onFinish={() => handleAddQuestion(test.testId)}>
                  <Form.Item name="questionTitle" label="Question Title" rules={[{ required: true }]}>
                    <TextArea placeholder="Enter question title" />
                  </Form.Item>
                  <Space>
                    <Form.Item name="option1" label="Option 1" rules={[{ required: true }]}>
                      <Input placeholder="Option 1" />
                    </Form.Item>
                    <Form.Item name="option2" label="Option 2" rules={[{ required: true }]}>
                      <Input placeholder="Option 2" />
                    </Form.Item>
                  </Space>
                  <Space>
                    <Form.Item name="option3" label="Option 3" rules={[{ required: true }]}>
                      <Input placeholder="Option 3" />
                    </Form.Item>
                    <Form.Item name="option4" label="Option 4" rules={[{ required: true }]}>
                      <Input placeholder="Option 4" />
                    </Form.Item>
                  </Space>
                  <Space> <Form.Item name="questionMarks" label="Marks of question" rules={[{ required: true }]}>
                      <Input placeholder="marks" />
                    </Form.Item>
                    <Form.Item name="questionAnswer" label="Correct Answer (1-4)" rules={[{ required: true }]}>
                    <Input placeholder="Enter correct option number" />
                  </Form.Item>
                    </Space>
                 
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Add Question
                    </Button>
                  </Form.Item>
                </Form>
              </Panel>
            </Collapse>
          </Panel>
        ))}
      </Collapse>
      <Drawer
        title="Edit Test"
        width={520}
        onClose={closeMainDrawer}
        open={mainDrawerVisible}
      >
        {selectedTest && (
          <>
            <Form
              form={form}
              layout="vertical"
              initialValues={{
                testTitle: selectedTest.testTitle,
                testDuration: selectedTest.testDuration,
                testTotalMarks: selectedTest.testTotalMarks,
              }}
            >
              <Form.Item name="testTitle" label="Test Title" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="testDuration" label="Duration" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="testTotalMarks" label="Total Marks" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
             
              <div style={{ display: "flex", justifyContent: "space-between", gap: "200px" }}>
    <Button
      type="primary"
      onClick={handleUpdateTestmain}
      style={{ flex: 1 }}  // Optional: Makes the button take equal space
    >
      Update Test Details
    </Button>
    <Button
      onClick={() => showChildrenDrawer()}
      style={{ 
        flex: 1,  
        backgroundColor: "#28a745", 
        borderColor: "#28a745",    
        color: "white",             
      }}
    >
      Edit Questions
    </Button>
  </div>
              
            </Form>
          </>
        )}
      </Drawer>

   
      <Drawer
        title="Edit Questions"
        width={520}
        onClose={closeChildrenDrawer}
        open={childrenDrawerVisible}
      >
        {selectedTest?.testQuestions?.map((question, index) => (
          <Card key={index} style={{ marginBottom: '10px' }}>
            <Form form={form} layout="vertical">
              <Form.Item
                name={`questionTitle_${index}`}
                label="Question Title"
                initialValue={question.questionTitle}
              >
                <TextArea />
              </Form.Item>
              <Form.Item
                name={`option1_${index}`}
                label="Option 1"
                initialValue={question.option1}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={`option2_${index}`}
                label="Option 2"
                initialValue={question.option2}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={`option3_${index}`}
                label="Option 3"
                initialValue={question.option3}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={`option4_${index}`}
                label="Option 4"
                initialValue={question.option4}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={`questionMarks_${index}`}
                label="Marks"
                initialValue={question.questionMarks}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={`questionAnswer_${index}`}
                label="Correct Answer"
                initialValue={question.questionAnswer}
              >
                <Input />
              </Form.Item>
            </Form>
          </Card>
        ))}
       
       <Space 
  style={{ marginTop: '10px', width: '100%' }} 
  justify="space-between"
>
  <Button 
    onClick={closeChildrenDrawer} 
    style={{
      backgroundColor: "#f0f0f0", 
      borderColor: "#d9d9d9", 
      color: "#000",
    }}
  >
    Cancel
  </Button>
  
  <Button 
    type="primary" 
    onClick={handleSaveChanges} 
    style={{
      backgroundColor: "#28a745", 
      borderColor: "#28a745", 
      color: "white",
    }}
  >
    Save Updates
  </Button>
</Space>

      </Drawer>
      <Modal
        title="Edit Question"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        
      >
        <Form form={modalForm} layout="vertical">
          <Form.Item name="questionTitle" label="Question Title" rules={[{ required: true, message: 'Please enter the question title' }]}>
            <TextArea readOnly/>
          </Form.Item>
          <Form.Item name="option1" label="Option 1" rules={[{ required: true, message: 'Please enter option 1' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="option2" label="Option 2" rules={[{ required: true, message: 'Please enter option 2' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="option3" label="Option 3" rules={[{ required: true, message: 'Please enter option 3' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="option4" label="Option 4" rules={[{ required: true, message: 'Please enter option 4' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="questionAnswer" label="Correct Answer" rules={[{ required: true, message: 'Please enter the correct answer' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="questionMarks" label="Marks" rules={[{ required: true, message: 'Please enter the marks' }]}>
            <Input />
          </Form.Item>
        </Form>
        <Button
                    style={{ marginRight: '10px',color:'blueviolet',border:'none' }}
                    onClick={() => handleSaveEditedQuestion(id)}
                  >
                    Update question
                  </Button>
      </Modal>
    </div>
  );
};

export default ModifyTest;
