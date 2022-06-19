package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.RoleServise;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.security.Principal;

@Controller
public class AppController {

    private final UserService userService;
    private final RoleServise roleServise;

    @Autowired
    public AppController(UserService userService, RoleServise roleServise) {
        this.userService = userService;
        this.roleServise = roleServise;
    }

    @GetMapping("/admin")
    public String admin(@ModelAttribute("user") User user, Model model, Principal principal) {
        model.addAttribute("users", userService.listUsers());
        model.addAttribute("thisUser", userService.getByEmail(principal.getName()));
        model.addAttribute("roles", roleServise.listRoles());
        return "admin/admin";
    }

    @GetMapping("/user")
    public String user(@ModelAttribute("user") User user, Model model, Principal principal) {
        model.addAttribute("thisUser", userService.getByEmail(principal.getName()));
        return "user/user";
    }

    @PostMapping("/admin")
    public String create(@ModelAttribute("user") User user) {
        int id = userService.add(user).getId();
        return "redirect:/admin";
    }

    @PatchMapping("/admin/{id}")
    public String update(@ModelAttribute("user") User user, @PathVariable("id") int id) {
        userService.update(id, user);
        return "redirect:/admin";
    }

    @DeleteMapping("/admin/{id}")
    public String delete(@PathVariable("id") int id) {
        userService.delete(id);
        return "redirect:/admin";
    }
}
