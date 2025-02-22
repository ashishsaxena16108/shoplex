package com.shoplex.shopex_backend.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shoplex.shopex_backend.Entities.Payment;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,Long> {
    public List<Payment> findByPaymentStatus(Payment.PaymentStatus status);
}
