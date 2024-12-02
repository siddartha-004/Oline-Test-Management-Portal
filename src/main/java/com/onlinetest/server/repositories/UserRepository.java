package com.onlinetest.server.repositories;

import com.onlinetest.server.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface UserRepository extends JpaRepository<User,Long> {
    public User findByUserName(String username);
    public User findByUserTestTestId(Integer testId);
    public List<User> findAllByOrderByUserName();

}
