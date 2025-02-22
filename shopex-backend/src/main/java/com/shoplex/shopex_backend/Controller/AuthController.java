package com.shoplex.shopex_backend.Controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shoplex.shopex_backend.Entities.AuthResponse;
import com.shoplex.shopex_backend.Entities.ShoppingCart;
import com.shoplex.shopex_backend.Entities.User;
import com.shoplex.shopex_backend.Entities.Wishlist;
import com.shoplex.shopex_backend.Repositories.UserRepository;
import com.shoplex.shopex_backend.Util.JwtUtil;

@RestController
@CrossOrigin
@RequestMapping("/shoplex/auth")
public class AuthController {
   @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @PostMapping("/signin/user")
    public ResponseEntity<?> userSignIn(@RequestBody User user) {
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser != null && passwordEncoder.matches(user.getPassword(), existingUser.getPassword()) && !existingUser.isAdmin()) {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
            final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            final String jwt = jwtUtil.generateToken(userDetails.getUsername(),existingUser.getRole());
            return ResponseEntity.ok(new AuthResponse(jwt,existingUser));
        } else {
            return ResponseEntity.status(401).body("Invalid username or password for user");
        }
    }

    @PostMapping("/signin/admin")
    public ResponseEntity<String> adminSignIn(@RequestBody User user) {
        User existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser != null && passwordEncoder.matches(user.getPassword(), existingUser.getPassword()) && existingUser.isAdmin()) {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));
            final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
            final String jwt = jwtUtil.generateToken(userDetails.getUsername(),existingUser.getRole());
            return ResponseEntity.ok(jwt);
        } else {
            return ResponseEntity.status(401).body("Invalid username or password for admin");
        }
    }
    @PostMapping("/signup/user")
    public ResponseEntity<String> userSignUp(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.status(400).body("Email already in use");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setShoppingCart(new ShoppingCart());
        user.setWishlist(new Wishlist());
        userRepository.save(user);
        return ResponseEntity.ok("User sign-up successful");

    }
    @PostMapping("/signup/admin")
    public ResponseEntity<String> adminSignUp(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            return ResponseEntity.status(400).body("Email already in use");
        }
        user.setRole(User.Role.ADMIN);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("Admin sign-up successful");
    }
    @GetMapping("/verifyToken")
  public ResponseEntity<Map<String,Object>> getProfile(@RequestBody String token) {
      Map<String,Object> m = new HashMap<>();
      String username = jwtUtil.extractUsername(token);
      User user = userRepository.findByEmail(username);
      if(user==null){
        m.put("error", "User not found");
        return ResponseEntity.badRequest().body(m);
      }
      m.put("user", user);
      return ResponseEntity.ok(m);
  }
}
