package fr.wcs.Quizz4all.controllers;

import fr.wcs.Quizz4all.persistence.entities.User;
import fr.wcs.Quizz4all.persistence.repositories.UserRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/")
public class UserController {
    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }


    private final UserRepository userRepository;

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PostMapping("/users")
    public User createUser(@RequestBody User user) {

        return userRepository.save(user);
    }
}

