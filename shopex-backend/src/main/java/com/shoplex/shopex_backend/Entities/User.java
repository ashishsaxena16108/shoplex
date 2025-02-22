package com.shoplex.shopex_backend.Entities;

import java.util.Collection;
import java.util.Collections;
import java.util.List;

import jakarta.persistence.CascadeType;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity(name="users")
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String password;
    private String email;
    private String firstName;
    private String lastName;
    private String address;
    private String profileImageUrl;
    private String phoneNumber;
    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "shopping_cart_id", referencedColumnName = "id")
    @JsonManagedReference(value = "user-shoppingCart")
    private ShoppingCart shoppingCart;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference(value="user-orders")
    private List<Order> orders;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "wishlist_id", referencedColumnName = "id")
    @JsonManagedReference(value = "user-wishlist")
    private Wishlist wishlist;

    @OneToMany(mappedBy = "vendor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VendorProduct> vendorProducts;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @JsonManagedReference(value="user-notifications")
    private List<Notification> notifications;

    @OneToMany(mappedBy = "deliveryAgent", cascade = CascadeType.ALL)
    @JsonManagedReference(value="delivery-orders")
    private List<Order> deliveryOrders;

    @OneToMany
    private List<Payment> payments;
    private boolean isAvailable=true;
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority(isAdmin() ? "ROLE_ADMIN" : "ROLE_USER"));
    }
    public boolean isAdmin(){
        return role==Role.ADMIN;
    } 
    @Override
    public String getUsername(){
        return email;
    }
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    public enum Role{
        ADMIN,VENDOR,DELIVERY_PERSONNEL,USER
    }
}
