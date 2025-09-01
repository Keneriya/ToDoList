package com.example.ToDoList.Service;

import com.example.ToDoList.Dto.AuthDtos;
import com.example.ToDoList.Model.Role;
import com.example.ToDoList.Model.User;
import com.example.ToDoList.Repository.UserRepository;
import com.example.ToDoList.configuration.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private AuthenticationManager authenticationManager;
    @Autowired private JwtUtils jwtUtils;

    // --- Register ---
    public String register(AuthDtos.RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            return "Email already taken!";
        }

        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole("ADMIN".equalsIgnoreCase(request.role()) ? Role.ADMIN : Role.USER);

        userRepository.save(user);
        return "User registered successfully!";
    }

    // --- Login ---
    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.username(), request.password())
        );
        String token = jwtUtils.generateToken(request.username());
        return new AuthDtos.AuthResponse(token);
    }
}
