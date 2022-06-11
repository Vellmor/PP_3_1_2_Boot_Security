INSERT INTO users (first_name, last_name, age, email, password)
VALUES
    ('admin', 'admin', 35, 'admin@mail.ru', '$2a$12$O6j9dTG5sFbps8V3PaZ6deWegTQ.n1AI92BuTOlh0Y8jWLvvME7Wm'),
    ('user', 'user', 20, 'user@mail.ru', '$2a$12$2q2ouhQzbpPWzY1/3P5xMeShkJhpM5kQ.wUnqAzKsDRbb01sEQp7G');

INSERT INTO roles (role_name)
VALUES
    ('ROLE_ADMIN'),
    ('ROLE_USER');

INSERT INTO user_role (user_id, role_id)
VALUES
    (1, 1),
    (2, 2)