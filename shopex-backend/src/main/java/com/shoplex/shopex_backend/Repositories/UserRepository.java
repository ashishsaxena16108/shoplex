package com.shoplex.shopex_backend.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.shoplex.shopex_backend.Entities.User;


@Repository
public interface UserRepository extends JpaRepository<User,Long> {
    User findByEmail(String email);
    
    @Query("SELECT u FROM users u WHERE u.role = 'DELIVERY_PERSONNEL' AND u.isAvailable = true")
    Optional<User> findFirstByIsAvailableTrue();

    List<User> findAllByRole(User.Role role);
}
