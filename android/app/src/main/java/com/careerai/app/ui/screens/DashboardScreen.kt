package com.careerai.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.Chat
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.careerai.app.data.storage.SecureTokenManager
import com.careerai.app.ui.theme.*

@Composable
fun DashboardScreen(
    tokenManager: SecureTokenManager,
    onNavigate: (String) -> Unit,
    onLogout: () -> Unit
) {
    val userRole = tokenManager.getUserRole()

    Column(Modifier.fillMaxSize().background(BgDark).padding(16.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text("ARJ", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = PrimarySky)
                Text("Android Workspace ($userRole)", fontSize = 12.sp, color = TextMuted)
            }
            Row {
                IconButton(onClick = { onNavigate("notifications") }) {
                    Icon(Icons.Default.Notifications, contentDescription = "Notifications", tint = TextMuted)
                }
                IconButton(onClick = { onNavigate("profile") }) {
                    Icon(Icons.Default.Person, contentDescription = "Profile", tint = TextMuted)
                }
            }
        }

        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item { FeatureTile("AI Copilot", "Job match & skills gap", Icons.Default.AutoAwesome, PrimarySky) { onNavigate("copilot") } }
            item { FeatureTile("Live Interviewer", "AI-powered STAR practice", Icons.Default.RecordVoiceOver, WarningYellow) { onNavigate("liveInterview") } }
            item { FeatureTile("Mock Interview", "Daily interview test", Icons.Default.Quiz, AccentBlue) { onNavigate("mockInterview") } }
            item { FeatureTile("Resume ATS Lab", "Score & gap analysis", Icons.Default.Description, SuccessGreen) { onNavigate("ats") } }
            item { FeatureTile("Cover Letter AI", "Generate & save letters", Icons.Default.Mail, PrimarySky) { onNavigate("coverLetter") } }
            item { FeatureTile("Career Roadmap", "Step-by-step plan", Icons.Default.Map, WarningYellow) { onNavigate("roadmap") } }
            item { FeatureTile("Job Discovery", "Real jobs + save & track", Icons.Default.Work, SuccessGreen) { onNavigate("jobs") } }
            item { FeatureTile("Applications", "Track your applications", Icons.Default.TableChart, AccentBlue) { onNavigate("applications") } }
            item { FeatureTile("AI Career Coach", "Personal chat advisor", Icons.AutoMirrored.Filled.Chat, PrimarySky) { onNavigate("chat") } }
            if (userRole == "university_admin" || userRole == "platform_admin") {
                item { FeatureTile("University Analytics", "Cohort insights (admin)", Icons.Default.Analytics, ErrorRed) { onNavigate("admin") } }
            }
        }
    }
}

@Composable
fun FeatureTile(
    title: String,
    subtitle: String,
    icon: ImageVector,
    accentColor: Color,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth().height(120.dp).clickable { onClick() },
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = CardDark)
    ) {
        Column(Modifier.padding(14.dp).fillMaxSize(), verticalArrangement = Arrangement.SpaceBetween) {
            Icon(imageVector = icon, contentDescription = title, tint = accentColor, modifier = Modifier.size(26.dp))
            Column {
                Text(title, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = TextBright)
                Text(subtitle, fontSize = 10.sp, color = TextMuted, maxLines = 2)
            }
        }
    }
}
