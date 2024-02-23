package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class UserServiceTest {
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;
    private final Long id = 1L;

    @BeforeEach
    public void setup() {
        userService = new UserService(userRepository);
    }

    @Test
    @DisplayName("delete user by ID")
    public void giveIDUser_thenDeleteUserById_shouldReturnVoid() {
        userService.delete(id);

        Mockito.verify(userRepository).deleteById(id);
    }

    @Test
    @DisplayName("find user by ID")
    public void giveIDUser_thenFindUserById_shouldReturnUser() {
        User user = new User();
        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        User newUser = userService.findById(id);

        Mockito.verify(userRepository).findById(id);
        assertEquals(user, newUser);
    }

    @Test
    @DisplayName("user not found")
    public void giveIDUser_thenFindUserById_shouldReturnEmpty() {
        when(userRepository.findById(id)).thenReturn(Optional.empty());

        User newUser = userService.findById(id);

        Mockito.verify(userRepository).findById(id);
        assertNull(newUser);
    }
}