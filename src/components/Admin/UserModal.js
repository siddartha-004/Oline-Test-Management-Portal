import React,{useState} from "react";
import { Modal, Form, Input, Button } from "antd";
import axios from "axios";
import Swal from 'sweetalert2';
import successSound from '../success.mp3';

const UserModal = ({ isOpen, onClose, onUserAdded }) => {
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const response=await axios.post("http://localhost:8080/user/", {
        userName: values.userName,
        userPassword: values.userPassword,
        admin: values.admin?1:0,
        userTest: null,
      });
      console.log(response.data.message)
      const audio = new Audio(successSound);
          audio.play();
  
          Swal.fire({
            title: 'Success!',
            text: `${response.data.message}`,
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => {
            form.resetFields();  
           
            onUserAdded(); 
          });
  
  
      
    } catch (error) {
    
        setErrorMessage(error.response.data.message || 'Creation failed');
      console.error("Error adding user", error);
    }
  };

  return (
    <Modal
      visible={isOpen}
      title="Add New User"
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Submit
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
      {errorMessage && (
  <div className="error-message" style={{"margin-bottom": "16px"}}>
    <span>{errorMessage}</span>
    <button className="close-btn" onClick={() => setErrorMessage(null)}>✖</button>
  </div>)}

        <Form.Item
          label="UserName"
          name="userName"
          rules={[{ required: true, message: "Please enter a user name" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="User Password"
          name="userPassword"
          rules={[{ required: true, message: "Please enter a password" }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Role (Admin)"
          name="admin"
          valuePropName="checked"
        >
          <Input type="checkbox" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserModal;
