package com.careerai.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.careerai.app.data.api.ApiClient
import com.careerai.app.data.model.AuthResponse
import com.careerai.app.data.model.LoginRequest
import com.careerai.app.data.storage.SecureTokenManager
import com.careerai.app.ui.theme.*
import com.google.gson.Gson
import kotlinx.coroutines.launch

@Composable
fun LoginScreen(
    tokenManager: SecureTokenManager,
    onLoginSuccess: () -> Unit,
    onNavigateToRegister: () -> Unit = {}
) {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()

    // Server URL Dialog state
    var showServerDialog by remember { mutableStateOf(false) }
    var serverUrlInput by remember { mutableStateOf(ApiClient.getBaseUrl()) }

    // Server URL configuration dialog — critical for physical device
    if (showServerDialog) {
        AlertDialog(
            onDismissRequest = { showServerDialog = false },
            containerColor = CardDark,
            title = { Text("Server URL", color = TextBright, fontWeight = FontWeight.Bold) },
            text = {
                Column {
                    Text(
                        "Enter your PC's local IP address.\n" +
                        "• Emulator:  http://10.0.2.2:4000/api/\n" +
                        "• USB/WiFi:  http://192.168.x.x:4000/api/",
                        color = TextMuted, fontSize = 12.sp
                    )
                    Spacer(Modifier.height(12.dp))
                    OutlinedTextField(
                        value = serverUrlInput,
                        onValueChange = { serverUrlInput = it },
                        label = { Text("Base URL", color = TextMuted) },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(
                            focusedBorderColor = PrimarySky,
                            unfocusedBorderColor = TextMuted,
                            focusedTextColor = TextBright,
                            unfocusedTextColor = TextBright,
                            cursorColor = PrimarySky
                        )
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val url = serverUrlInput.trim()
                        if (url.isNotEmpty()) {
                            ApiClient.setBaseUrl(url)
                            errorMessage = ""
                        }
                        showServerDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = AccentBlue)
                ) { Text("Save", color = Color.White) }
            },
            dismissButton = {
                TextButton(onClick = {
                    serverUrlInput = ApiClient.getBaseUrl()
                    showServerDialog = false
                }) { Text("Cancel", color = TextMuted) }
            }
        )
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
            .padding(16.dp),
        contentAlignment = Alignment.Center
    ) {
        // Settings icon (top-right corner)
        IconButton(
            onClick = {
                serverUrlInput = ApiClient.getBaseUrl()
                showServerDialog = true
            },
            modifier = Modifier.align(Alignment.TopEnd)
        ) {
            Icon(Icons.Default.Settings, contentDescription = "Server Settings", tint = TextMuted)
        }

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
                Text(
                    text = "ARJ",
                    fontSize = 28.sp,
                    fontWeight = FontWeight.Bold,
                    color = PrimarySky
                )
                Text(
                    text = "Career AI — Mobile",
                    fontSize = 12.sp,
                    color = TextMuted,
                    modifier = Modifier.padding(bottom = 4.dp)
                )
                Text(
                    text = ApiClient.getBaseUrl(),
                    fontSize = 10.sp,
                    color = TextMuted.copy(alpha = 0.6f),
                    modifier = Modifier.padding(bottom = 20.dp)
                )

                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Email Address") },
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.Email,
                        imeAction = ImeAction.Next
                    ),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PrimarySky,
                        unfocusedBorderColor = TextMuted,
                        focusedLabelColor = PrimarySky,
                        unfocusedLabelColor = TextMuted,
                        focusedTextColor = TextBright,
                        unfocusedTextColor = TextBright,
                        cursorColor = PrimarySky
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                Spacer(modifier = Modifier.height(14.dp))

                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = { Text("Password") },
                    visualTransformation = PasswordVisualTransformation(),
                    singleLine = true,
                    keyboardOptions = KeyboardOptions(
                        keyboardType = KeyboardType.Password,
                        imeAction = ImeAction.Done
                    ),
                    colors = OutlinedTextFieldDefaults.colors(
                        focusedBorderColor = PrimarySky,
                        unfocusedBorderColor = TextMuted,
                        focusedLabelColor = PrimarySky,
                        unfocusedLabelColor = TextMuted,
                        focusedTextColor = TextBright,
                        unfocusedTextColor = TextBright,
                        cursorColor = PrimarySky
                    ),
                    modifier = Modifier.fillMaxWidth()
                )

                if (errorMessage.isNotEmpty()) {
                    Spacer(modifier = Modifier.height(12.dp))
                    Text(
                        text = errorMessage,
                        color = ErrorRed,
                        fontSize = 13.sp
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))

                Button(
                    onClick = {
                        val cleanEmail = email.trim()
                        val cleanPassword = password.trim()

                        if (cleanEmail.isEmpty() || cleanPassword.isEmpty()) {
                            errorMessage = "Please enter both email and password"
                            return@Button
                        }

                        scope.launch {
                            isLoading = true
                            errorMessage = ""
                            try {
                                val api = ApiClient.getApiService(tokenManager)
                                val response = api.login(LoginRequest(cleanEmail, cleanPassword))
                                if (response.isSuccessful && response.body()?.token != null) {
                                    val body = response.body()!!
                                    tokenManager.saveToken(body.token!!)
                                    tokenManager.saveUserRole(body.user?.role ?: "candidate")
                                    onLoginSuccess()
                                } else {
                                    val errBody = response.errorBody()?.string()
                                    val parsedMsg = try {
                                        Gson().fromJson(errBody, AuthResponse::class.java)?.message
                                    } catch (_: Exception) { null }
                                    errorMessage = parsedMsg ?: response.body()?.message ?: "Wrong email or password"
                                }
                            } catch (e: Exception) {
                                errorMessage = "Cannot reach server at:\n${ApiClient.getBaseUrl()}\n\nTap ⚙ to change server address."
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
                    if (isLoading) {
                        CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
                    } else {
                        Text("Sign In", fontWeight = FontWeight.Bold, color = Color.White)
                    }
                }

                Spacer(modifier = Modifier.height(16.dp))
                TextButton(onClick = onNavigateToRegister) {
                    Text("Don't have an account? Create one", color = PrimarySky, fontSize = 13.sp)
                }
            }
        }
    }
}
