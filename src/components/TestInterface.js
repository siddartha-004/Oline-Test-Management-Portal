import React, { useState, useEffect, useRef } from "react";
import { Layout, Button, Radio, Card, Typography, message, Modal, Result } from "antd";
import { ClockCircleOutlined, ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Header, Content } = Layout;
const { Text } = Typography;

// Popup Component
const SubmitTestPopup = ({ isVisible, onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
        navigate("/result"); 
      }, 2000); 
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, navigate]);

  return (
    <Modal open={isVisible} footer={null} closable={false}>
      <Result
        status="success"
        title="Test Submitted Successfully!"
        subTitle="Your answers have been recorded. Redirecting to the results page..."
      />
    </Modal>
  );
};

const TestInterface = ({ test }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const answersRef = useRef({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [reviewedQuestions, setReviewedQuestions] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
 const navigate=useNavigate();
  const questions = test.testQuestions;
  const totalQuestions = questions.length;

  const parseDurationToSeconds = (duration) => {
    const [hours = "0", minutes = "0", seconds = "0"] = duration.split(":");
    return parseInt(hours) * 3600 + parseInt(minutes) * 60 + parseInt(seconds);
  };

  useEffect(() => {
    const initialTime = test.testDuration ? parseDurationToSeconds(test.testDuration) : 0;
    setTimeLeft(initialTime);

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          submitTest();
        }
        return Math.max(prevTime - 1, 0);
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [test.testDuration]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (e) => {
    const newAnswers = { ...answers, [currentQuestion]: e.target.value };
    setAnswers(newAnswers);
    answersRef.current = newAnswers;

    if (reviewedQuestions.includes(currentQuestion)) {
      setReviewedQuestions(reviewedQuestions.filter((q) => q !== currentQuestion));
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const markForReview = () => {
    if (!reviewedQuestions.includes(currentQuestion)) {
      setReviewedQuestions([...reviewedQuestions, currentQuestion]);
    }
  };

 
  
  const submitTest = async () => {
    const userId = localStorage.getItem("userid");
  
    const answerPayload = test.testQuestions.map((question, index) => ({
      questionId: question.questionId,
      chosenAnswer: answersRef.current[index] ? answersRef.current[index].slice(-1) : null,
    }));
  
    const totalQuestions = test.testQuestions.length;
    const visitedQuestions = Object.keys(answersRef.current).map((q) => parseInt(q)); 
    const answeredCount = visitedQuestions.length; 
    const notVisitedCount = totalQuestions - visitedQuestions.length; 
    const reviewedCount = reviewedQuestions.length; 
  
    const totalTime = test.testDuration ? parseDurationToSeconds(test.testDuration) : 0; 
    const timeSpent = totalTime - timeLeft; 
  

    const formatTimeSpent = (seconds) => {
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      return `${hrs > 0 ? `${hrs}h ` : ""}${mins}m ${secs}s`;
    };
  
    const payload = {
      userId: userId ? parseInt(userId) : null,
      testId: test.testId,
      answers: answerPayload,
    };
  
    try {
      await axios.post("http://localhost:8080/user/submit", payload);
      const resultResponse = await axios.get(`http://localhost:8080/user/${test.testId}/result`);
      const resultData1=resultResponse.data;
      const userTest = resultData1.user.userTest; 
   
      const marksScored = userTest.testMarksScored || 0; 
      const totalMarks = userTest.testTotalMarks || 100; 
      const percentage = ((marksScored / totalMarks) * 100).toFixed(2);
  
      const resultData = {
        totalQuestions,
        answered: answeredCount,
        notAnswered: totalQuestions - answeredCount,
        notVisited: notVisitedCount,
        reviewed: reviewedCount,
        marksScored,
        totalMarks,
        percentage,
        timeSpent: formatTimeSpent(timeSpent), 
      };
      console.log(resultData);
  
      setIsSubmitted(true);
      message.success("Test submitted successfully!");

      setTimeout(() => {
        navigate("/result", { state: resultData });
      }, 2000);
    } catch (error) {
      console.error("Error submitting the test:", error);
      message.error("Failed to submit the test. Please try again.");
    }
  };
  
  

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#003366", color: "#fff", textAlign: "center" }}>
        <h2 style={{ color: "#fff" }}>Test Interface</h2>
      </Header>
      <Content style={{ padding: "20px", background: "#f0f2f5", display: "flex", gap: "20px" }}>
        <Card style={{ flex: "2", borderRadius: "8px", padding: "10px", height: "450px" }}>
          <h2 style={{ color: "green" }}>
            Question {currentQuestion + 1} of {totalQuestions}
          </h2>
          <h3>{questions[currentQuestion].questionTitle}</h3>
          <Radio.Group
            onChange={handleAnswerChange}
            value={answers[currentQuestion]}
            style={{ display: "block" }}
          >
            {["option1", "option2", "option3", "option4"].map((key, index) => (
              <Radio
                key={index}
                value={key}
                style={{
                  display: "block",
                  marginBottom: "10px",
                  borderRadius: "8px",
                  padding: "10px",
                  background: answers[currentQuestion] === key ? "#e6ffed" : "#fff",
                }}
              >
                {questions[currentQuestion]?.[key]}
              </Radio>
            ))}
          </Radio.Group>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
            <Button
              type="primary"
              icon={<ArrowLeftOutlined />}
              onClick={goToPreviousQuestion}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              type="default"
              onClick={markForReview}
              style={{ background: "#FFEFBA", color: "#000" }}
            >
              Mark for Review
            </Button>
            {currentQuestion === totalQuestions - 1 ? (
              <Button type="primary" onClick={submitTest}>
                Submit Test
              </Button>
            ) : (
              <Button type="primary" icon={<ArrowRightOutlined />} onClick={goToNextQuestion}>
                Next
              </Button>
            )}
          </div>
        </Card>

      
        <div style={{ flex: "0.7", display: "flex", flexDirection: "column", gap: "20px" }}>
          <Card style={{ textAlign: "center", padding: "10px", borderRadius: "8px" }}>
            <Text strong style={{ fontSize: "16px" }}>
              Timer <ClockCircleOutlined />
            </Text>
            <div style={{ fontSize: "24px", color: "#1890ff", marginTop: "10px" }}>
              {formatTime(timeLeft)}
            </div>
          </Card>
          <Card style={{ padding: "20px", borderRadius: "8px" }}>
            <Text strong>Question Navigation</Text>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "5px", marginTop: "10px" }}>
              {questions.map((_, i) => (
                <Button
                  key={i}
                  type={currentQuestion === i ? "primary" : "default"}
                  onClick={() => setCurrentQuestion(i)}
                  style={{
                    position: "relative",
                    background:
                      reviewedQuestions.includes(i)
                        ? "#FFD700"
                        : answers[i]
                        ? "#52c41a"
                        : currentQuestion === i
                        ? "#1890ff"
                        : "#fff",
                    color: reviewedQuestions.includes(i) || answers[i] || currentQuestion === i ? "#fff" : "#000",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                  }}
                >
                  {i + 1}
                  {reviewedQuestions.includes(i) && (
                    <div
                      style={{
                        position: "absolute",
                        top: "-5px",
                        right: "5px",
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "red",
                      }}
                    ></div>
                  )}
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </Content>


      <SubmitTestPopup isVisible={isSubmitted} onClose={() => setIsSubmitted(false)} />
    </Layout>
  );
};

export default TestInterface;
