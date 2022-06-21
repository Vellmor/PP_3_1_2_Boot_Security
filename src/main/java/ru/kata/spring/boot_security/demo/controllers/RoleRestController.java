package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.RoleServise;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api")
public class RoleRestController {

    private final RoleServise roleServise;

    @Autowired
    public RoleRestController(RoleServise roleService, RoleServise roleServise) {
        this.roleServise = roleServise;
    }

    @GetMapping("/roles")
    public ResponseEntity<List<Role>> apiGetAllRoles() {
        List<Role> roles = roleServise.listRoles();
        return new ResponseEntity<>(roles, HttpStatus.OK);
    }

}
