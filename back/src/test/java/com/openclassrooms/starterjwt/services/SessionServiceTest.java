package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.exception.BadRequestException;
import com.openclassrooms.starterjwt.exception.NotFoundException;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.SessionRepository;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class SessionServiceTest {

    @Mock
    private SessionRepository sessionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SessionService sessionService;

    private final long id = 1L;
    private final long sessionId = 1L;

    @BeforeEach
    public void setup() {
        sessionService = new SessionService(sessionRepository, userRepository);
    }

    @Test
    @DisplayName("should create a session")
    public void createSession_shouldASession() {

        Session session = new Session();
        when(sessionRepository.save(session)).thenReturn(session);

        Session newSession = sessionService.create(session);

        Mockito.verify(sessionRepository).save(session);
        assertEquals(session, newSession);
    }

    @Test
    @DisplayName("should delete a session by ID")
    public void deleteSessionByID_shouldDeleteASession() {
        sessionService.delete(id);

        Mockito.verify(sessionRepository).deleteById(id);
    }

    @Test
    @DisplayName("should get all a session")
    public void getAllSession_shouldGetAllSession() {
        List<Session> session = new ArrayList<>();
        when(sessionRepository.findAll()).thenReturn(session);

        List<Session> allSession = sessionService.findAll();

        Mockito.verify(sessionRepository).findAll();
        assertEquals(session, allSession);
    }

    @Test
    @DisplayName("should get a session by ID")
    public void getSessionByID_shouldGetASession() {
        Session session = new Session();
        when(sessionRepository.findById(id)).thenReturn(Optional.of(session));

        Session newSession = sessionService.getById(id);

        Mockito.verify(sessionRepository).findById(id);
        assertEquals(session, newSession);
    }

    @Test
    @DisplayName("should update a session")
    public void updateSession_shouldUpdateASession() {
        Session session = new Session();
        when(sessionRepository.save(session)).thenReturn(session);

        Session newSession = sessionService.update(id, session);

        Mockito.verify(sessionRepository).save(session);
        assertEquals(session.getId(), newSession.getId());
    }

    @Test
    @DisplayName("should participate to a session")
    public void giveIDSessionAndIDUser_thenUserParticipateToASession_shouldParticipateSession() {
        Session session = new Session();
        User user = new User();

        session.setId(sessionId);
        session.setUsers(new ArrayList<>());
        user.setId(id);
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(sessionId)).thenReturn(Optional.of(user));

        sessionService.participate(sessionId, id);

        assert(session.getUsers().contains(user));
    }

    @Test
    @DisplayName("should not found session")
    public void giveIDSession_thenUserParticipateToASession_shouldNotFoundSession() {
        when(sessionRepository.findById(sessionId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.participate(sessionId, id));
    }

    @Test
    @DisplayName("should not found user")
    public void giveIDSessionAndIDUser_thenUserParticipateSession_shouldNotFoundUser() {
        Session session = new Session();

        session.setId(sessionId);

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.participate(sessionId, id));
    }

    @Test
    @DisplayName("should already participate to a session")
    public void giveIDSessionAndIDUser_thenUserParticipateToASession_shouldAlreadyParticipate() {
        Session session = new Session();
        User user = new User();

        session.setId(sessionId);
        user.setId(id);
        List<User> users = List.of(user);
        session.setUsers(users);

        when(sessionRepository.findById(sessionId)).thenReturn(Optional.of(session));
        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        assertThrows(BadRequestException.class, () -> sessionService.participate(sessionId, id));
    }

    @Test
    @DisplayName("should Unparticipate but return NotFoundException ")
    public void giveIDSessionAndIDUser_thenUserUnParticipateToASession_shouldThrowNotFoundException() {
        when(sessionRepository.findById(id)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> sessionService.noLongerParticipate(sessionId, id));
    }

    @Test
    @DisplayName("should Unparticipate but return BadRequestException ")
    public void giveIDSessionAndIDUser_thenUserUnParticipateToASession_shouldBadRequestException() {
        Session session = new Session();
        session.setUsers(new ArrayList<>());

        when(sessionRepository.findById(id)).thenReturn(Optional.of(session));

        assertThrows(BadRequestException.class, () -> sessionService.noLongerParticipate(sessionId, id));
    }

    @Test
    @DisplayName("should Unpartcipate to a session ")
    public void giveIDSessionAndIDUser_thenUserUnParticipateToASession_shouldUnParticipate() {
        Session session = new Session();
        User user = new User();
        user.setId(id);
        session.setId(id);
        session.setUsers(new ArrayList<>());
        session.getUsers().add(user);

        when(sessionRepository.findById(id)).thenReturn(Optional.of(session));

        sessionService.noLongerParticipate(sessionId, id);

        assertFalse(session.getUsers().contains(user));
    }
}
