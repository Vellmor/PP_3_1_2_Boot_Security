package ru.kata.spring.boot_security.demo.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.repositories.UserRepository;

import java.util.List;
import java.util.Set;

@Service
@Transactional
public class UserServiceImp implements UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserServiceImp(UserRepository userDao) {
        this.userRepository = userDao;
    }

    @Override
    public User add(User user) {
        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        if (userRepository.findByEmail(user.getEmail()) == null) {
            return userRepository.save(user);
        }
        throw new UsernameNotFoundException(String.format("User with email %s already exists.", user.getEmail()));
    }

    @Override
    public List<User> allUsers() {
        return (List<User>) userRepository.findAll();
    }

    @Override
    public User get(int id) {
        return userRepository.findById(id).get();
    }

    @Override
    public User getByEmail(String name) {
        return userRepository.findByEmail(name);
    }

    @Override
    public void update(int id, User updatedUser) {
        User user = userRepository.findById(id).get();
        updatedUser.setPassword(updatedUser.getPassword() == null ? user.getPassword() : new BCryptPasswordEncoder().encode(updatedUser.getPassword()));
        user.update(updatedUser);
        userRepository.save(user);
    }

    @Override
    public void delete(int id) {
        User user = userRepository.findById(id).get();
        userRepository.delete(user);
    }

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username);
        if (user == null) {
            throw new UsernameNotFoundException(String.format("User %s not found", username));
        }
        return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), user.getAuthorities());
    }
}
