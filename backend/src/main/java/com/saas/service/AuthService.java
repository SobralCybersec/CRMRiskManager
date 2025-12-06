package com.saas.service;

import com.saas.entity.User;
import com.saas.repository.UserRepository;
import com.saas.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public String authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        
        if (!passwordEncoder.matches(password, user.getPasswordHash())) {
            throw new RuntimeException("Senha inválida");
        }
        
        return jwtUtil.generateToken(user.getEmail(), user.getRole().name());
    }
}