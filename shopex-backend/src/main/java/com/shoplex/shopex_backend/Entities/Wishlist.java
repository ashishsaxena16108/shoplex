package com.shoplex.shopex_backend.Entities;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;


@Getter
@Setter
@AllArgsConstructor
@Entity
public class Wishlist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToMany(cascade = CascadeType.ALL)
    @JsonManagedReference(value="wishlist-products")
    private List<Product> products;
    @OneToOne(mappedBy = "wishlist")
    @JsonBackReference(value="user-wishlist")
    private User user;
    public Wishlist(){
        products=new ArrayList<>();
    }
}
