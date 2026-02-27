package com.homecare.controller;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.homecare.model.Registration;
import com.homecare.service.RegistrationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/registrations")
public class RegistrationController {

    @Autowired
    private RegistrationService registrationService;

    @GetMapping
    public ResponseEntity<List<Registration>> getAllRegistrations() {
        List<Registration> registrations = registrationService.getAllRegistrations();
        return ResponseEntity.ok(registrations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Registration> getRegistrationById(@PathVariable Long id) {
        Optional<Registration> registration = registrationService.getRegistrationById(id);
        return registration.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createRegistration(@Valid @RequestBody Registration registration) {
        try {
            // Check if email already exists
            if (registrationService.findByEmail(registration.getEmail()).isPresent()) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "Email already registered");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
            }

            Registration savedRegistration = registrationService.createRegistration(registration);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Registration created successfully");
            response.put("data", savedRegistration);
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Error creating registration: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateRegistration(@PathVariable Long id, @Valid @RequestBody Registration registration) {
        try {
            Registration updatedRegistration = registrationService.updateRegistration(id, registration);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Registration updated successfully");
            response.put("data", updatedRegistration);
            
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteRegistration(@PathVariable Long id) {
        try {
            registrationService.deleteRegistration(id);
            Map<String, String> response = new HashMap<>();
            response.put("success", "true");
            response.put("message", "Registration deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("success", "false");
            errorResponse.put("message", "Error deleting registration: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    @GetMapping("/search/email/{email}")
    public ResponseEntity<Registration> findByEmail(@PathVariable String email) {
        Optional<Registration> registration = registrationService.findByEmail(email);
        return registration.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/search/firstName/{firstName}")
    public ResponseEntity<List<Registration>> findByFirstName(@PathVariable String firstName) {
        List<Registration> registrations = registrationService.findByFirstName(firstName);
        return ResponseEntity.ok(registrations);
    }

    @GetMapping("/search/lastName/{lastName}")
    public ResponseEntity<List<Registration>> findByLastName(@PathVariable String lastName) {
        List<Registration> registrations = registrationService.findByLastName(lastName);
        return ResponseEntity.ok(registrations);
    }

    @GetMapping("/share-link/{registrationCode}")
    public ResponseEntity<Map<String, String>> getShareLink(@PathVariable String registrationCode) {
        Optional<Registration> registration = registrationService.findByRegistrationCode(registrationCode);
        
        if (registration.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Map<String, String> response = new HashMap<>();
        String frontendBaseUrl = "http://localhost:3000";
        String registrationLink = frontendBaseUrl + "/register?code=" + registrationCode;
        String whatsappMessage = "Complete your homecare registration: " + registrationLink;
        String whatsappUrl = "https://wa.me/?text=" + URLEncoder.encode(whatsappMessage, StandardCharsets.UTF_8);
        
        response.put("registrationCode", registrationCode);
        response.put("registrationLink", registrationLink);
        response.put("whatsappShareLink", whatsappUrl);
        response.put("qrCodeData", registrationLink);
        
        return ResponseEntity.ok(response);
    }
}
