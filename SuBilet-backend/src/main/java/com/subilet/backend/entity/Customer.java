package com.subilet.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "customer")
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "tc_no", unique = true, nullable = false, length = 11)
    private String tcNo;

    @Column(name = "isim_soyad", nullable = false)
    private String isimSoyad;

    @Column(name = "dogum_tarihi")
    private LocalDate dogumTarihi;

    @Column(name = "uyruk")
    private String uyruk;

    @Column(name = "cinsiyet")
    private String cinsiyet;

    @Column(name = "mail", unique = true)
    private String mail;

    @Column(name = "tel_no")
    private String telNo;
}