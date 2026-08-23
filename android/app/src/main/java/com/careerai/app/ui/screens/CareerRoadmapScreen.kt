package com.careerai.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.careerai.app.data.api.ApiClient
import com.careerai.app.data.model.RoadmapRequest
import com.careerai.app.data.model.RoadmapWeek
import com.careerai.app.data.storage.SecureTokenManager
import com.careerai.app.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun CareerRoadmapScreen(
    tokenManager: SecureTokenManager,
    onBack: () -> Unit
) {
    var targetRole by remember { mutableStateOf("Full Stack Developer") }
    var currentSkills by remember { mutableStateOf("") }
    var roadmapWeeks by remember { mutableStateOf<List<RoadmapWeek>>(emptyList()) }
    var isLoading by remember { mutableStateOf(false) }
    var errorMsg by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()

    Column(Modifier.fillMaxSize().background(BgDark).padding(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = PrimarySky) }
            Text("AI Career Roadmap", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextBright)
        }
        Spacer(Modifier.height(16.dp))

        if (roadmapWeeks.isEmpty()) {
            Column(Modifier.verticalScroll(rememberScrollState())) {
                Card(Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp), colors = CardDefaults.cardColors(containerColor = CardDark)) {
                    Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        Text("Generate Your Career Roadmap", fontWeight = FontWeight.Bold, color = TextBright, fontSize = 16.sp)
                        OutlinedTextField(value = targetRole, onValueChange = { targetRole = it }, label = { Text("Target Role", color = TextMuted) }, singleLine = true, modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = PrimarySky, unfocusedBorderColor = TextMuted, focusedTextColor = TextBright, unfocusedTextColor = TextBright))
                        OutlinedTextField(value = currentSkills, onValueChange = { currentSkills = it }, label = { Text("Current Skills (comma separated)", color = TextMuted) }, minLines = 2, modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = PrimarySky, unfocusedBorderColor = TextMuted, focusedTextColor = TextBright, unfocusedTextColor = TextBright))
                    }
                }

                if (errorMsg.isNotEmpty()) { Spacer(Modifier.height(8.dp)); Text(errorMsg, color = ErrorRed, fontSize = 13.sp) }

                Spacer(Modifier.height(16.dp))
                Button(
                    onClick = {
                        scope.launch {
                            isLoading = true; errorMsg = ""
                            try {
                                val res = ApiClient.getApiService(tokenManager).generateCareerRoadmap(RoadmapRequest(targetRole, currentSkills))
                                if (res.isSuccessful) {
                                    roadmapWeeks = res.body()?.roadmap ?: emptyList()
                                    if (roadmapWeeks.isEmpty()) errorMsg = "No roadmap generated. Try a different role."
                                } else errorMsg = "Generation failed: ${res.code()}"
                            } catch (e: Exception) { errorMsg = "Error: ${e.localizedMessage}" }
                            isLoading = false
                        }
                    },
                    modifier = Modifier.fillMaxWidth().height(50.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = AccentBlue), enabled = !isLoading
                ) {
                    if (isLoading) CircularProgressIndicator(color = Color.White, modifier = Modifier.size(22.dp))
                    else Text("🗺️ Generate My Roadmap", fontWeight = FontWeight.Bold)
                }
            }
        } else {
            Button(
                onClick = { roadmapWeeks = emptyList() },
                modifier = Modifier.fillMaxWidth().height(42.dp).padding(bottom = 12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = CardDark)
            ) { Text("← Generate New Roadmap", color = PrimarySky, fontSize = 13.sp) }

            Text("Roadmap for: $targetRole", fontWeight = FontWeight.Bold, color = PrimarySky, fontSize = 16.sp, modifier = Modifier.padding(bottom = 12.dp))

            LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                itemsIndexed(roadmapWeeks) { _, week ->
                    Card(Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp), colors = CardDefaults.cardColors(containerColor = CardDark)) {
                        Column(Modifier.padding(16.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(Icons.Default.Star, contentDescription = null, tint = WarningYellow, modifier = Modifier.size(18.dp))
                                Spacer(Modifier.width(8.dp))
                                Text("Week ${week.week}: ${week.title}", fontWeight = FontWeight.Bold, color = TextBright, fontSize = 15.sp)
                            }
                            Spacer(Modifier.height(8.dp))
                            week.tasks?.forEach { task -> Text("• $task", color = TextBright, fontSize = 13.sp, modifier = Modifier.padding(vertical = 2.dp)) }
                            week.resources?.takeIf { it.isNotEmpty() }?.let { resources ->
                                Spacer(Modifier.height(6.dp))
                                Text("Resources:", color = TextMuted, fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                                resources.forEach { r -> Text("→ $r", color = PrimarySky, fontSize = 12.sp) }
                            }
                        }
                    }
                }
            }
        }
    }
}
