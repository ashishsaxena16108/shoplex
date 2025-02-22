package com.shoplex.shopex_backend.Controller;

import java.io.IOException;
import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.razorpay.RazorpayException;
import com.shoplex.shopex_backend.Entities.Order;
import com.shoplex.shopex_backend.Entities.ShoppingCart;
import com.shoplex.shopex_backend.Entities.User;
import com.shoplex.shopex_backend.Entities.Wishlist;
import com.shoplex.shopex_backend.Service.CustomerService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@CrossOrigin
@RequestMapping("/shoplex/customer")
public class CustomerController {
  @Autowired
  private CustomerService customerService;

  @PostMapping("/updateProfile")
  public ResponseEntity<String> updateProfile(@RequestParam("user") String userJSON,@RequestParam("file")MultipartFile file,Principal principal) throws IOException {
    
    return customerService.updateProfile(userJSON,file,principal.getName())==1?ResponseEntity.ok("User updated successfully"):ResponseEntity.badRequest().body("Profile update failed");
  }

  @GetMapping("/showcart")
  public ResponseEntity<ShoppingCart> showcart(Principal principal) {
      
      return ResponseEntity.ok(customerService.showcart(principal.getName()));
  }
  @GetMapping("/showwishlist")
  public ResponseEntity<Wishlist> showWishlist(Principal principal) {
      
      return ResponseEntity.ok(customerService.showwishlist(principal.getName()));
  }
  @PostMapping("/savecart")
  public ResponseEntity<String> saveCart(@RequestBody ShoppingCart cart,Principal principal) {
      int result = customerService.saveCart(cart,principal.getName());
      return result==1?ResponseEntity.ok("Cart saved successfully"):ResponseEntity.badRequest().body("Cart saving got failed");
  }
  @PostMapping("/addtowishlist")
  public ResponseEntity<String> addToWishlist(@RequestBody Long productId,Principal principal) {
      int result = customerService.addToWishlist(productId,principal.getName());
      if(result==1)
        return ResponseEntity.ok("Product added to wishlist successfully");
      if(result==-1)
        return ResponseEntity.badRequest().body("Product not found");
    
      return ResponseEntity.badRequest().body("Product addition to wishlist failed");
  }
  @PostMapping("/placeOrder")
  public ResponseEntity<Map<String,String>> placeOrder(@RequestBody Order order,Principal principal) throws RazorpayException {
      System.out.println(order.toString());
      String result = customerService.placeOrder(order,principal.getName());
      Map<String,String> m = new HashMap<>();
      if(result!=null){
        m.put("paymentId", result);
        return ResponseEntity.ok(m);
      }
      m.put("error", "Payment Id creation failed");
      return ResponseEntity.badRequest().body(m);
  }
  
  
}
