
package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.payload.request.LoginRequest;
import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Optional;

import static org.mockito.Mockito.*;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class AuthControllerTests {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private Authentication authentication;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthController authController;

    @Mock
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    private SignupRequest signupRequest;
    
    // Helper method to create UserDetailsImpl object
    private UserDetailsImpl createUserDetails(String email, String firstName, String lastName, boolean isAdmin, String password) {
        return new UserDetailsImpl(1L, email, firstName, lastName, isAdmin, password);
    }

    // Helper method to create Authentication Token
    private UsernamePasswordAuthenticationToken createAuthenticationToken(String email, String password) {
        return new UsernamePasswordAuthenticationToken(email, password);
    }

    @BeforeEach
    void setUp(){
        authController = new AuthController(authenticationManager, passwordEncoder, jwtUtils, userRepository);
        mockMvc = MockMvcBuilders.standaloneSetup(authController).build();
        objectMapper = new ObjectMapper();
        signupRequest = new SignupRequest();
        signupRequest.setEmail("test@test.fr");
        signupRequest.setLastName("lastName");
        signupRequest.setFirstName("firstName");
        signupRequest.setPassword("password");
    }

    @Test
    @DisplayName("Login with valid credentials")
    void givenValidLoginRequest_thenAuthenticate_shouldLogin() throws Exception {
    	// Create login request
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@test.fr");
        loginRequest.setPassword("test");
        User user = new User();
        user.setEmail("test@test.fr");
        user.setAdmin(false);

        // Create UserDetailsImpl object
        UserDetailsImpl userDetails = createUserDetails("test@test.fr", "John", "Doe", false, "password");
        // Create Authentication Token
        UsernamePasswordAuthenticationToken authenticationToken = createAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword());

        when(authenticationManager.authenticate(authenticationToken)).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(userRepository.findByEmail(userDetails.getUsername())).thenReturn(Optional.of(user));

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.token").exists());

        // Verify the response
        verify(userRepository).findByEmail(userDetails.getUsername());
    }

    @Test
    @DisplayName("Register with existing email should return bad request")
    void givenExistingEmailSignupRequest_thenRegister_shouldReturnBadRequest() throws Exception{
    	// Create a message response
        MessageResponse messageResponse = new MessageResponse("Error: Email is already taken!");

        when(userRepository.existsByEmail(signupRequest.getEmail())).thenReturn(true);
        
        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.message").value(messageResponse.getMessage()));

        // Verify the response
        verify(userRepository).existsByEmail(signupRequest.getEmail());
    }

    @Test
    @DisplayName("Register with new email should register successfully")
    void givenNewEmailSignupRequest_thenRegister_shouldRegister() throws Exception{
    	// Create a message response
        MessageResponse messageResponse = new MessageResponse("User registered successfully!");

        when(userRepository.existsByEmail(signupRequest.getEmail())).thenReturn(false);

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.message")
                        .value(messageResponse.getMessage()));

        // Verify the response
        verify(userRepository).existsByEmail(signupRequest.getEmail());
        verify(userRepository).save(new User());
    }

}