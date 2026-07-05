package com.placement.controller;

import com.placement.dto.AuthRequest;
import com.placement.dto.AuthResponse;
import com.placement.entity.Student;
import com.placement.repository.StudentRepository;
import com.placement.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthRequest authRequest) throws Exception {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword())
            );
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Incorrect username or password");
        }

        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails.getUsername());
        Student student = studentRepository.findByEmail(authRequest.getEmail()).get();

        return ResponseEntity.ok(new AuthResponse(jwt, student.getEmail(), student.getName()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody Student student) {
        if(studentRepository.findByEmail(student.getEmail()).isPresent()){
            return ResponseEntity.badRequest().body("Email already exists");
        }
        student.setPasswordHash(passwordEncoder.encode(student.getPasswordHash()));
        studentRepository.save(student);
        return ResponseEntity.ok("User registered successfully");
    }
}
