package com.siddhant.projects.airBnbApp.service;

import com.siddhant.projects.airBnbApp.entity.Booking;

public interface CheckoutService {

    String getCheckoutSession(Booking booking, String successUrl, String failureUrl);

}
