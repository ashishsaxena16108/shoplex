package com.shoplex.shopex_backend.dtos;

import java.time.LocalDateTime;
import java.util.List;

import com.shoplex.shopex_backend.Entities.Order;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DeliveryOrderDTO {
    private Long orderId;
    private List<ItemDTO> orderItems;
    private Double totalAmount;
    private Order.OrderStatus orderStatus;
    private String userAddress;
    private String vendorAddress;
    private LocalDateTime createdAt;

    @NoArgsConstructor
    @AllArgsConstructor
    @Getter
    @Setter
    public static class ItemDTO {
        private Long itemId;
        private String productName;
        private Integer quantity;
        private Double price;
    }
}
