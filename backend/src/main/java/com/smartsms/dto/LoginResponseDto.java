package com.smartsms.dto;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDto {
    private String token;

    @Builder.Default
    private String type = "Bearer";

    private Long id;
    private String name;
    private String email;
    private String role;
}