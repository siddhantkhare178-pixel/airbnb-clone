package com.siddhant.projects.airBnbApp.dto;

import com.siddhant.projects.airBnbApp.entity.User;
import com.siddhant.projects.airBnbApp.entity.enums.Gender;
import lombok.Data;

import java.time.LocalDate;

@Data
public class GuestDto {
    private Long id;
    private String name;
    private Gender gender;
    private LocalDate dateOfBirth;
}
