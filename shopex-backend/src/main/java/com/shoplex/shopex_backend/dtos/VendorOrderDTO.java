package com.shoplex.shopex_backend.dtos;

import java.time.LocalDateTime;
import java.util.List;

import com.shoplex.shopex_backend.Entities.Order;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VendorOrderDTO {
    private Long orderId;
    private Double totalAmount;
    private LocalDateTime createdAt;
    private List<ItemDTO> orderItems;
    private Order.OrderStatus orderStatus;
    
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ItemDTO{
        private Long itemId;
        private String productName;
        private Integer quantity;
    }
}
