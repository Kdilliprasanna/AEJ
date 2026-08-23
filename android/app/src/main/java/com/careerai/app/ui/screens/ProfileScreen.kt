package com.careerai.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.careerai.app.data.api.ApiClient
import com.careerai.app.data.model.Profile
import com.careerai.app.data.storage.SecureTokenManager
import com.careerai.app.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun ProfileScreen(
    tokenManager: SecureTokenManager,
    onBack: () -> Unit,
    onLogout: () -> Unit
) {
    var profile by remember { mutableStateOf<Profile?>(null) }
    var targetRole by remember { mutableStateOf("") }
    var name by remember { mutableStateOf("") }
    var phone by remember { mutableStateOf("") }
    var skills by remember { mutableStateOf("") }
    var summary by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(true) }
    var isSaving by remember { mutableStateOf(false) }
    var message by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        try {
            val api = ApiClient.getApiService(tokenManager)
            val res = api.getProfile()
            if (res.isSuccessful) {
                val p = res.body()?.get("profile")
                profile = p
                name = p?.name ?: ""
                phone = p?.phone ?: ""
                targetRole = p?.targetRole ?: ""
                skills = p?.skills?.joinToString(", ") ?: ""
                summary = p?.summary ?: ""
            }
        } catch (_: Exception) {}
        isLoading = false
    }

    Column(
        modifier = Modifier.fillMaxSize().background(BgDark).padding(16.dp).verticalScroll(rememberScrollState())
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = PrimarySky) }
            Icon(Icons.Default.Person, contentDescription = null, tint = PrimarySky, modifier = Modifier.size(22.dp))
            Spacer(modifier = Modifier.width(8.dp))
            Text("My Profile", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextBright)
        }
        Spacer(modifier = Modifier.height(16.dp))

        if (isLoading) {
            Box(Modifier.fillMaxWidth().height(200.dp), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = PrimarySky)
            }
        } else {
            Card(Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp), colors = CardDefaults.cardColors(containerColor = CardDark)) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    ProfileField("Full Name", name) { name = it }
                    ProfileField("Phone Number", phone) { phone = it }
                    ProfileField("Target Role", targetRole) { targetRole = it }
                    ProfileField("Skills (comma separated)", skills) { skills = it }
                    ProfileField("Professional Summary", summary, minLines = 3) { summary = it }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            if (message.isNotEmpty()) Text(message, color = SuccessGreen, fontSize = 13.sp, modifier = Modifier.padding(bottom = 8.dp))

            Button(
                onClick = {
                    scope.launch {
                        isSaving = true; message = ""
                        try {
                            val api = ApiClient.getApiService(tokenManager)
                            val updated = Profile(
                                name = name, phone = phone, targetRole = targetRole,
                                skills = skills.split(",").map { it.trim() }.filter { it.isNotEmpty() },
                                summary = summary
                            )
                            val res = api.updateProfile(updated)
                            message = if (res.isSuccessful) "✅ Profile updated successfully!" else "Update failed: ${res.code()}"
                        } catch (e: Exception) { message = "Error: ${e.localizedMessage}" }
                        isSaving = false
                    }
                },
                modifier = Modifier.fillMaxWidth().height(48.dp),
                colors = ButtonDefaults.buttonColors(containerColor = AccentBlue),
                enabled = !isSaving
            ) {
                if (isSaving) CircularProgressIndicator(color = Color.White, modifier = Modifier.size(22.dp))
                else Text("Save Profile", fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(24.dp))

            OutlinedButton(
                onClick = {
                    tokenManager.clearSession()
                    onLogout()
                },
                modifier = Modifier.fillMaxWidth(),
                border = ButtonDefaults.outlinedButtonBorder.copy(),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = ErrorRed)
            ) {
                Text("Sign Out", fontWeight = FontWeight.Bold, color = ErrorRed)
            }
        }
    }
}

@Composable
private fun ProfileField(label: String, value: String, minLines: Int = 1, onChange: (String) -> Unit) {
    OutlinedTextField(
        value = value, onValueChange = onChange,
        label = { Text(label, color = TextMuted) },
        minLines = minLines,
        modifier = Modifier.fillMaxWidth(),
        colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = PrimarySky, unfocusedBorderColor = TextMuted, focusedTextColor = TextBright, unfocusedTextColor = TextBright)
    )
}
