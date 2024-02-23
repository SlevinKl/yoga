package com.openclassrooms.starterjwt.controllers;

import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.mockito.Mockito.*;


@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class UserControllerTest {
    @InjectMocks
    private UserController userController;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    private MockMvc mockMvc;

    private final String id = "10";

    @BeforeEach
    void setUp(){
        userService = new UserService(userRepository);
        userController = new UserController(userService,userMapper);
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
    }

    @Test
    @DisplayName("Return a user")
    void giveIDUser_thenFindUserById_shouldReturnUserDto() throws Exception {
        // Create User
        User user = new User();
        user.setEmail("test@test.fr");
        user.setLastName("test");
        user.setFirstName("test");
        UserDto expectedUserDto = userMapper.toDto(user);
        // Stub userRepository.findById
        when(userRepository.findById(Long.parseLong(id))).thenReturn(Optional.of(user));

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user/{id}", id))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.email").value(expectedUserDto.getEmail()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.lastName").value(expectedUserDto.getLastName()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.firstName").value(expectedUserDto.getFirstName()));
        // Verify the response
        verify(userRepository).findById(Long.parseLong(id));
    }

    @Test
    @DisplayName("Delete a user")
    void giveIDUser_thenFindUserById_shouldDeleteUser() throws Exception {
        // Create User
        User user = new User();
        user.setEmail("test@test.fr");
        // create user details
        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "test@test.fr", "John",
                "Doe", false, "password");
        // mock security context and set it
        SecurityContext securityContext = mock(SecurityContext.class);
        SecurityContextHolder.setContext(securityContext);

        // Stub securityContext.getAuthentication and return user details
        when(securityContext.getAuthentication()).thenReturn(new UsernamePasswordAuthenticationToken(userDetails, null));
        // Stub userRepository.findById
        when(userRepository.findById(Long.parseLong(id))).thenReturn(Optional.of(user));

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/user/{id}", id))
                .andExpect(MockMvcResultMatchers.status().isOk());

        // Verify the response
        verify(userRepository).findById(Long.parseLong(id));
    }

    @Test
    @DisplayName("Throw not found user")
    void giveIDUser_thenFindUserById_shouldNotFoundUser() throws Exception {
        // Stub userRepository.findById
        when(userRepository.findById(Long.parseLong(id))).thenReturn(Optional.empty());

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user/{id}", id))
                .andExpect(MockMvcResultMatchers.status().isNotFound());
        // Verify the response
        verify(userRepository).findById(Long.parseLong(id));
    }


    @Test
    @DisplayName("Throw bad request error")
    void giveIDUser_thenFindUserById_shouldThrowBadRequestError() throws Exception {
        // Stub userRepository.findById
        when(userRepository.findById(Long.parseLong(id))).thenThrow(NumberFormatException.class);

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.get("/api/user/{id}", id))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
        // Verify the response
        verify(userRepository).findById(Long.parseLong(id));
    }

    @Test
    @DisplayName("Return not found status")
    void giveIDUser_thenFindUserById_shouldReturnNotFoundStatus() throws Exception {
        when(userRepository.findById(Long.parseLong(id))).thenReturn(Optional.empty());

        mockMvc.perform(MockMvcRequestBuilders.delete("/api/user/{id}", id))
                .andExpect(MockMvcResultMatchers.status().isNotFound());

        verify(userRepository).findById(Long.parseLong(id));
    }

    @Test
    @DisplayName("Return unauthorized status")
    void giveIDUser_thenFindUserById_shouldReturnUnauthorizedStatus() throws Exception {
        // Create User
        User user = new User();
        user.setEmail("t@test.fr");
        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "test@test.fr", "John",
                "Doe", false, "password");
        // mock security context and set it
        SecurityContext securityContext = mock(SecurityContext.class);
        SecurityContextHolder.setContext(securityContext);
        when(securityContext.getAuthentication()).thenReturn(new UsernamePasswordAuthenticationToken(userDetails, null));

        // Stub userRepository.findById reutrn user
        when(userRepository.findById(Long.parseLong(id))).thenReturn(Optional.of(user));

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/user/{id}", id))
                .andExpect(MockMvcResultMatchers.status().isUnauthorized());

        // Verify the response
        verify(userRepository).findById(Long.parseLong(id));
    }

    @Test
    @DisplayName("Return bad request status")
    void giveIDUser_thenFindUserById_shouldReturnBadRequestStatus() throws Exception {
        // Stub userRepository.findById and return error
        when(userRepository.findById(Long.parseLong(id))).thenThrow(NumberFormatException.class);

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/user/{id}", id))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());

        // Verify the response
        verify(userRepository).findById(Long.parseLong(id));
    }
}
