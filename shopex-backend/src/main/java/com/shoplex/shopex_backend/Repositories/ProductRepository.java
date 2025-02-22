package com.shoplex.shopex_backend.Repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.shoplex.shopex_backend.Entities.Product;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategory(String category);
    @Query("SELECT DISTINCT p.category FROM Product p")
    List<String> findDistinctCategory();
    Product findByNameAndBrand(String name, String brand);
}
