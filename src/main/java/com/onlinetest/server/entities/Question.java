package com.onlinetest.server.entities;
import jakarta.validation.constraints.*;
import jakarta.persistence.*;

import java.math.BigDecimal;
import java.math.BigInteger;

@Entity
@Table(name="question")
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer questionId;

    private String questionTitle;

    private String option1;
    private String option2;
    private String option3;
    private String option4;

    private Integer questionAnswer;
    @Positive(message = "Question marks must be positive.")

    private BigDecimal questionMarks;

    private Integer chosenAnswer;

    private BigDecimal marksScored;

    public Integer getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Integer questionId) {
        this.questionId = questionId;
    }

    public String getQuestionTitle() {
        return questionTitle;
    }

    public void setQuestionTitle(String questionTitle) {
        this.questionTitle = questionTitle;
    }

    public String getOption1() {
        return option1;
    }

    public void setOption1(String option1) {
        this.option1 = option1;
    }

    public String getOption2() {
        return option2;
    }

    public void setOption2(String option2) {
        this.option2 = option2;
    }

    public String getOption3() {
        return option3;
    }

    public void setOption3(String option3) {
        this.option3 = option3;
    }

    public String getOption4() {
        return option4;
    }

    public void setOption4(String option4) {
        this.option4 = option4;
    }

    public Integer getQuestionAnswer() {
        return questionAnswer;
    }

    public void setQuestionAnswer(Integer questionAnswer) {
        this.questionAnswer = questionAnswer;
    }

    public @Positive(message = "Question marks must be positive.") BigDecimal getQuestionMarks() {
        return questionMarks;
    }

    public void setQuestionMarks(@Positive(message = "Question marks must be positive.") BigDecimal questionMarks) {
        this.questionMarks = questionMarks;
    }

    public Integer getChosenAnswer() {
        return chosenAnswer;
    }

    public void setChosenAnswer(Integer chosenAnswer) {
        this.chosenAnswer = chosenAnswer;
    }

    public BigDecimal getMarksScored() {
        return marksScored;
    }

    public void setMarksScored(BigDecimal marksScored) {
        this.marksScored = marksScored;
    }
}
