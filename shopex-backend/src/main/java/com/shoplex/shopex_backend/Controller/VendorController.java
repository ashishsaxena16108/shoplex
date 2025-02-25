package com.shoplex.shopex_backend.Controller;

import java.io.IOException;
import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shoplex.shopex_backend.Entities.Item;
import com.shoplex.shopex_backend.Entities.Notification;
import com.shoplex.shopex_backend.Entities.Order;
import com.shoplex.shopex_backend.Entities.Product;
import com.shoplex.shopex_backend.Entities.User;
import com.shoplex.shopex_backend.Entities.VendorProduct;
import com.shoplex.shopex_backend.Repositories.OrderRepository;
import com.shoplex.shopex_backend.Repositories.ProductRepository;
import com.shoplex.shopex_backend.Repositories.UserRepository;
import com.shoplex.shopex_backend.Repositories.VendorProductRepository;
import com.shoplex.shopex_backend.Service.ImageService;
import com.shoplex.shopex_backend.dtos.VendorOrderDTO;

import org.springframework.web.bind.annotation.GetMapping;

@RestController
@CrossOrigin
@RequestMapping("/shoplex/vendor")
public class VendorController {
    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private VendorProductRepository vendorProductRepository;
    @Autowired
    private ImageService imageService;

    // Add or edit product
    @PostMapping("/addproduct")
    public ResponseEntity<String> addProduct(@RequestParam("product") String vendorProductJSON,
            @RequestParam("file") MultipartFile file, Principal principal) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        VendorProduct vendorProduct = objectMapper.readValue(vendorProductJSON, VendorProduct.class);
        User vendor = userRepository.findByEmail(principal.getName());
        Product product = vendorProduct.getProduct();
        vendorProduct.setVendor(vendor);
        // Check if the product already exists
        Product existingProduct = productRepository.findByNameAndBrand(product.getName(), product.getBrand());

        if (existingProduct == null) {
            // Create new product
            if (file != null && !file.isEmpty()) {
                product.setImageUrl(imageService.uploadImage(file));
            }
            productRepository.save(product);
        } else {
            product = existingProduct;
        }

        // Create or update vendor product
        VendorProduct existingvendorProduct = vendorProductRepository.findByVendorAndProduct(vendor, product);
        if (existingvendorProduct == null) {
            existingvendorProduct = new VendorProduct();
            existingvendorProduct.setVendor(vendor);
            existingvendorProduct.setProduct(product);
        }
        existingvendorProduct.setPrice(vendorProduct.getPrice());
        existingvendorProduct.setQuantity(vendorProduct.getQuantity());
        existingvendorProduct.setAvailability(vendorProduct.getAvailability());
        vendorProductRepository.save(existingvendorProduct);

        return ResponseEntity.ok("Product added/updated successfully");
    }

    // Delete vendor product
    @DeleteMapping("/deleteproduct/{id}")
    public ResponseEntity<String> deleteVendorProduct(@PathVariable Long id, Principal principal) {
        Optional<VendorProduct> optionalVendorProduct = vendorProductRepository.findById(id);
        if (!optionalVendorProduct.isPresent()) {
            return ResponseEntity.badRequest().body("Vendor product not found");
        }

        VendorProduct vendorProduct = optionalVendorProduct.get();
        if (!vendorProduct.getVendor().getEmail().equals(principal.getName())) {
            return ResponseEntity.status(403).body("You are not authorized to delete this product");
        }

        if (vendorProduct.getOrderItems().size() > 0) {
            return ResponseEntity.badRequest().body("Product has orders and cannot be deleted");
        }

        vendorProductRepository.delete(vendorProduct);

        return ResponseEntity.ok("Vendor product deleted successfully");
    }

    @GetMapping("/myproducts")
    public ResponseEntity<List<VendorProduct>> getMyProducts(Principal principal) {
        User vendor = userRepository.findByEmail(principal.getName());
        List<VendorProduct> vendorProducts = vendorProductRepository.findByVendor(vendor);
        return ResponseEntity.ok(vendorProducts);
    }

    @GetMapping("/myorders")
    public ResponseEntity<List<VendorOrderDTO>> getMyOrders(Principal principal) {
        
        return ResponseEntity.ok(getVendorOrders(principal.getName()));
    }

    @PostMapping("/updateorderstatus")
    public ResponseEntity<String> updateOrderStatus(@RequestParam Long orderId, Principal principal) {
        Order order = orderRepository.findById(orderId).get();
        order.setOrderStatus(Order.OrderStatus.PROCESSING);
        for (Item item : order.getOrderItems()) {
            VendorProduct vendorProduct = vendorProductRepository.findByVendorAndProduct(item.getVendorProduct().getVendor(), item.getVendorProduct().getProduct());
            if (vendorProduct != null && vendorProduct.getVendor().getEmail().equals(principal.getName())) {
                vendorProduct.setQuantity(vendorProduct.getQuantity() - item.getQuantity());
                if (vendorProduct.getQuantity() == 0) {
                    vendorProduct.setAvailability(false);
                }
                vendorProductRepository.save(vendorProduct);
            }
        }
        order.getUser().getNotifications().add(new Notification("Order status updated to processing"));
        orderRepository.save(order);

        return ResponseEntity.ok("Order status updated successfully");

    }
    public List<VendorOrderDTO> getVendorOrders(String vendorEmail) {
        User vendor = userRepository.findByEmail(vendorEmail);
        List<Order> orders = orderRepository.findAll(); // Fetch all orders

        return orders.stream()
                .map(order -> filterOrderItemsForVendor(order, vendor))
                .filter(dto -> !dto.getOrderItems().isEmpty()) // Filter out orders with no items for the vendor
                .collect(Collectors.toList());
    }

    private VendorOrderDTO filterOrderItemsForVendor(Order order, User vendor) {
        double totalAmount = order.getOrderItems().stream()
                .filter(item -> item.getVendorProduct().getVendor().equals(vendor))
                .mapToDouble(item -> item.getQuantity() * item.getVendorProduct().getPrice())
                .sum();
        List<VendorOrderDTO.ItemDTO> vendorItems = order.getOrderItems().stream()
                .filter(item -> item.getVendorProduct().getVendor().equals(vendor))
                .map(item -> new VendorOrderDTO.ItemDTO(
                        item.getId(),
                        item.getVendorProduct().getProduct().getName(),
                        item.getQuantity()))
                .collect(Collectors.toList());

        return new VendorOrderDTO(
                order.getId(),
                totalAmount,
                order.getCreatedAt(),
                vendorItems,
                order.getOrderStatus());
    }
}
