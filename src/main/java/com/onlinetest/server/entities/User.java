package com.onlinetest.server.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;


import java.util.Collection;
import java.util.List;

@Entity
@Table(name="users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Positive(message = "User ID must be positive and not null.")

    private Long userId;
    @NotNull(message = "Username must not be null.")
    @Pattern(regexp = "^[A-Z].*", message = "The first character of username must be capitalized.")

    private String userName;
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_test_id", referencedColumnName = "test_id")
    private Test userTest;

    private Boolean isAdmin;
    @NotNull(message = "Password cannot be null.")
    @Size(min = 8, message = "Password must be at least 8 characters long.")
    @Pattern(regexp = "^(?=.[a-z])(?=.[A-Z])(?=.\\d)(?=.[@$!%?&])[A-Za-z\\d@$!%?&]{8,}$",
            message = "Password must contain at least one upper case letter, one lower case letter, one digit, and one special character.")

    private String userPassword;
    public User(){

    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public Test getUserTest() {
        return userTest;
    }

    public void setUserTest(Test userTest) {
        this.userTest = userTest;
    }

    public Boolean getAdmin() {
        return isAdmin;
    }

    public void setAdmin(Boolean admin) {
        isAdmin = admin;
    }

    public String getUserPassword() {
        return userPassword;
    }

    public void setUserPassword(String userPassword) {
        this.userPassword = userPassword;
    }


}