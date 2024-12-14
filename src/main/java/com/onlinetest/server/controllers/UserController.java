package com.onlinetest.server.controllers;

import com.onlinetest.server.entities.*;
import com.onlinetest.server.exception.Exception1;
import com.onlinetest.server.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/user")
@CrossOrigin("*")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/")
    public ResponseEntity<?> createUser(@RequestBody User user) throws Exception {
        try {

            User user1 =this.userService.createUser(user);
            return ResponseEntity.ok(Map.of(
                    "message", "Created successfully",
                    "userDetails", user1
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "message", e.getMessage()
            ));
        }
    }

    @GetMapping("/{username}")
    public User getUser(@PathVariable("username") String userName) {
        return this.userService.getUser(userName);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {

            User user = this.userService.authenticate(loginRequest.getUsername(), loginRequest.getPassword());

            // Response structure
            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "isAdmin", user.getAdmin(),
                    "userDetails", user
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                    "message", e.getMessage()
            ));
        }
    }
    @PostMapping("/admin/addTest")
    public ResponseEntity<?> addTest(@RequestBody Test test) {
        try {

            Test savedTest = userService.addTest(test);

            return ResponseEntity.ok(Map.of(
                    "message", "Test added successfully",
                    "testTitle", savedTest.getTestTitle()
            ));
        } catch (Exception1 e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "message", "Failed to add the test",
                    "error", e.getMessage()
            ));
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    @PutMapping("/admin/updateTest/{testId}")
    public ResponseEntity<?> updateTest(
            @PathVariable Integer testId,
            @RequestBody Test test) {
        try {

            Test updatedTest = userService.updateTest(testId, test);
            return ResponseEntity.ok(Map.of(
                    "message", "Test updated successfully",
                    "testId", updatedTest.getTestId()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "message", "An error occurred while updating the test.",
                    "error", e.getMessage()
            ));
        }
    }
    @DeleteMapping("/admin/deleteTest/{testId}")
    public ResponseEntity<?> deleteTest (@PathVariable("testId") Integer testId) {
        try {
            Test deletedTest=userService.deleteTest(testId);
            return ResponseEntity.ok(Map.of(
                    "message", "Test deleted successfully",
                    "deletedTestTitle", deletedTest.getTestTitle(),
                    "deletedTestId", deletedTest.getTestId()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "message", e.getMessage()
            ));
        }
    }
    @PostMapping("/admin/{userId}/assign-test/{testId}")
    public ResponseEntity<String> assignTest(@PathVariable Long userId, @PathVariable Integer testId) {
        try {
            boolean result = userService.assignTest(userId, testId);
            if (result) {
                return new ResponseEntity<>("Test assigned successfully", HttpStatus.OK);
            } else {
                return new ResponseEntity<>("Failed to assign test", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @PostMapping("/admin/addqntotest/{testId}/questions")
    public ResponseEntity<?> addQuestionToTest(@PathVariable Integer testId,
                                                @RequestBody Question question) {
        try {
            Optional<Question> addedQuestion = userService.addQuestions(testId, question);
            return ResponseEntity.ok(Map.of(
                    "message", "question added successfully",
                    "question", addedQuestion
            ));

        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }
    @PutMapping("/admin/{testId}/questions")
    public ResponseEntity<?> updateQuestions(@PathVariable Integer testId, @RequestBody Question question) {

        try {
            question.setQuestionId(question.getQuestionId());
            Question updatedQuestion = userService.updateQuestions(testId, question);
            if (updatedQuestion == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Question with ID " + question.getQuestionTitle() + " not found in the test.");
            }

            return ResponseEntity.status(HttpStatus.OK).body(updatedQuestion);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @DeleteMapping("/admin/deleteqn/{testId}/questions")
    public ResponseEntity<?> deleteQuestions(@PathVariable Integer testId, @RequestBody Question question) {
         System.out.println(question.toString());
        try {
            Question deletedQuestion = userService.deleteQuestions(testId, question);

            if (deletedQuestion == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Question with ID " + question.getQuestionTitle() + " not found in the test.");
            }

            return ResponseEntity.status(HttpStatus.OK).body(deletedQuestion);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }

    }
    @GetMapping("/{testId}/result")
    public ResponseEntity<?> getResult(@PathVariable Integer testId) {
        try {
            BigDecimal totalMarksScored = userService.getResult(testId);

            return ResponseEntity.ok(Map.of(
                    "marks", totalMarksScored,
                    "user", userService.finduserbytestid(testId)
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @PostMapping("/calculateTotalMarks")
    public ResponseEntity<?> calculateTotalMarks(@RequestBody TestResultRequest request) {
        try {
            BigDecimal totalMarks = userService.calculateTotalMarks(request.getUserId(), request.getTestId(), request.getAnswers());
            return ResponseEntity.ok(totalMarks);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    @GetMapping("/user/{userName}/test")
    public ResponseEntity<Test> getTestDetailsByUserId(@PathVariable String userName) {
        System.out.println("hi");
        try {
            Test test = userService.getTestDetailsByUserName(userName);
            return ResponseEntity.ok(test);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // Get questions of a test
    @GetMapping("/test/{testId}/questions")
    public ResponseEntity<Set<Question>> getTestQuestions(@PathVariable Integer testId) {
        try {
            Set<Question> questions = userService.getTestQuestions(testId);
            return ResponseEntity.ok(questions);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // Submit answers and calculate total marks
    @PostMapping("/submit")
    public ResponseEntity<BigDecimal> submitAnswers(@RequestBody TestResultRequest request) {
        try {
            BigDecimal totalMarks = userService.calculateTotalMarks(request.getUserId(), request.getTestId(), request.getAnswers());
            return ResponseEntity.ok(totalMarks);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.getUsers();
    }
    @GetMapping("/tests")
    public List<Test> getTests() {
        return userService.getTests();
    }

}
