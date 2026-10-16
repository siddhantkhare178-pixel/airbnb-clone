package com.siddhant.projects.airBnbApp.service;

import com.siddhant.projects.airBnbApp.dto.ProfileUpdateRequestDto;
import com.siddhant.projects.airBnbApp.dto.UserDto;
import com.siddhant.projects.airBnbApp.entity.User;

public interface UserService {

    User getUserById(Long id);

    void updateProfile(ProfileUpdateRequestDto profileUpdateRequestDto);

    UserDto getMyProfile();
}
