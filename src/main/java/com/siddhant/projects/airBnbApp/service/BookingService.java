package com.siddhant.projects.airBnbApp.service;

import com.siddhant.projects.airBnbApp.dto.BookingDto;
import com.siddhant.projects.airBnbApp.dto.BookingRequest;
import com.siddhant.projects.airBnbApp.dto.GuestDto;
import com.siddhant.projects.airBnbApp.dto.HotelReportDto;
import com.siddhant.projects.airBnbApp.entity.enums.BookingStatus;
import com.stripe.model.Event;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface BookingService {

    BookingDto initialiseBooking(BookingRequest bookingRequest);

    BookingDto addGuests(Long bookingId, List<Long> guestIdList);

    String initiatePayments(Long bookingId);

    void capturePayment(Event event);

    void cancelBooking(Long bookingId);

    BookingStatus getBookingStatus(Long bookingId);

    List<BookingDto> getAllBookingsByHotelId(Long hotelId);

    HotelReportDto getHotelReport(Long hotelId, LocalDate startDate, LocalDate endDate);

    List<BookingDto> getMyBookings();
}
