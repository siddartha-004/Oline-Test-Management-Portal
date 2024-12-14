import React, { useState, useEffect } from "react";
import { Layout, Menu, Card, Progress, Avatar, List, Modal, Button, Calendar } from "antd";
import { HomeOutlined, FileOutlined, BookOutlined, CalendarOutlined, SettingOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TestInterface from "../TestInterface"; // Import TestInterface
import m from "../m.png";
import n from "../n.png";

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const [tests, setTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showTestInterface, setShowTestInterface] = useState(false); 
  const username = localStorage.getItem("username") || "z";

 
  const fetchTests = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/user/user/${username}/test`);
      console.log(response)
      setTests(Array.isArray(response.data) ? response.data : [response.data]);
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };

  useEffect(() => {
    fetchTests();
  }, [username]);

  const startTest = (test) => {
    setSelectedTest(test);
    setIsModalVisible(true);
  };

  const beginTest = () => {
    setIsModalVisible(false);
    setShowTestInterface(true); 
  };

  return showTestInterface && selectedTest ? (
    <TestInterface test={selectedTest} /> 
  ) : (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ height: "64px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <h2 style={{ color: "#fff" }}>E-Skool</h2>
        </div>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1" icon={<HomeOutlined />}>
            Home
          </Menu.Item>
          <Menu.Item key="2" icon={<FileOutlined />}>
            My Results
          </Menu.Item>
          <Menu.Item key="3" icon={<BookOutlined />}>
            Tutorials
          </Menu.Item>
          <Menu.Item key="4" icon={<CalendarOutlined />}>
            PTA Meetings
          </Menu.Item>
          <Menu.Item key="5" icon={<SettingOutlined />}>
            Settings
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: "0 20px" }}>
          <h2 style={{ margin: 0, fontWeight: "bold" }}>Dashboard</h2>
        </Header>
        <Content style={{ margin: "20px", background: "#f0f2f5" }}>
          <h3 style={{ fontWeight: "bold", marginBottom: "20px" }}>Available Tests</h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
        <Card
              style={{
                width: "30%",
                borderRadius: "10px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                background: "#f5f7ff",
              }}
            >
              <Avatar
                size={120}
                src={m}
                style={{ marginBottom: "10px" }}
              />
              <h3 style={{ fontWeight: "bold" }}>Hi {username} !</h3>
              <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
                <div
                  style={{
                    textAlign: "center",
                    background: "#fff4e6",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    marginRight:"10px"
                  }}
                >
                  <p style={{ margin: 0, color: "#ff9f43", fontWeight: "bold" }}>Courses Completed</p>
                  <p style={{ fontSize: "24px", fontWeight: "bold", color: "#ff9f43" }}>52</p>
                </div>
                <div
                  style={{
                    textAlign: "center",
                    background: "#e9f7ef",
                    padding: "10px 20px",
                    borderRadius: "8px",
                  }}
                >
                  <p style={{ margin: 0, color: "#28c76f", fontWeight: "bold" }}>Knowledge Level</p>
                  <p style={{ fontSize: "24px", fontWeight: "bold", color: "#28c76f" }}>12</p>
                </div>
              </div>
            </Card>


            <Card
              style={{
                width: "30%",
                borderRadius: "10px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                height:"400px"
              }}
            >
              <h4 style={{"color":"orangered"}}>Your Tasks Today</h4>
              <List
                size="small"
                dataSource={["Upload Assignment", "Study for Quiz", "Spell Check","Learn Java","Going to walk","Spend time with family","Going to a walk"]}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
            </Card>
            <Card
              style={{
                width: "30%",
                borderRadius: "10px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Calendar fullscreen={false} />
            </Card>
          </div>

        
       
          <h3 style={{ fontWeight: "bold", marginBottom: "20px" }}>Available Tests</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          
            {tests.map((test) => (
  <Card
    key={test.testId}
    style={{ width: "350px", borderRadius: "10px", boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)" }}
    cover={<img alt={test.testTitle} src={n} style={{ borderRadius: "10px 10px 0 0", height: "200px" }} />}
  >
    <h4 style={{ fontWeight: "bold" }}>{test.testTitle}</h4>
    <p>
      <strong>Duration:</strong> {test.testDuration}
    </p>
    <p>
      <strong>Total Marks:</strong> {test.testTotalMarks}
    </p>
    <p>
      <strong>Start Time:</strong> {test.startTime || "Not Started"}
    </p>
    <p>
      <strong>End Time:</strong> {test.endTime || "Not Completed"}
    </p>
   
    {test.testMarksScored !== null && (
      <>
      
        <div style={{ marginTop: "10px" }}>
          <p style={{ marginBottom: "5px" }}>
            <strong>Test Completion:</strong>
          </p>
          <Progress percent={100} status="success" />
        </div>
        
        <div style={{ marginTop: "10px" }}>
          <p style={{ marginBottom: "5px" }}>
            <strong>Marks Scored:</strong> {`${test.testMarksScored} / ${test.testTotalMarks}`}
          </p>
          <Progress
            percent={(test.testMarksScored / test.testTotalMarks) * 100}
            status="active"
            strokeColor={{
              "0%": "#108ee9",
              "100%": "#87d068",
            }}
          />
   
        </div>
      
      </>
    )}
      <Button
      type="primary"
      style={{ width: "100%", marginTop: "10px" }}
      onClick={() => startTest(test)}
      disabled={test.testMarksScored !== null}
    >
      {test.testMarksScored !== null ? "Test Completed" : "Start Test"}
    </Button>
  </Card>
))}

          </div>
        </Content>
      </Layout>
      <Modal
        title="Test Instructions"
        visible={isModalVisible}
        onOk={beginTest}
        onCancel={() => setIsModalVisible(false)}
        okText="Begin Test"
      >
        <p>Please read the instructions carefully before starting the test:</p>
        <ul>
          <li>Make sure you have a stable internet connection.</li>
          <li>Do not refresh or close the browser during the test.</li>
          <li>Attempt all questions within the given time.</li>
        </ul>
      </Modal>
    </Layout>
  );
};

export default Dashboard;
