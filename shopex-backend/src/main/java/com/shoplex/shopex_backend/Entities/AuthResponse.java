package com.shoplex.shopex_backend.Entities;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    String token;
    User user;
}
