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
import com.careerai.app.data.model.CoverLetterItem
import com.careerai.app.data.model.CoverLetterRequest
import com.careerai.app.data.storage.SecureTokenManager
import com.careerai.app.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun CoverLetterScreen(
    tokenManager: SecureTokenManager,
    onBack: () -> Unit
) {
    var targetRole by remember { mutableStateOf("") }
    var company by remember { mutableStateOf("") }
    var jobDesc by remember { mutableStateOf("") }
    var resumeSummary by remember { mutableStateOf("") }
    var generatedLetter by remember { mutableStateOf<CoverLetterItem?>(null) }
    var savedLetters by remember { mutableStateOf<List<CoverLetterItem>>(emptyList()) }
    var isGenerating by remember { mutableStateOf(false) }
    var isLoadingList by remember { mutableStateOf(true) }
    var errorMsg by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()
    val clipboard = LocalClipboardManager.current

    LaunchedEffect(Unit) {
        try {
            val res = ApiClient.getApiService(tokenManager).getCoverLetters()
            savedLetters = res.body()?.coverLetters ?: emptyList()
        } catch (_: Exception) {}
        isLoadingList = false
    }

    Column(Modifier.fillMaxSize().background(BgDark).padding(16.dp).verticalScroll(rememberScrollState())) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = PrimarySky) }
            Text("AI Cover Letter Generator", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextBright)
        }
        Spacer(Modifier.height(16.dp))

        Card(Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp), colors = CardDefaults.cardColors(containerColor = CardDark)) {
            Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Text("Generate New Cover Letter", fontWeight = FontWeight.Bold, color = TextBright, fontSize = 16.sp)
                for ((label, value, setter) in listOf(
                    Triple("Target Role", targetRole, { v: String -> targetRole = v }),
                    Triple("Company Name", company, { v: String -> company = v })
                )) {
                    OutlinedTextField(value = value, onValueChange = setter, label = { Text(label, color = TextMuted) }, singleLine = true, modifier = Modifier.fillMaxWidth(),
                        colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = PrimarySky, unfocusedBorderColor = TextMuted, focusedTextColor = TextBright, unfocusedTextColor = TextBright))
                }
                OutlinedTextField(value = jobDesc, onValueChange = { jobDesc = it }, label = { Text("Job Description", color = TextMuted) }, minLines = 3, modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = PrimarySky, unfocusedBorderColor = TextMuted, focusedTextColor = TextBright, unfocusedTextColor = TextBright))
                OutlinedTextField(value = resumeSummary, onValueChange = { resumeSummary = it }, label = { Text("Resume Summary (optional)", color = TextMuted) }, minLines = 2, modifier = Modifier.fillMaxWidth(),
                    colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = PrimarySky, unfocusedBorderColor = TextMuted, focusedTextColor = TextBright, unfocusedTextColor = TextBright))
            }
        }

        if (errorMsg.isNotEmpty()) { Spacer(Modifier.height(8.dp)); Text(errorMsg, color = ErrorRed, fontSize = 13.sp) }

        Spacer(Modifier.height(16.dp))
        Button(
            onClick = {
                scope.launch {
                    isGenerating = true; errorMsg = ""
                    try {
                        val res = ApiClient.getApiService(tokenManager).generateCoverLetter(CoverLetterRequest(targetRole, company, jobDesc, resumeSummary))
                        if (res.isSuccessful) {
                            generatedLetter = res.body()?.coverLetter
                            // Refresh list
                            val listRes = ApiClient.getApiService(tokenManager).getCoverLetters()
                            savedLetters = listRes.body()?.coverLetters ?: emptyList()
                        } else errorMsg = "Generation failed: ${res.code()}"
                    } catch (e: Exception) { errorMsg = "Error: ${e.localizedMessage}" }
                    isGenerating = false
                }
            },
            modifier = Modifier.fillMaxWidth().height(50.dp),
            colors = ButtonDefaults.buttonColors(containerColor = AccentBlue), enabled = !isGenerating
        ) {
            if (isGenerating) CircularProgressIndicator(color = Color.White, modifier = Modifier.size(22.dp))
            else Text("✨ Generate Cover Letter", fontWeight = FontWeight.Bold)
        }

        generatedLetter?.let { letter ->
            Spacer(Modifier.height(20.dp))
            Card(Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp), colors = CardDefaults.cardColors(containerColor = CardDark)) {
                Column(Modifier.padding(16.dp)) {
                    Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween, verticalAlignment = Alignment.CenterVertically) {
                        Text("Generated Letter", fontWeight = FontWeight.Bold, color = PrimarySky)
                        TextButton(onClick = { clipboard.setText(AnnotatedString(letter.content)) }) { Text("📋 Copy", color = PrimarySky) }
                    }
                    Spacer(Modifier.height(8.dp))
                    Text(letter.content, color = TextBright, fontSize = 13.sp, lineHeight = 20.sp)
                }
            }
        }

        if (savedLetters.isNotEmpty()) {
            Spacer(Modifier.height(24.dp))
            Text("Saved Cover Letters", fontWeight = FontWeight.Bold, color = TextBright, fontSize = 16.sp)
            Spacer(Modifier.height(8.dp))
            savedLetters.forEach { letter ->
                Card(Modifier.fillMaxWidth().padding(bottom = 10.dp), shape = RoundedCornerShape(10.dp), colors = CardDefaults.cardColors(containerColor = CardDark)) {
                    Column(Modifier.padding(14.dp)) {
                        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Column {
                                Text(letter.targetRole, fontWeight = FontWeight.Bold, color = TextBright)
                                Text(letter.company, color = TextMuted, fontSize = 12.sp)
                            }
                            TextButton(onClick = { clipboard.setText(AnnotatedString(letter.content)) }) { Text("Copy", color = PrimarySky, fontSize = 12.sp) }
                        }
                    }
                }
            }
        }
    }
}
