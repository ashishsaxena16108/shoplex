package com.shoplex.shopex_backend.Repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.shoplex.shopex_backend.Entities.Order;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("SELECT o FROM orders o JOIN o.orderItems oi JOIN oi.vendorProduct vp WHERE vp.vendor.email = :email")
    List<Order> findOrdersByVendorEmail(String email);
    
    @Query("SELECT o FROM orders o WHERE o.orderStatus = 'PROCESSING'")
    Optional<Order> findByOrderProcessing();

}
