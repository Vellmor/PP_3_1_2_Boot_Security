package ru.kata.spring.boot_security.demo.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.io.File;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class UserRestController {

    private final UserService userService;

    @Autowired
    public UserRestController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> apiGetAllUsers() {
        List<User> users = userService.allUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<User> apiGetOneUser(@PathVariable("id") int id) {
        User user = userService.get(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/users")
    public ResponseEntity<?> apiAddNewUser(
            @RequestBody User user,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            getErrorsFromBindingResult(bindingResult);
            return ResponseEntity.badRequest().body("Incorrect request");
        }
        try {
            User savedUser = userService.add(user);
            return ResponseEntity.ok(savedUser);
        } catch (UsernameNotFoundException ex) {
            return ResponseEntity.badRequest().body("User already exists");
        }
    }

    @PatchMapping("/users/{id}")
    public ResponseEntity<?> apiUpdateUser(
            @PathVariable("id") int id,
            @RequestBody User user,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasErrors()) {
            String error = getErrorsFromBindingResult(bindingResult);
            return ResponseEntity.badRequest().body(error);
        }
        userService.update(id, user);
        return ResponseEntity.ok("User was updated");
    }

    @DeleteMapping("users/{id}")
    public ResponseEntity<String> apiDeleteUser(
            @PathVariable("id") int id
    ) {
        userService.delete(id);
        return ResponseEntity.ok("User was deleted");
    }

    private String getErrorsFromBindingResult(BindingResult bindingResult) {
        return bindingResult.getFieldErrors()
                .stream()
                .map(x -> x.getDefaultMessage())
                .collect(Collectors.joining("; "));
    }

}
