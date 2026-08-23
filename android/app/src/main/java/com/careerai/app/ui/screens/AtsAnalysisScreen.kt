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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.careerai.app.data.api.ApiClient
import com.careerai.app.data.model.AtsAnalysisRequest
import com.careerai.app.data.model.AtsAnalysisResponse
import com.careerai.app.data.storage.SecureTokenManager
import com.careerai.app.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun AtsAnalysisScreen(
    tokenManager: SecureTokenManager,
    onBack: () -> Unit
) {
    var resumeText by remember { mutableStateOf("Senior Full Stack Developer with 4 years experience building React, Node.js, Express, and PostgreSQL microservices.") }
    var jobDescription by remember { mutableStateOf("Looking for a developer skilled in React, Node.js, PostgreSQL, Docker, and AWS.") }
    var analysisResult by remember { mutableStateOf<AtsAnalysisResponse?>(null) }
    var isLoading by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
            .padding(16.dp)
            .verticalScroll(rememberScrollState())
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBack) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = PrimarySky)
            }
            Text("Resume ATS Analysis", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextBright)
        }

        Spacer(modifier = Modifier.height(16.dp))

        OutlinedTextField(
            value = resumeText,
            onValueChange = { resumeText = it },
            label = { Text("Resume Content Text", color = TextMuted) },
            minLines = 4,
            maxLines = 6,
            modifier = Modifier.fillMaxWidth(),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = PrimarySky,
                unfocusedBorderColor = TextMuted,
                focusedTextColor = TextBright,
                unfocusedTextColor = TextBright
            )
        )

        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(
            value = jobDescription,
            onValueChange = { jobDescription = it },
            label = { Text("Target Job Description (Optional)", color = TextMuted) },
            minLines = 3,
            maxLines = 4,
            modifier = Modifier.fillMaxWidth(),
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = PrimarySky,
                unfocusedBorderColor = TextMuted,
                focusedTextColor = TextBright,
                unfocusedTextColor = TextBright
            )
        )

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = {
                scope.launch {
                    isLoading = true
                    errorMessage = ""
                    try {
                        val api = ApiClient.getApiService(tokenManager)
                        val res = api.analyzeResumeText(AtsAnalysisRequest(resumeText, jobDescription))
                        if (res.isSuccessful && res.body() != null) {
                            analysisResult = res.body()
                        } else {
                            errorMessage = "Analysis failed: ${res.code()}"
                        }
                    } catch (e: Exception) {
                        errorMessage = "Error: ${e.localizedMessage}"
                    } finally {
                        isLoading = false
                    }
                }
            },
            modifier = Modifier.fillMaxWidth().height(48.dp),
            colors = ButtonDefaults.buttonColors(containerColor = AccentBlue),
            enabled = !isLoading
        ) {
            if (isLoading) {
                CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
            } else {
                Text("Analyze Resume ATS Score", fontWeight = FontWeight.Bold)
            }
        }

        if (errorMessage.isNotEmpty()) {
            Spacer(modifier = Modifier.height(12.dp))
            Text(errorMessage, color = ErrorRed, fontSize = 13.sp)
        }

        analysisResult?.let { result ->
            Spacer(modifier = Modifier.height(24.dp))
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = CardDark),
                shape = RoundedCornerShape(12.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("ATS Match Score", fontWeight = FontWeight.Bold, color = TextBright)
                        Text(
                            "${result.score}%",
                            fontSize = 24.sp,
                            fontWeight = FontWeight.ExtraBold,
                            color = if (result.score >= 75) SuccessGreen else WarningYellow
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Text("Missing Keywords:", fontWeight = FontWeight.SemiBold, color = TextMuted, fontSize = 13.sp)
                    Text(
                        result.missingKeywords?.joinToString(", ") ?: "None",
                        color = WarningYellow,
                        fontSize = 13.sp
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Text("Recommendations:", fontWeight = FontWeight.SemiBold, color = TextMuted, fontSize = 13.sp)
                    result.recommendations?.forEach { rec ->
                        Text("• $rec", color = TextBright, fontSize = 12.sp, modifier = Modifier.padding(vertical = 2.dp))
                    }
                }
            }
        }
    }
}
