-- This script is run for the 'test' profile after schema creation by Hibernate (ddl-auto=create-drop)
-- Ensures the event authority user exists for tests.

-- IMPORTANT: Replace 'BCRYPT_ENCODED_ADMIN_PASSWORD_PLACEHOLDER' 
-- with the actual BCrypt hash of the password 'Admin@123'.

INSERT INTO USERS (first_name, last_name, email, password, role, auth_provider)
VALUES ('Event', 'Authority', 'eventauthority@charusat.ac.in', '$2a$10$VsRN2p5E087ZxJqvmW4nO.4o.vj1.jmxfDusRBbjHtOmrWsFL.0wS', 'EVENT_AUTHORITY', 'LOCAL'); 