import React, { useState, useEffect } from "react";
import { Card, Typography, Row, Col, Progress, Button } from "antd";
import { Pie } from "@ant-design/charts"; 
import Confetti from "react-confetti"; 
import { ClockCircleOutlined, BookOutlined } from "@ant-design/icons";
import { useLocation,useNavigate } from 'react-router-dom';
const { Title, Text } = Typography;

const ResultsPage = () => {
  const location = useLocation(); 
  const resultData = location.state; 
  console.log(resultData)
  const [confettiRunning, setConfettiRunning] = useState(true);
  const navigate = useNavigate();  

  const handleCloseClick = () => {
    navigate("/user-dashboard");  
  };
  useEffect(() => {
  
    const timer = setTimeout(() => {
      setConfettiRunning(false);
    }, 20000); // 20 seconds

    return () => clearTimeout(timer); 
  }, []);

  
  const { totalQuestions, answered, notAnswered, notVisited, timeSpent, percentage } = resultData;

  const data = [
    { type: "Answered", value: answered, color: "#1890ff" },
    { type: "Not Answered", value: notAnswered, color: "#ff4d4f" },
    { type: "Not Visited", value: notVisited, color: "#fa8c16" },
  ];

  const config = {
    data,
    angleField: "value",
    colorField: "type",
    radius: 1,
    innerRadius: 0.6,
    color: (item) => item.color, 
    legend: false,
  };

  return (
    <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#f0f8ff", minHeight: "100vh" }}>
     
      {confettiRunning && (
        <Confetti
          numberOfPieces={500} 
          recycle={false} 
          gravity={0.1} 
        />
      )}

      <Title level={2} style={{ color: "#003366", marginBottom: "40px" }}>
        🎉 Congratulations on finishing your exam!
      </Title>

      <Row gutter={[16, 16]} justify="center" align="middle">
        <Col xs={24} md={6}>
       
          <Card
            style={{
              textAlign: "center",
              borderRadius: "10px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              marginBottom: "16px", 
            }}
          >
            <ClockCircleOutlined style={{ fontSize: "48px", color: "#1890ff" }} />
            <Title level={4} style={{ margin: "10px 0 0" }}>
              Time Spent
            </Title>
            <Text style={{ fontSize: "20px", fontWeight: "bold" }}>{timeSpent}</Text>
          </Card>
       
          <Card
            style={{
              textAlign: "center",
              borderRadius: "10px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              marginBottom: "16px", 
            }}
          >
            <BookOutlined style={{ fontSize: "48px", color: "#52c41a" }} />
            <Title level={4} style={{ margin: "10px 0 0" }}>Percentage</Title>
            <Text style={{ fontSize: "24px", fontWeight: "bold" }}>{percentage}%</Text>
            <Progress
              percent={percentage}
              strokeColor={{ from: "#52c41a", to: "#87d068" }}
              showInfo={false}
              style={{ margin: "10px 0" }}
            />
            <Text type="secondary">Test has been completed</Text>
          </Card>
        </Col>

        <Col xs={12} md={6}>
          <Card
            style={{
              borderRadius: "10px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              marginBottom: "16px", 
              textAlign: "center",
              padding: "10px",
              width: "90%", 
              margin: "auto", 
              height: "auto", 
            }}
          >
            <Title level={4} style={{ marginBottom: "20px", color: "#003366" }}>
              Answer Analysis
            </Title>
            <Row gutter={[8, 8]} align="middle">
              <Col span={24}>
              
                <Card style={{ textAlign: "left", borderRadius: "8px", padding: "10px", backgroundColor: "#e6f7ff" }}>
                  <Text style={{ fontSize: "14px", fontWeight: "bold", color: "#003366" }}>Total Questions</Text>
                  <Text style={{ display: "block", fontSize: "16px", fontWeight: "bold", color: "#1890ff" }}>{totalQuestions}</Text>
                </Card>
              </Col>
              <Col span={24}>
              
                <Card style={{ textAlign: "left", borderRadius: "8px", padding: "10px", backgroundColor: "#e6f7ff" }}>
                  <Text style={{ fontSize: "14px", fontWeight: "bold", color: "#003366" }}>Answered</Text>
                  <Text style={{ display: "block", fontSize: "16px", fontWeight: "bold", color: "#1890ff" }}>{answered}</Text>
                </Card>
              </Col>
              <Col span={24}>
               
                <Card style={{ textAlign: "left", borderRadius: "8px", padding: "10px", backgroundColor: "#e6f7ff" }}>
                  <Text style={{ fontSize: "14px", fontWeight: "bold", color: "#003366" }}>Not Answered</Text>
                  <Text style={{ display: "block", fontSize: "16px", fontWeight: "bold", color: "#ff4d4f" }}>{notAnswered}</Text>
                </Card>
              </Col>
              <Col span={24}>
               
                <Card style={{ textAlign: "left", borderRadius: "8px", padding: "10px", backgroundColor: "#e6f7ff" }}>
                  <Text style={{ fontSize: "14px", fontWeight: "bold", color: "#003366" }}>Not Visited</Text>
                  <Text style={{ display: "block", fontSize: "16px", fontWeight: "bold", color: "#fa8c16" }}>{notVisited}</Text>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>


        <Col xs={24} md={9}>
          <Card
            style={{
              borderRadius: "10px",
              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
              marginBottom: "16px", 
              padding: "4px",
              textAlign: "center",
              height: "600px", 
            }}
          >
            <Title level={4} style={{ marginBottom: "20px", color: "#003366" }}>
              Pie Chart Analysis
            </Title>
            <Pie
              {...config}
              style={{
                width: "100%",
                height: "200px", 
                marginBottom: "20px",
              }}
            />
          </Card>
        </Col>
      </Row>

   
      <Button type="primary" size="large" style={{ marginTop: "40px" }} onClick={handleCloseClick}>
        Close
      </Button>
    </div>
  );
};

export default ResultsPage;
