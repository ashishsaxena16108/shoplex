package com.shoplex.shopex_backend.Controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shoplex.shopex_backend.Entities.Product;
import com.shoplex.shopex_backend.Repositories.ProductRepository;


import java.util.List;
import java.util.Optional;

import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;





@RestController
@CrossOrigin
@RequestMapping("/shoplex/home")
public class HomeController {
    @Autowired
    private ProductRepository productRepository;
   @GetMapping("/products")
   public ResponseEntity<List<Product>> getProducts() {
       return ResponseEntity.ok(productRepository.findAll());
   }
   @GetMapping("/products/{category}")
   public ResponseEntity<List<Product>> getCategoryProducts(@PathVariable String category) {
       return ResponseEntity.ok(productRepository.findByCategory(category));
   }
   @GetMapping("/categories")
   public ResponseEntity<List<String>> getCategories() {
       return ResponseEntity.ok(productRepository.findDistinctCategory());
   }
   @GetMapping("/product/{id}")
   public ResponseEntity<Product> getMethodName(@PathVariable Long id) {
       Optional<Product> product = productRepository.findById(id);
       if(product.isEmpty())
         return ResponseEntity.status(HttpStatus.SC_BAD_REQUEST).body(null);
       return ResponseEntity.ok(product.get());
   }
   
}
