package com.example.ToDoList.Dto;

public class AuthDtos {
    public record RegisterRequest(String username, String email, String password, String role) {}

    public record LoginRequest(String username, String password) {}

    public record AuthResponse(String token) {}
}
