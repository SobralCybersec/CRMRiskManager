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

    public User register(String name, String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email já cadastrado");
        }

        if (password.length() < 3) {
            throw new RuntimeException("Senha deve ter no mínimo 3 caracteres");
        }

        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setRole(User.Role.USER);

        return userRepository.save(user);
    }
}