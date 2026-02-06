package com.sinapselab.mobile.data.models

import kotlinx.serialization.Serializable

/**
 * Exemplo de modelo de dados
 * Ajuste conforme os modelos do seu backend Django
 */
@Serializable
data class User(
    val id: Int,
    val username: String,
    val email: String
)

@Serializable
data class LoginRequest(
    val username: String,
    val password: String
)

@Serializable
data class LoginResponse(
    val token: String,
    val user: User
)
