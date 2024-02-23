package com.openclassrooms.starterjwt.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.services.SessionService;
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
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class SessionControllerTest {

    @Autowired
    private SessionMapper sessionMapper;

    @Autowired
    private SessionService sessionService;

    @Mock
    private SessionRepository sessionRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionController sessionController;

    private MockMvc mockMvc;

    private final String id = "1";

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp(){
        sessionService = new SessionService(sessionRepository, userRepository);
        sessionController = new SessionController(sessionService, sessionMapper);
        mockMvc = MockMvcBuilders.standaloneSetup(sessionController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    @DisplayName("Return a session")
    void giveIDSession_thenFindSessionById_shouldReturnASession() throws Exception {
    	// Create session
        Session session = new Session();
        session.setName("Yoga");
        // Stub
        when(sessionRepository.findById(Long.parseLong(id))).thenReturn(Optional.of(session));

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.get("/api/session/{id}", id))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType("application/json"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value("Yoga"));

        // Verify the response
        verify(sessionRepository).findById(Long.parseLong(id));

    }

    @Test
    @DisplayName("Return not found status")
    void giveIDSession_thenFindSessionById_shouldNotFoundStatus() throws Exception {
        // Stub
        when(sessionRepository.findById(Long.parseLong(id))).thenReturn(Optional.empty());

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.get("/api/session/{id}", id))
                .andExpect(MockMvcResultMatchers.status().isNotFound());

        // Verify the response
        verify(sessionRepository).findById(Long.parseLong(id));
    }

    @Test
    @DisplayName("should return bad request's status")
    void giveIDSession_thenFindSessionById_shouldBadRequestStatus() throws Exception {
        // Stub
        when(sessionRepository.findById(Long.parseLong(id))).thenThrow(NumberFormatException.class);

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.get("/api/session/{id}", id))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());

        // Verify the response
        verify(sessionRepository).findById(Long.parseLong(id));
    }

    @Test
    @DisplayName("Return all session")
    void giveIDSession_thenFindSessionById_shouldReturnAllSession() throws Exception {
        
        List<Session> sessions = List.of(
        		new Session().setName("Yoga"),
                new Session().setName("Crossfit")
		);

        // Stub
        when(sessionRepository.findAll()).thenReturn(sessions);

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.get("/api/session"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$[0].name").value("Yoga"))
                .andExpect(MockMvcResultMatchers.jsonPath("$[1].name").value("Crossfit"));

        // Verify the response
        verify(sessionRepository).findAll();
    }

    // @Test
    @DisplayName("Create a session")
    void giveIDSession_thenFindSessionById_shouldCreateSession() throws Exception {
        // Create sessionDto
        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("Test");
        sessionDto.setDate(new Date());
        sessionDto.setDescription("Description session");
        sessionDto.setTeacher_id(1L);
        Session session = sessionMapper.toEntity(sessionDto);
        ObjectMapper objectMapper = new ObjectMapper();
        // Stub
        when(sessionRepository.save(session)).thenReturn(session);

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.post("/api/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value(session.getName()))
                .andExpect(MockMvcResultMatchers.jsonPath("$.description").value(session.getDescription()));

        // Verify the response
        verify(sessionRepository).save(session);
    }

 // @Test
    @DisplayName("Update a session")
    void giveIDSession_thenFindSessionById_shouldUpdateSession() throws Exception {
        // Create sessionDto
        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("Yoga");
        sessionDto.setDate(new Date());
        sessionDto.setDescription("Description session");
        sessionDto.setTeacher_id(1L);
        sessionDto.setId(Long.parseLong(id));

        Session session = sessionMapper.toEntity(sessionDto);

        // Stub
        when(sessionRepository.save(session)).thenReturn(session);

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.put("/api/session/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(id)
                        .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.jsonPath("$.name").value(sessionDto.getName()));

        // Verify the response
        verify(sessionRepository).save(session);
    }

 // @Test
    @DisplayName("Update session and return bad request's status")
    void giveIDSession_thenUpdateSession_shouldBadRequestStatus() throws Exception{
        // Create session
        Session session;
        // Create sessionDto
        SessionDto sessionDto = new SessionDto();
        sessionDto.setName("Yoga");
        sessionDto.setDate(new Date());
        sessionDto.setDescription("Description session");
        sessionDto.setTeacher_id(1L);
        sessionDto.setId(Long.parseLong(id));

        session = sessionMapper.toEntity(sessionDto);

        // Stub
        when(sessionRepository.save(session)).thenThrow(NumberFormatException.class);

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.put("/api/session/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(id)
                        .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());

        // Verify the response
        verify(sessionRepository).save(session);
    }

    @Test
    @DisplayName("Delete a session")
    void giveIDSession_thenFindSessionById_shouldDeleteSession() throws Exception {
        // Create session
        Session session = new Session();

        // Stub
        when(sessionRepository.findById(Long.parseLong(id))).thenReturn(Optional.of(session));

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/{id}", id))
                .andExpect(MockMvcResultMatchers.status().isOk());

        // Verify the response
        verify(sessionRepository).findById(Long.parseLong(id));

    }

    @Test
    @DisplayName("Delete session and return not found status")
    void giveIDSession_thenFindSessionById_shouldReturnNotFoundStatus() throws Exception {
        // Stub
        when(sessionRepository.findById(Long.parseLong(id))).thenReturn(Optional.empty());

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/{id}", id))
                .andExpect(MockMvcResultMatchers.status().isNotFound());

        // Verify the response
        verify(sessionRepository).findById(Long.parseLong(id));
    }

    @Test
    @DisplayName("Delete session and return bad request's status")
    void giveIDSession_thenFindSessionById_shouldReturnBadRequestStatus() throws Exception {
        // Stub
        when(sessionRepository.findById(Long.parseLong(id))).thenThrow(NumberFormatException.class);

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/{id}", id))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());

        // Verify the response
        verify(sessionRepository).findById(Long.parseLong(id));
    }

    @Test
    @DisplayName("Participate to session")
    void giveIDSession_thenUserParticipateToASession_shouldParticipate() throws Exception {
        // Create session and user
        Session session = new Session();
        User user = new User();
        session.setId(Long.parseLong(id));
        session.setUsers(new ArrayList<>());

        // Stub
        when(sessionRepository.findById(Long.parseLong(id))).thenReturn(Optional.of(session));
        when(userRepository.findById(Long.parseLong(id))).thenReturn(Optional.of(user));

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.post("/api/session/{id}/participate/{userId}", id, id))
                .andExpect(MockMvcResultMatchers.status().isOk());

        // Verify the response
        verify(sessionRepository).findById(Long.parseLong(id));
        verify(userRepository).findById(Long.parseLong(id));
        assert(session.getUsers().contains(user));
    }

    @Test
    @DisplayName("Participate to session but return bad request's status")
    void giveIDSession_thenUserParticipateToASession_shouldReturnBadRequestStatus() throws Exception {
        // Stub
        when(sessionRepository.findById(Long.parseLong(id))).thenThrow(NumberFormatException.class);

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.post("/api/session/{id}/participate/{userId}", id, id))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());

        // Verify the response
        verify(sessionRepository).findById(Long.parseLong(id));
    }

    @Test
    @DisplayName("Unparticipate to session but return bad request's status")
    void giveIDSession_thenUserUnparticipateToASession_shouldReturnBadRequestStatus() throws Exception {
        // Stub
        when(sessionRepository.findById(Long.parseLong(id))).thenThrow(NumberFormatException.class);

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/{id}/participate/{userId}", id, id))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());

        // Verify the response
        verify(sessionRepository).findById(Long.parseLong(id));
    }


    @Test
    @DisplayName("Unparticipate to session")
    void giveIDSession_thenUserUnparticipateToASession_shouldUnParticipate() throws Exception {
        // Create session and user
        Session session = new Session();
        User user = new User();
        user.setId(Long.parseLong(id));
        session.setId(Long.parseLong(id));
        // Add user to session
        session.setUsers(List.of(user));
        // Stub
        when(sessionRepository.findById(Long.parseLong(id))).thenReturn(Optional.of(session));

        // Perform request
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/session/{id}/participate/{userId}", id, id))
                .andExpect(MockMvcResultMatchers.status().isOk());

        // Verify the response
        verify(sessionRepository).findById(Long.parseLong(id));

        assert(!session.getUsers().contains(user));
    }
}
