package com.openclassrooms.starterjwt.services;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.when;

@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class TeacherServiceTest {
    @Mock
    private TeacherRepository teacherRepository;

    @InjectMocks
    private TeacherService teacherService;

    private final long id = 1L;

    @BeforeEach
    public void setup() {
        teacherService = new TeacherService(teacherRepository);
    }

    @Test
    @DisplayName("should find all teacher")
    public void giveVoid_thenFindAllTeacher_shouldReturnAllTeacher() {
        List<Teacher> teacher = new ArrayList<>();
        when(teacherRepository.findAll()).thenReturn(teacher);

        List<Teacher> newTeacher = teacherService.findAll();

        Mockito.verify(teacherRepository).findAll();
        assertEquals(teacher, newTeacher);
    }

    @Test
    @DisplayName("should find teacher by ID")
    public void giveIDTeacher_thenFindTeachByID_shouldATeacherByID() {
        Teacher teacher = new Teacher();
        when(teacherRepository.findById(id)).thenReturn(Optional.of(teacher));

        Teacher newTeacher = teacherService.findById(id);

        Mockito.verify(teacherRepository).findById(id);
        assertEquals(teacher, newTeacher);
    }

    @Test
    @DisplayName("should return empty teacher")
    public void giveIDTeacher_thenFindUserById_shouldReturnEmpty() {
        when(teacherRepository.findById(id)).thenReturn(Optional.empty());

        Teacher newTeacher = teacherService.findById(id);

        Mockito.verify(teacherRepository).findById(id);
        assertNull(newTeacher);
    }
}