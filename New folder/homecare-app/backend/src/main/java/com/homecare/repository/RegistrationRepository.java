package com.homecare.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.homecare.model.Registration;

@Repository
public interface RegistrationRepository extends JpaRepository<Registration, Long> {
    Optional<Registration> findByEmail(String email);
    Optional<Registration> findByRegistrationCode(String registrationCode);
    List<Registration> findByFirstNameIgnoreCase(String firstName);
    List<Registration> findByLastNameIgnoreCase(String lastName);
}
