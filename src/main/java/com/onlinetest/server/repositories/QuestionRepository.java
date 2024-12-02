package com.onlinetest.server.repositories;

import com.onlinetest.server.entities.Question;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigInteger;
import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, Integer> {
    Optional<Question> findByQuestionTitle(String questionTitle);
}
