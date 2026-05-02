package com.smartsms.dto;

import com.smartsms.entity.Role;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private Boolean active;
}