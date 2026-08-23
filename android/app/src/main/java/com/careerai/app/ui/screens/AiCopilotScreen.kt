package com.careerai.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.text.AnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.careerai.app.data.api.ApiClient
import com.careerai.app.data.model.CopilotRequest
import com.careerai.app.data.model.CopilotResponse
import com.careerai.app.data.storage.SecureTokenManager
import com.careerai.app.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun AiCopilotScreen(
    tokenManager: SecureTokenManager,
    onBack: () -> Unit
) {
    var jobTitle by remember { mutableStateOf("") }
    var company by remember { mutableStateOf("") }
    var jobDesc by remember { mutableStateOf("") }
    var result by remember { mutableStateOf<CopilotResponse?>(null) }
    var isLoading by remember { mutableStateOf(false) }
    var errorMsg by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()
    val clipboard = LocalClipboardManager.current

    Column(Modifier.fillMaxSize().background(BgDark).padding(16.dp).verticalScroll(rememberScrollState())) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = PrimarySky) }
            Text("AI Job Copilot", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextBright)
        }
        Spacer(Modifier.height(8.dp))
        Text("Paste a job posting and get an instant ATS match, skill gap analysis, resume tips, and a cover letter draft.", color = TextMuted, fontSize = 13.sp)
        Spacer(Modifier.height(16.dp))

        Card(Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp), colors = CardDefaults.cardColors(containerColor = CardDark)) {
            Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                listOf(
                    Triple("Job Title", jobTitle) { v: String -> jobTitle = v },
                    Triple("Company Name", company) { v: String -> company = v }
                ).forEach { (label, value, setter) ->
                    OutlinedTextField(value = value, onValueChange = setter, label = { Text(label, color = TextMuted) }, singleLine = true, modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = PrimarySky, unfocusedBorderColor = TextMuted, focusedTextColor = TextBright, unfocusedTextColor = TextBright))
                }
                OutlinedTextField(value = jobDesc, onValueChange = { jobDesc = it }, label = { Text("Job Description", color = TextMuted) }, minLines = 4, modifier = Modifier.fillMaxWidth(),
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
                        val res = ApiClient.getApiService(tokenManager).analyzeJobWithCopilot(CopilotRequest(jobTitle, company, jobDesc))
                        if (res.isSuccessful) result = res.body() else errorMsg = "Analysis failed: ${res.code()}"
                    } catch (e: Exception) { errorMsg = "Error: ${e.localizedMessage}" }
                    isLoading = false
                }
            },
            modifier = Modifier.fillMaxWidth().height(50.dp),
            colors = ButtonDefaults.buttonColors(containerColor = AccentBlue), enabled = !isLoading
        ) {
            if (isLoading) CircularProgressIndicator(color = Color.White, modifier = Modifier.size(22.dp))
            else Text("🚀 Run AI Copilot Analysis", fontWeight = FontWeight.Bold)
        }

        result?.let { r ->
            Spacer(Modifier.height(20.dp))
            Card(Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp), colors = CardDefaults.cardColors(containerColor = CardDark)) {
                Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                        Text("ATS Match Score", fontWeight = FontWeight.Bold, color = TextBright)
                        Text("${r.matchScore ?: 0}%", fontSize = 26.sp, fontWeight = FontWeight.ExtraBold, color = if ((r.matchScore ?: 0) >= 70) SuccessGreen else WarningYellow)
                    }
                    r.analysis?.missingSkills?.takeIf { it.isNotEmpty() }?.let {
                        Text("Missing Skills:", color = TextMuted, fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                        Text(it.joinToString(", "), color = WarningYellow, fontSize = 13.sp)
                    }
                    r.analysis?.resumeSuggestions?.takeIf { it.isNotEmpty() }?.let {
                        Text("Resume Tips:", color = TextMuted, fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                        it.forEach { s -> Text("• $s", color = TextBright, fontSize = 12.sp) }
                    }
                    r.coverLetterDraft?.let { draft ->
                        Text("Cover Letter Draft:", color = TextMuted, fontWeight = FontWeight.SemiBold, fontSize = 13.sp)
                        Text(draft, color = TextBright, fontSize = 12.sp)
                        TextButton(onClick = { clipboard.setText(AnnotatedString(draft)) }) { Text("📋 Copy Cover Letter", color = PrimarySky) }
                    }
                }
            }
        }
    }
}
