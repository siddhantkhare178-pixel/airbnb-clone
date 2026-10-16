package com.siddhant.projects.airBnbApp.repository;

import com.siddhant.projects.airBnbApp.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoomRepository extends JpaRepository<Room, Long> {
}
