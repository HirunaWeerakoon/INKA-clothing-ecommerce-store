package com.example.inka_backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Enumerated(EnumType.STRING)
    @Column(name = "item_type", nullable = false)
    private OrderItemType itemType;

    @Column(name = "product_id")
    private Long productId;

    @Column(name = "custom_order_id")
    private Long customOrderId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "unit_amount", nullable = false)
    private Long unitAmount;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "line_total", nullable = false)
    private Long lineTotal;
}
