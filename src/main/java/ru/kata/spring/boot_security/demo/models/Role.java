package ru.kata.spring.boot_security.demo.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "roles")
@Getter
@Setter
@RequiredArgsConstructor
public class Role implements GrantedAuthority {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "role_name")
    private String roleName;

    @ManyToMany(
            mappedBy = "roles",
            cascade = CascadeType.ALL
    )
    @JsonIgnore
    private List<User> users;

    @Override
    public String getAuthority() {
        return this.roleName;
    }
}
