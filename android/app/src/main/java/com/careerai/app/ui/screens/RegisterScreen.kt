package com.careerai.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.careerai.app.data.api.ApiClient
import com.careerai.app.data.model.AuthResponse
import com.careerai.app.data.model.RegisterRequest
import com.careerai.app.data.storage.SecureTokenManager
import com.careerai.app.ui.theme.*
import com.google.gson.Gson
import kotlinx.coroutines.launch

@Composable
fun RegisterScreen(
    tokenManager: SecureTokenManager,
    onRegisterSuccess: () -> Unit,
    onNavigateToLogin: () -> Unit
) {
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
            .padding(16.dp),
        contentAlignment = Alignment.Center
    ) {
        Card(
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = CardDark),
            elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text("Create Account", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = PrimarySky)
                Text("ARJ", fontSize = 13.sp, color = TextMuted, modifier = Modifier.padding(bottom = 20.dp))

                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Full Name") },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(
                        capitalization = KeyboardCapitalization.Words,
                        keyboardType = KeyboardType.Text,
                        imeAction = ImeAction.Next
                    ),
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PrimarySky,
                        unfocusedBorderColor = TextMuted,
                        focusedLabelColor = PrimarySky,
                        unfocusedLabelColor = TextMuted,
                        focusedTextColor = TextBright,
                        unfocusedTextColor = TextBright,
                        cursorColor = PrimarySky
                    )
                )

                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Email Address") },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.Email,
                        imeAction = ImeAction.Next
                    ),
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PrimarySky,
                        unfocusedBorderColor = TextMuted,
                        focusedLabelColor = PrimarySky,
                        unfocusedLabelColor = TextMuted,
                        focusedTextColor = TextBright,
                        unfocusedTextColor = TextBright,
                        cursorColor = PrimarySky
                    )
                )

                Spacer(modifier = Modifier.height(12.dp))

                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text("Password (min 6 chars)") },
                    visualTransformation = PasswordVisualTransformation(),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.Password,
                        imeAction = ImeAction.Done
                    ),
                    modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PrimarySky,
                        unfocusedBorderColor = TextMuted,
                        focusedLabelColor = PrimarySky,
                        unfocusedLabelColor = TextMuted,
                        focusedTextColor = TextBright,
                        unfocusedTextColor = TextBright,
                        cursorColor = PrimarySky
                    )
                )

                if (errorMessage.isNotEmpty()) {
                    Spacer(modifier = Modifier.height(10.dp))
                    Text(errorMessage, color = ErrorRed, fontSize = 13.sp)
                }

                Spacer(modifier = Modifier.height(20.dp))

                Button(
                    onClick = {
                        val cleanName = name.trim()
                        val cleanEmail = email.trim()
                        val cleanPassword = password.trim()

                        if (cleanEmail.isEmpty()) {
                            errorMessage = "Please enter an email address"
                            return@Button
                        }
                        if (cleanPassword.length < 6) {
                            errorMessage = "Password must be at least 6 characters long"
                            return@Button
                        }

                        scope.launch {
                            isLoading = true
                            errorMessage = ""
                            try {
                                val api = ApiClient.getApiService(tokenManager)
                                val res = api.register(RegisterRequest(cleanName, cleanEmail, cleanPassword))
                                if (res.isSuccessful && res.body()?.token != null) {
                                    val body = res.body()!!
                                    tokenManager.saveToken(body.token!!)
                                    tokenManager.saveUserRole(body.user?.role ?: "candidate")
                                    onRegisterSuccess()
                                } else {
                                    val errBody = res.errorBody()?.string()
                                    val parsedMsg = try {
                                        Gson().fromJson(errBody, AuthResponse::class.java)?.message
                                    } catch (_: Exception) { null }
                                    errorMessage = parsedMsg ?: res.body()?.message ?: "Registration failed (${res.code()})"
                                }
                            } catch (e: Exception) {
                                errorMessage = "Network error: ${e.localizedMessage}. Ensure server is running."
                            } finally {
                                isLoading = false
                            }
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp),
                    shape = RoundedCornerShape(8.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = AccentBlue),
                    enabled = !isLoading
                ) {
                    if (isLoading) CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
                    else Text("Create Account", fontWeight = FontWeight.Bold, color = Color.White)
                }

                Spacer(modifier = Modifier.height(16.dp))
                TextButton(onClick = onNavigateToLogin) {
                    Text("Already have an account? Sign In", color = PrimarySky, fontSize = 13.sp)
                }
            }
        }
    }
}
