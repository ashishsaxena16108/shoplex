package com.shoplex.shopex_backend.Controller;

import java.security.Principal;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shoplex.shopex_backend.Service.DeliveryService;
import com.shoplex.shopex_backend.dtos.DeliveryOrderDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;



@RestController
@RequestMapping("/shoplex/delivery")
public class DeliveryController {
     @Autowired
     private DeliveryService deliveryService;
     
     @GetMapping("/myorders")
     public ResponseEntity<List<DeliveryOrderDTO>> getOrders(Principal principal) {
         return ResponseEntity.ok(deliveryService.getDeliveryOrders(principal.getName()));
     }
     @PostMapping("/mark-order-delivered/{orderId}")
     public ResponseEntity<String> markOrderDelivered(@PathVariable Long orderId) {
         int res = deliveryService.markOrderDelivered(orderId);
         if(res==0)
           return ResponseEntity.badRequest().body("Order marking delivered failed");
         if(res==-1)
           return ResponseEntity.badRequest().body("Order not present");
         return ResponseEntity.ok("Order marked delivered sucessfully");
     }
     @PostMapping("/mark-order-shipping/{orderId}")
      public ResponseEntity<String> markOrderShipping(@PathVariable Long orderId) {
          int res = deliveryService.markOrderShipping(orderId);
          if(res==0)
            return ResponseEntity.badRequest().body("Order marking shipping failed");
          if(res==-1)
            return ResponseEntity.badRequest().body("Order not present");
          return ResponseEntity.ok("Order marked shipping sucessfully");
      }
     @PostMapping("/mark-order-out-for-delivery/{orderId}")
     public ResponseEntity<String> markOrderOutForDelivery(@PathVariable Long orderId) {
         int res = deliveryService.markOrderOutForDelivery(orderId);
         if(res==0)
           return ResponseEntity.badRequest().body("Order marking out for delivery failed");
         if(res==-1)
           return ResponseEntity.badRequest().body("Order not present");
         return ResponseEntity.ok("Order marked out for delivery sucessfully");
     }
}
