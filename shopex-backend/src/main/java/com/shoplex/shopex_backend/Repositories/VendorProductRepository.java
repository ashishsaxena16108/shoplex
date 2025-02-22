package com.shoplex.shopex_backend.Repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shoplex.shopex_backend.Entities.Product;
import com.shoplex.shopex_backend.Entities.User;
import com.shoplex.shopex_backend.Entities.VendorProduct;

@Repository
public interface VendorProductRepository extends JpaRepository<VendorProduct, Long> {
    VendorProduct findByVendorAndProduct(User vendor, Product product);

    List<VendorProduct> findByVendor(User vendor);
}
