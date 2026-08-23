package com.careerai.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.careerai.app.data.api.ApiClient
import com.careerai.app.data.model.ApplicationItem
import com.careerai.app.data.storage.SecureTokenManager
import com.careerai.app.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun ApplicationTrackerScreen(
    tokenManager: SecureTokenManager,
    onBack: () -> Unit
) {
    var applications by remember { mutableStateOf<List<ApplicationItem>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var statusMsg by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()

    fun load() {
        scope.launch {
            isLoading = true
            try {
                val res = ApiClient.getApiService(tokenManager).getApplications()
                applications = res.body()?.applications ?: emptyList()
            } catch (e: Exception) { statusMsg = "Error: ${e.localizedMessage}" }
            isLoading = false
        }
    }

    LaunchedEffect(Unit) { load() }

    Column(Modifier.fillMaxSize().background(BgDark).padding(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
            IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = PrimarySky) }
            Text("Application Tracker", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextBright, modifier = Modifier.weight(1f))
            IconButton(onClick = { load() }) { Icon(Icons.Default.Refresh, contentDescription = "Refresh", tint = PrimarySky) }
        }

        if (statusMsg.isNotEmpty()) Text(statusMsg, color = WarningYellow, fontSize = 12.sp)

        Spacer(modifier = Modifier.height(12.dp))

        if (isLoading) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { CircularProgressIndicator(color = PrimarySky) }
        } else if (applications.isEmpty()) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("No applications tracked yet", color = TextMuted, fontSize = 16.sp)
                    Text("Save jobs from the Job Discovery screen", color = TextMuted, fontSize = 12.sp)
                }
            }
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                items(applications) { app ->
                    Card(Modifier.fillMaxWidth(), shape = RoundedCornerShape(10.dp), colors = CardDefaults.cardColors(containerColor = CardDark)) {
                        Row(Modifier.padding(16.dp).fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                            Column(Modifier.weight(1f)) {
                                Text(app.jobTitle ?: "Unknown Role", fontWeight = FontWeight.Bold, color = TextBright, fontSize = 16.sp)
                                Text(app.company ?: "Unknown Company", color = TextMuted, fontSize = 13.sp)
                                app.appliedAt?.let { Text("Applied: $it", color = TextMuted, fontSize = 11.sp) }
                            }
                            val statusColor = when (app.status?.lowercase()) {
                                "interview", "shortlisted" -> SuccessGreen
                                "rejected" -> ErrorRed
                                "offered" -> PrimarySky
                                else -> WarningYellow
                            }
                            Surface(shape = RoundedCornerShape(6.dp), color = statusColor.copy(alpha = 0.15f)) {
                                Text(app.status ?: "Applied", color = statusColor, fontSize = 12.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp))
                            }
                        }
                    }
                }
            }
        }
    }
}
