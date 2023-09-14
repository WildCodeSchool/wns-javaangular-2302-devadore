package com.wcs.server.controller.auth;

import com.wcs.server.entity.User;
import com.wcs.server.entity.UserRegistrationRequest;
import com.wcs.server.errormessage.EmailAlreadyTakenException;
import com.wcs.server.errormessage.UsernameAlreadyTakenException;
import com.wcs.server.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

@RestController
@RequestMapping("/auth")
public class RegistrationController {

    @Autowired
    private UserService userService;

    @GetMapping("/checkUsername")
    public ResponseEntity<Boolean> checkUsernameExistence(@RequestParam String username) {
        boolean exists = userService.checkUsernameExistence(username);
        return ResponseEntity.ok(exists);
    }

    @GetMapping("/checkMailExist")
    public ResponseEntity<Boolean> checkMailExistence(@RequestParam String email) {
        boolean exists = userService.checkMailExistence(email);
        return ResponseEntity.ok(exists);
    }

    @PostMapping("/register")
    public ResponseEntity<String> registerUser(MultipartHttpServletRequest request) {
        try {
            String username = request.getParameter("username");
            String password = request.getParameter("password");
            String email = request.getParameter("email");
            MultipartFile image = request.getFile("image");
            String mimeType = request.getParameter("mimeType");


            byte[] imageData = null;
            if (image != null && !image.isEmpty()) {
                imageData = image.getBytes();
            }


            UserRegistrationRequest registrationRequest = new UserRegistrationRequest();
            registrationRequest.setUsername(username);
            registrationRequest.setPassword(password);
            registrationRequest.setEmail(email);
            registrationRequest.setImage(imageData);
            registrationRequest.setMimeType(mimeType);

            User registeredUser = userService.registerUser(registrationRequest);
            if (registeredUser != null) {
                return ResponseEntity.ok().body("{\"message\": \"User registered successfully\"}");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"message\": \"User registration failed\"}");
            }
        } catch (UsernameAlreadyTakenException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"message\": \"Username is already taken\"}");
        } catch (EmailAlreadyTakenException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"message\": \"Eamil is already taken\"}");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"message\": \"An error occurred during registration\"}");
        }
    }
}
