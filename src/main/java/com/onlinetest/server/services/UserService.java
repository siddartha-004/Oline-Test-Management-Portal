package com.onlinetest.server.services;

import com.onlinetest.server.entities.Question;
import com.onlinetest.server.entities.Test;
import com.onlinetest.server.entities.User;
import com.onlinetest.server.entities.UserAnswer;
import com.onlinetest.server.exception.Exception1;
import com.onlinetest.server.repositories.QuestionRepository;
import com.onlinetest.server.repositories.TestRepository;
import com.onlinetest.server.repositories.UserRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {

    @Autowired
    private  UserRepository userRepository;
    @Autowired
    private TestRepository testRepository;
    @Autowired
    private QuestionRepository questionRepository;
    public User createUser(User user) throws Exception {
        User existingUser = userRepository.findByUserName(user.getUserName());
        if (existingUser!=null) {
            throw new Exception("Username already exists.");
        }
        else {
            return userRepository.save(user);
        }
    }
    public User getUser(String userName) {
        return userRepository.findByUserName(userName);
    }
    public User authenticate(String username,String rawPassword) throws Exception {
        System.out.println(username);
        User user = userRepository.findByUserName(username);

        if(user==null)
        {
            System.out.println("g");
            throw new Exception("User not found");
        }
        System.out.println("l");
        String x=user.getUserPassword();
        String y=rawPassword;
        System.out.println(x);
        System.out.println(y);
        if(!y.equals(x)) {
            System.out.println("k");
            throw new Exception("Invalid credentials");
        }
        return user;
    }
    private void updateTestTotalMarks(Test test) {
        BigDecimal totalMarks = BigDecimal.ZERO;
        for (Question question : test.getTestQuestions()) {
            totalMarks = totalMarks.add(
                    question.getQuestionMarks() != null ? question.getQuestionMarks() : BigDecimal.ZERO
            );
        }
        test.setTestTotalMarks(totalMarks);
        testRepository.save(test);
    }

    public Test addTest(Test test) throws Exception1 {
        if (testRepository.findByTestTitle(test.getTestTitle())!=null) {
            throw new Exception1("Test with title '" + test.getTestTitle() + "' already exists.");
        }
        updateTestTotalMarks(test);
        return testRepository.save(test);
    }
    public Test updateTest(Integer testId,Test newTestDetails) throws Exception {
        Optional<Test> test = testRepository.findById(testId);
        if (test.isEmpty()) {
            throw new Exception("Test not found.");
        }
        Test existingTest=test.get();

        System.out.println(existingTest.toString());

        existingTest.setTestTitle(newTestDetails.getTestTitle());
        existingTest.setTestDuration(newTestDetails.getTestDuration());
        existingTest.setTestTotalMarks(newTestDetails.getTestTotalMarks());

        existingTest.setStartTime(newTestDetails.getStartTime());
        existingTest.setEndTime(newTestDetails.getEndTime());
        Set<Question> existingQuestions = existingTest.getTestQuestions();
        for (Question question : existingQuestions) {
            System.out.println(question.getQuestionId());
            questionRepository.deleteById(question.getQuestionId());
        }
        existingTest.getTestQuestions().clear();
        newTestDetails.getTestQuestions().forEach(question -> {
            question.setMarksScored(BigDecimal.ZERO);
            existingQuestions.add(question);
        });
        existingTest.setTestQuestions(existingQuestions);
        updateTestTotalMarks(existingTest);
        return testRepository.save(existingTest);
    }
    public Test deleteTest(Integer testId) throws Exception {
        User user = userRepository.findByUserTestTestId(testId);

        Optional<Test> test=testRepository.findById(testId);
        if (test.isEmpty()) {
            throw new Exception("Test not found.");
        }
        if (user != null) {
            user.setUserTest(null);
            userRepository.save(user);
        }
        Test test1 = test.get();
        testRepository.delete(test1);

        return test1;
    }
    public Boolean assignTest(Long userId, Integer testId) throws Exception {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new Exception("User not found.");
        }
        User user2=userRepository.findByUserTestTestId(testId);
        if(user2!=null){
            throw new Exception("test assigned to other user : "+user2.getUserName());
        }
        User user1 = user.get();
        Optional<Test> test = testRepository.findById(testId);
        if (test.isEmpty()) {
            throw new Exception("Test not found.");
        }
        Test test1 = test.get();
        if (user1.getUserTest() != null) {
            throw new Exception("User already has a test assigned.");
        }
        user1.setUserTest(test1);
        userRepository.save(user1);
        return true;
    }
    public Optional<Question> addQuestions(Integer testId, Question question) throws Exception {

        Optional<Question> existingQuestion = questionRepository.findByQuestionTitle(question.getQuestionTitle());

        if (existingQuestion.isPresent()) {
            throw new Exception("Question with the same title already exists.");
        }

        Optional<Test> testOptional = testRepository.findById(testId);


        if (testOptional.isEmpty()) {
            throw new Exception("Test not found.");
        }
        Test test = testOptional.get();

        for (Question q : test.getTestQuestions()) {
            if (q.getMarksScored() != null && q.getMarksScored().compareTo(BigDecimal.ZERO) > 0) {
                throw new Exception("Cannot add questions as marks have already been scored.");
            }
            if (q.getChosenAnswer() != null) {
                throw new Exception("Cannot add questions as answers have been chosen.");
            }
        }

        test.getTestQuestions().add(question);

        testRepository.save(test);
        updateTestTotalMarks(test);

        return   questionRepository.findByQuestionTitle(question.getQuestionTitle());
    }
    public Question updateQuestions(Integer testId, Question question) throws Exception {
        Optional<Test> test= testRepository.findById(testId);
        if (test.isEmpty()) {
            throw new Exception("Test not found.");
        }
        for (Question q : test.get().getTestQuestions()) {
            if (q.getMarksScored() != null && q.getMarksScored().compareTo(BigDecimal.ZERO) > 0) {
                throw new Exception("Test cannot be modified as marks have already been scored.");
            }
            if (q.getChosenAnswer() != null) {
                throw new Exception("Test cannot be modified as answers have been chosen.");
            }
        }
        Test test1 = test.get();
        Optional<Question> existingQuestion = test1.getTestQuestions().stream()
                .filter(q -> q.getQuestionTitle().equals(question.getQuestionTitle()))
                .findFirst();
        if (existingQuestion.isEmpty()) {
            return null;
        }
        Question existingQuestion1 = existingQuestion.get();
        existingQuestion1.setQuestionTitle(question.getQuestionTitle());
        existingQuestion1.setOption1(question.getOption1());
        existingQuestion1.setOption2(question.getOption2());
        existingQuestion1.setOption3(question.getOption3());
        existingQuestion1.setOption4(question.getOption4());
        existingQuestion1.setQuestionAnswer(question.getQuestionAnswer());
        existingQuestion1.setQuestionMarks(question.getQuestionMarks());
        testRepository.save(test1);
        updateTestTotalMarks(test.get());
        return existingQuestion1;
    }
    public Question deleteQuestions(Integer testId, Question question) throws Exception {

        Optional<Test> testOptional = testRepository.findById(testId);

        if (testOptional.isEmpty()) {
            throw new Exception("Test not found.");
        }

        Test test = testOptional.get();
        for (Question q : test.getTestQuestions()) {
            if (q.getMarksScored() != null && q.getMarksScored().compareTo(BigDecimal.ZERO) > 0) {
                throw new Exception("Test cannot be modified as marks have already been scored.");
            }
            if (q.getChosenAnswer() != null) {
                throw new Exception("Test cannot be modified as answers have been chosen.");
            }
        }

        Optional<Question> questionOptional = test.getTestQuestions().stream()
                .filter(q -> q.getQuestionId().equals(question.getQuestionId()))
                .findFirst();

        if (questionOptional.isEmpty()) {
            throw new Exception("Question not found in the test.");
        }
        for(Question q:test.getTestQuestions())
        {
            System.out.println(q.getQuestionTitle());
        }
        System.out.println(test.getTestQuestions().toString());
        test.getTestQuestions().remove(questionOptional.get());

        testRepository.save(test);

        questionRepository.delete(questionOptional.get());
        updateTestTotalMarks(test);

        return questionOptional.get();
    }
    public BigDecimal getResult(Integer testId) throws Exception {

        Optional<Test> testOptional = testRepository.findById(testId);

        if (testOptional.isEmpty()) {
            throw new Exception("Test not found.");
        }

        Test test = testOptional.get();

        BigDecimal totalMarksScored = BigDecimal.ZERO;

        for (Question question : test.getTestQuestions()) {
            totalMarksScored = totalMarksScored.add(question.getMarksScored() != null ? question.getMarksScored() : BigDecimal.ZERO);
        }

        return totalMarksScored;
    }
    public User finduserbytestid(Integer id) throws Exception{
        User user = userRepository.findByUserTestTestId(id);

        if (user==null) {
            throw new Exception("No users found for the test with ID: " + id);
        }

        return user;
    }
    public BigDecimal calculateTotalMarks(Long userId, Integer testId, List<UserAnswer> answers) throws Exception {

        System.out.println(userId+"he;lo");
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isEmpty()) {
            throw new Exception("User not found.");
        }
        User user = userOptional.get();


        System.out.println(testId+"test");
        Optional<Test> testOptional = testRepository.findById(testId);
        if (testOptional.isEmpty()) {
            throw new Exception("Test not found.");
        }
        Test test = testOptional.get();


        if (user.getUserTest() == null || !user.getUserTest().getTestId().equals(testId)) {
            throw new Exception("Test is not assigned to the user.");
        }

        BigDecimal totalMarks = BigDecimal.ZERO;

        for (UserAnswer answer : answers) {
            Optional<Question> questionOptional = test.getTestQuestions().stream()
                    .filter(q -> q.getQuestionId().equals(answer.getQuestionId()))
                    .findFirst();

            if (questionOptional.isPresent()) {
                Question question = questionOptional.get();
                question.setChosenAnswer(answer.getChosenAnswer());
                System.out.println(question.getQuestionAnswer()+",,"+answer.getChosenAnswer());
                if (question.getChosenAnswer() != null && question.getQuestionAnswer().equals(answer.getChosenAnswer())) {

                    System.out.println("hello"+question.getQuestionMarks());
                    question.setMarksScored(question.getQuestionMarks());
                    totalMarks =totalMarks .add (question.getQuestionMarks());
                    System.out.println(totalMarks);
                }
                else {

                    question.setMarksScored(BigDecimal.ZERO); // assuming marks_scored is the field that stores scored marks
                }
            }
        }
         System.out.println(totalMarks);
        test.setTestMarksScored(totalMarks);
       
        testRepository.save(test);
        questionRepository.saveAll(test.getTestQuestions());

        return totalMarks;
    }
    public Test getTestDetailsByUserName(String userName) throws Exception {
        User user = (userRepository.findByUserName(userName));
        if (user==null) {
            throw new Exception("User not found.");
        }


        if (user.getUserTest() == null) {
            throw new Exception("No test assigned to this user.");
        }

        return user.getUserTest();
    }
    public Set<Question> getTestQuestions(Integer testId) throws Exception {
        Optional<Test> testOptional = testRepository.findById(testId);
        if (testOptional.isEmpty()) {
            throw new Exception("Test not found.");
        }
        return testOptional.get().getTestQuestions();
    }
    public List<User> getUsers(){
        return userRepository.findAllByOrderByUserName();
    }
    public List<Test> getTests() {
        return testRepository.findAll();
    }









}
