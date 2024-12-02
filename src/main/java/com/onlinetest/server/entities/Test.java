package com.onlinetest.server.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Set;

@Entity
@Table(name="test")
public class Test {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Positive(message = "Test ID must be positive and not null.")
    @Column(name="test_id")
    private Integer testId;

    private String testTitle;

    private LocalTime testDuration;
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    @OneToMany(targetEntity=Question.class,cascade=CascadeType.ALL,orphanRemoval = true)
    @JoinColumn(name="testId",referencedColumnName="test_id")
    private Set<Question> testQuestions;

    private BigDecimal testTotalMarks;

    private BigDecimal testMarksScored;


    private LocalDateTime startTime;

    private LocalDateTime endTime;

    public @Positive(message = "Test ID must be positive and not null.") Integer getTestId() {
        return testId;
    }

    public void setTestId(@Positive(message = "Test ID must be positive and not null.") Integer testId) {
        this.testId = testId;
    }

    public String getTestTitle() {
        return testTitle;
    }

    public void setTestTitle(String testTitle) {
        this.testTitle = testTitle;
    }

    public LocalTime getTestDuration() {
        return testDuration;
    }

    public void setTestDuration(LocalTime testDuration) {
        this.testDuration = testDuration;
    }

    public Set<Question> getTestQuestions() {
        return testQuestions;
    }

    public void setTestQuestions(Set<Question> testQuestions) {
        this.testQuestions = testQuestions;
    }

    public BigDecimal getTestTotalMarks() {
        return testTotalMarks;
    }

    public void setTestTotalMarks(BigDecimal testTotalMarks) {
        this.testTotalMarks = testTotalMarks;
    }

    public BigDecimal getTestMarksScored() {
        return testMarksScored;
    }

    public void setTestMarksScored(BigDecimal testMarksScored) {
        this.testMarksScored = testMarksScored;
    }



    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    @Override
    public String toString() {
        return "Test{" +
                "testId=" + testId +
                ", testTitle='" + testTitle + '\'' +
                ", testDuration=" + testDuration +
                ", testQuestions=" + testQuestions +
                ", testTotalMarks=" + testTotalMarks +
                ", testMarksScored=" + testMarksScored +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                '}';
    }
}