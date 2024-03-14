package com.wcs.server.DataTest;

import com.wcs.server.entity.User;
import com.wcs.server.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;

import com.wcs.server.configuration.ApplicationTestConfig;
import org.springframework.dao.DataIntegrityViolationException;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@DataJpaTest
@Import(ApplicationTestConfig.class)
class UserEntityTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void testSaveNewUser() {
        User user = new User();
        user.setUsername("testUser");
        user.setEmail("testUser@example.com");
        user.setPassword("securePassword");

        User savedUser = userRepository.save(user);

        assertThat(savedUser).isNotNull();
        assertThat(savedUser.getId()).isNotNull();
        assertThat(savedUser.getUsername()).isEqualTo("testUser");
        assertThat(savedUser.getEmail()).isEqualTo("testUser@example.com");
    }

    @Test
    void testUserNameShouldBeUnique() {
        User user1 = new User();
        user1.setUsername("uniqueUser");
        user1.setEmail("user1@example.com");
        user1.setPassword("securePassword1");
        userRepository.save(user1);

        User user2 = new User();
        user2.setUsername("uniqueUser");
        user2.setEmail("user2@example.com");
        user2.setPassword("securePassword2");

        // Une exception devrait être levée car le nom d'utilisateur n'est pas unique.
        assertThrows(DataIntegrityViolationException.class, () -> {
            userRepository.saveAndFlush(user2);
        });
    }

    @Test
    void testEmailShouldBeUnique() {
        User user1 = new User();
        user1.setUsername("user1");
        user1.setEmail("sameEmail@example.com");
        user1.setPassword("securePassword1");
        userRepository.save(user1);

        User user2 = new User();
        user2.setUsername("user2");
        user2.setEmail("sameEmail@example.com");
        user2.setPassword("securePassword2");

        // Une exception devrait être levée car l'email n'est pas unique.
        assertThrows(DataIntegrityViolationException.class, () -> {
            userRepository.saveAndFlush(user2);
        });
    }

    @Test
    void testFindByUsername() {
        String username = "testFindByUsername";
        User user = new User();
        user.setUsername(username);
        user.setEmail("findByUsername@example.com");
        user.setPassword("securePassword");
        userRepository.save(user);

        Optional<User> foundUser = Optional.ofNullable(userRepository.findByUsername(username));

        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getUsername()).isEqualTo(username);
    }
}