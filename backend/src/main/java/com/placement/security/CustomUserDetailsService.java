package com.placement.security;

import com.placement.entity.Student;
import com.placement.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private StudentRepository studentRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Student> student = studentRepository.findByEmail(email);
        if (student.isEmpty()) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return new CustomUserDetails(student.get().getEmail(), student.get().getPasswordHash());
    }
}
