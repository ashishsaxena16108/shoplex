package com.shoplex.shopex_backend.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shoplex.shopex_backend.Entities.Product;
import com.shoplex.shopex_backend.Entities.User;
import com.shoplex.shopex_backend.Repositories.ProductRepository;
import com.shoplex.shopex_backend.Repositories.UserRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;




@RestController
@RequestMapping("/shoplex/admin")
public class AdminController {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private UserRepository userRepository;
    @GetMapping("/customers")
    public ResponseEntity<List<User>> getAllCustomers() {
        List<User> users = userRepository.findAllByRole("CUSTOMER");
        return ResponseEntity.ok(users);
    }
    @GetMapping("/vendors")
    public ResponseEntity<List<User>> getAllVendors() {
        List<User> users = userRepository.findAllByRole("VENDOR");
        return ResponseEntity.ok(users);
    }
    @GetMapping("/deliveryagents")
    public ResponseEntity<List<User>> getAllDeliveryAgents() {
        List<User> users = userRepository.findAllByRole("DELIVERY_PERSONNEL");
        return ResponseEntity.ok(users);
    }
}
