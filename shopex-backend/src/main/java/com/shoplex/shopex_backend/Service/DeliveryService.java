package com.shoplex.shopex_backend.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.shoplex.shopex_backend.Entities.Order;
import com.shoplex.shopex_backend.Entities.User;
import com.shoplex.shopex_backend.Repositories.OrderRepository;
import com.shoplex.shopex_backend.Repositories.UserRepository;
import com.shoplex.shopex_backend.dtos.DeliveryOrderDTO;

@Service
public class DeliveryService {
     @Autowired
     private UserRepository userRepository;
     @Autowired
     private OrderRepository orderRepository;

     @Scheduled(fixedRate = 1200000)
     public void assignDeliveryAgent() {
         // assign delivery agent to the order
        Optional<Order> order = orderRepository.findByOrderProcessing();
        if (order.isPresent()) {
            Optional<User> deliveryAgent = userRepository.findFirstByIsAvailableTrue();
            if (deliveryAgent.isPresent()) {
                order.get().setOrderStatus(Order.OrderStatus.SHIPPING);
                deliveryAgent.get().setAvailable(false);
                order.get().setDeliveryAgent(deliveryAgent.get());
                orderRepository.save(order.get());
                userRepository.save(deliveryAgent.get());
            }
        }
     }
     public int markOrderDelivered(Long orderId) {
         Optional<Order> order = orderRepository.findById(orderId);
         if (order.isPresent()) {
             order.get().setOrderStatus(Order.OrderStatus.DELIVERED);
             User agent = order.get().getDeliveryAgent();
             agent.setAvailable(true);
             boolean bool = orderRepository.save(order.get())==null;
                userRepository.save(agent);
            return bool?0:1;
         }
         return -1;
     }
     public int markOrderOutForDelivery(Long orderId) {
         Optional<Order> order = orderRepository.findById(orderId);
         if (order.isPresent()) {
             order.get().setOrderStatus(Order.OrderStatus.OUT_FOR_DELIVERY);
             return orderRepository.save(order.get())==null?0:1;
         }
         return -1;
     }

     public List<DeliveryOrderDTO> getDeliveryOrders(String deliveryAgentEmail) {
        User deliveryPerson = userRepository.findByEmail(deliveryAgentEmail);
          
        List<Order> orders = deliveryPerson.getDeliveryOrders();
        return orders.stream().map(this::convertToDeliveryOrderDTO).collect(Collectors.toList());
    }

    private DeliveryOrderDTO convertToDeliveryOrderDTO(Order order) {
        DeliveryOrderDTO dto = new DeliveryOrderDTO();
        dto.setOrderId(order.getId());
        dto.setOrderItems(order.getOrderItems().stream().map(item -> {
            DeliveryOrderDTO.ItemDTO itemDTO = new DeliveryOrderDTO.ItemDTO();
            itemDTO.setItemId(item.getId());
            itemDTO.setProductName(item.getVendorProduct().getProduct().getName());
            itemDTO.setQuantity(item.getQuantity());
            itemDTO.setPrice(item.getVendorProduct().getPrice());
            return itemDTO;
        }).collect(Collectors.toList()));
        dto.setTotalAmount(order.getTotalAmount());
        dto.setOrderStatus(order.getOrderStatus());
        dto.setUserAddress(order.getUser().getAddress());
        dto.setVendorAddress(order.getOrderItems().get(0).getVendorProduct().getVendor().getAddress());
        dto.setCreatedAt(order.getCreatedAt());
        return dto;
    }
}
