package com.onlinetest.server.repositories;

import com.onlinetest.server.entities.Test;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigInteger;
import java.util.List;

public interface TestRepository extends JpaRepository<Test, Integer> {
    public Test findByTestTitle(String TestTitle);
    public List<Test> findAll();
}
