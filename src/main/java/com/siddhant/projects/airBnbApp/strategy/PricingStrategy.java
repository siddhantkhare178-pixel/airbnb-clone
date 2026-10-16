package com.siddhant.projects.airBnbApp.strategy;

import com.siddhant.projects.airBnbApp.entity.Inventory;

import java.math.BigDecimal;
public interface PricingStrategy {

    BigDecimal calculatePrice(Inventory inventory);
}
