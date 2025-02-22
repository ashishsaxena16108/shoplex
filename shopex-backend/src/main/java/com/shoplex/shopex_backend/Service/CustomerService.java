package com.shoplex.shopex_backend.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.razorpay.RazorpayException;
import com.shoplex.shopex_backend.Entities.Item;
import com.shoplex.shopex_backend.Entities.Order;
import com.shoplex.shopex_backend.Entities.Payment;
import com.shoplex.shopex_backend.Entities.Product;
import com.shoplex.shopex_backend.Entities.ShoppingCart;
import com.shoplex.shopex_backend.Entities.User;
import com.shoplex.shopex_backend.Entities.Wishlist;
import com.shoplex.shopex_backend.Entities.Order.OrderStatus;
import com.shoplex.shopex_backend.Entities.Payment.PaymentStatus;
import com.shoplex.shopex_backend.Repositories.PaymentRepository;
import com.shoplex.shopex_backend.Repositories.ProductRepository;
import com.shoplex.shopex_backend.Repositories.UserRepository;
import com.shoplex.shopex_backend.Util.JwtUtil;

@Service
public class CustomerService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private ProductRepository productRepository;
    @Autowired 
    PaymentRepository paymentRepository;
    @Autowired
    private ImageService imageService;
    @Autowired
    private PaymentService paymentService;
    public int updateProfile(String userJSON,MultipartFile file,String username) throws IOException{
       ObjectMapper objectMapper = new ObjectMapper();
       User user = objectMapper.readValue(userJSON, User.class);
       User existingUser = userRepository.findByEmail(username);
       existingUser.setFirstName(user.getFirstName());
         existingUser.setLastName(user.getLastName());
            existingUser.setAddress(user.getAddress());
            existingUser.setPhoneNumber(user.getPhoneNumber());
            existingUser.setEmail(user.getEmail());
            if(file!=null){
                existingUser.setProfileImageUrl(imageService.uploadImage(file));
            }
        return userRepository.save(existingUser) != null ? 1 : 0;

    }
    public int saveCart(ShoppingCart cart,String username){
       User user = userRepository.findByEmail(username);
       user.setShoppingCart(cart);
       return userRepository.save(user)==null?0:1;
    }
    public int addToWishlist(Long productId,String username){
      User user = userRepository.findByEmail(username);
      if(user==null)
         return 0;
      Optional<Product> product = productRepository.findById(productId);
      if(product.isEmpty())
       return -1;
      // Add product to wishlist
      Wishlist wishlist = user.getWishlist();
      wishlist.getProducts().add(product.get());
      user.setWishlist(wishlist);
      userRepository.save(user);
      return 1;
    }
    public String placeOrder(Order order,String username) throws RazorpayException {
        User user = userRepository.findByEmail(username);
        user.getOrders().add(order);
        order.setUser(user);
        
        String orderId = paymentService.getPayment(new Double(order.getTotalAmount()*100).intValue());
        order.setOrderStatus(OrderStatus.PLACED);
        userRepository.save(user);
        savePaymentsToVendors(order);
        return orderId;
    }
    public ShoppingCart showcart(String username) {
        User user = userRepository.findByEmail(username);
        if (user == null) {
            return null;
        }
        return user.getShoppingCart();
    }
    public Wishlist showwishlist(String username) {
        User user = userRepository.findByEmail(username);
        if (user == null) {
            return null;
        }
        return user.getWishlist();
    }
    private void savePaymentsToVendors(Order order) {
        Map<User, Double> vendorPayments = new HashMap<>();

        for (Item item : order.getOrderItems()) {
            User vendor = item.getVendorProduct().getVendor();
            double amount = item.getQuantity() * item.getVendorProduct().getPrice();

            vendorPayments.put(vendor, vendorPayments.getOrDefault(vendor, 0.0) + amount);
        }

        for (Map.Entry<User, Double> entry : vendorPayments.entrySet()) {
            User vendor = entry.getKey();
            double amount = entry.getValue();
            Payment payment = new Payment();
            payment.setAmount(amount);
            payment.setVendor(vendor);
        }
    }
    // @Scheduled(fixedRate = 1200000)
    // public void givePayments(){
    //     List<Payment> pendingPayments = paymentRepository.findByPaymentStatus(PaymentStatus.PENDING);
    //     for (Payment payment : pendingPayments) {
    //         try {
    //             Map<String,Object> map = new HashMap<>();
    //             map.put("amount",payment.getAmount());
    //             map.put("vendor_name",payment.getVendor().getFirstName()+" "+payment.getVendor().getLastName());
    //             map.put("vendor_email",payment.getVendor().getEmail());
    //             map.put("vendor_phone", payment.getVendor().getPhoneNumber());
    //             paymentService.sendPayment(map);

    //             // Update payment status to COMPLETED
    //             payment.setPaymentStatus(Payment.PaymentStatus.COMPLETED);
    //             paymentRepository.save(payment);
    //         } catch (Exception e) {
    //             // Handle payment failure
    //             e.printStackTrace();
    //         }
    //     }
    // }
}
