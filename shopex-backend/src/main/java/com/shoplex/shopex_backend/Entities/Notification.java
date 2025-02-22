package com.shoplex.shopex_backend.Entities;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JsonBackReference(value="user-notifications")
    private User user;
    private String message;
    @Enumerated(EnumType.STRING)
    private NotificationType notificationType;
    private Boolean isRead = false;
    private LocalDateTime createdAt = LocalDateTime.now();
    public Notification(String message) {
        this.message = message;
    }
    public enum NotificationType {
        EMAIL, SMS, PUSH
    }
}
