package com.homecare.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.homecare.model.Registration;
import com.homecare.repository.RegistrationRepository;

@Service
@Transactional
public class RegistrationService {

    @Autowired
    private RegistrationRepository registrationRepository;

    public Registration createRegistration(Registration registration) {
        return registrationRepository.save(registration);
    }

    public Registration updateRegistration(Long id, Registration registrationDetails) {
        return registrationRepository.findById(id).map(registration -> {
            registration.setFirstName(registrationDetails.getFirstName());
            registration.setLastName(registrationDetails.getLastName());
            registration.setEmail(registrationDetails.getEmail());
            registration.setPhoneNumber(registrationDetails.getPhoneNumber());
            registration.setDateOfBirth(registrationDetails.getDateOfBirth());
            registration.setGender(registrationDetails.getGender());
            registration.setAddress(registrationDetails.getAddress());
            registration.setCity(registrationDetails.getCity());
            registration.setState(registrationDetails.getState());
            registration.setZipCode(registrationDetails.getZipCode());
            registration.setMedicalHistory(registrationDetails.getMedicalHistory());
            registration.setCurrentMedications(registrationDetails.getCurrentMedications());
            registration.setEmergencyContactName(registrationDetails.getEmergencyContactName());
            registration.setEmergencyContactPhone(registrationDetails.getEmergencyContactPhone());
            registration.setEmergencyContactRelation(registrationDetails.getEmergencyContactRelation());
            registration.setTermsAccepted(registrationDetails.getTermsAccepted());
            return registrationRepository.save(registration);
        }).orElseThrow(() -> new RuntimeException("Registration not found with id: " + id));
    }

    public Optional<Registration> getRegistrationById(Long id) {
        return registrationRepository.findById(id);
    }

    public List<Registration> getAllRegistrations() {
        return registrationRepository.findAll();
    }

    public void deleteRegistration(Long id) {
        registrationRepository.deleteById(id);
    }

    public Optional<Registration> findByEmail(String email) {
        return registrationRepository.findByEmail(email);
    }

    public List<Registration> findByFirstName(String firstName) {
        return registrationRepository.findByFirstNameIgnoreCase(firstName);
    }

    public List<Registration> findByLastName(String lastName) {
        return registrationRepository.findByLastNameIgnoreCase(lastName);
    }

    public Optional<Registration> findByRegistrationCode(String registrationCode) {
        return registrationRepository.findByRegistrationCode(registrationCode);
    }
}
