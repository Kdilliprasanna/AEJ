package com.careerai.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
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
import com.careerai.app.data.model.MockQuestion
import com.careerai.app.data.model.SubmitMockTestRequest
import com.careerai.app.data.storage.SecureTokenManager
import com.careerai.app.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun MockInterviewScreen(
    tokenManager: SecureTokenManager,
    onBack: () -> Unit
) {
    var questions by remember { mutableStateOf<List<MockQuestion>>(emptyList()) }
    var answers by remember { mutableStateOf<Map<String, String>>(emptyMap()) }
    var score by remember { mutableStateOf<Int?>(null) }
    var grade by remember { mutableStateOf<String?>(null) }
    var isLoadingQ by remember { mutableStateOf(true) }
    var isSubmitting by remember { mutableStateOf(false) }
    var errorMsg by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()

    fun loadQuestions() {
        scope.launch {
            isLoadingQ = true; score = null; grade = null; answers = emptyMap(); errorMsg = ""
            try {
                val res = ApiClient.getApiService(tokenManager).getMockQuestions()
                questions = res.body()?.questions ?: emptyList()
            } catch (e: Exception) { errorMsg = "Failed to load: ${e.localizedMessage}" }
            isLoadingQ = false
        }
    }

    LaunchedEffect(Unit) { loadQuestions() }

    Column(Modifier.fillMaxSize().background(BgDark).padding(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
            IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = PrimarySky) }
            Text("Daily Mock Interview", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextBright, modifier = Modifier.weight(1f))
            IconButton(onClick = { loadQuestions() }) { Icon(Icons.Default.Refresh, contentDescription = "Refresh", tint = PrimarySky) }
        }

        if (errorMsg.isNotEmpty()) { Text(errorMsg, color = ErrorRed, fontSize = 13.sp) }

        if (isLoadingQ) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { CircularProgressIndicator(color = PrimarySky) }
        } else {
            score?.let { s ->
                Card(Modifier.fillMaxWidth().padding(bottom = 16.dp), shape = RoundedCornerShape(12.dp), colors = CardDefaults.cardColors(containerColor = CardDark)) {
                    Column(Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = SuccessGreen, modifier = Modifier.size(40.dp))
                        Spacer(Modifier.height(8.dp))
                        Text("Score: $s%", fontSize = 28.sp, fontWeight = FontWeight.ExtraBold, color = if (s >= 70) SuccessGreen else WarningYellow)
                        grade?.let { Text("Grade: $it", color = TextMuted, fontSize = 16.sp) }
                        Spacer(Modifier.height(12.dp))
                        TextButton(onClick = { loadQuestions() }) { Text("Try Another Set", color = PrimarySky) }
                    }
                }
            }

            LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                itemsIndexed(questions) { idx, q ->
                    Card(Modifier.fillMaxWidth(), shape = RoundedCornerShape(12.dp), colors = CardDefaults.cardColors(containerColor = CardDark)) {
                        Column(Modifier.padding(14.dp)) {
                            Row { 
                                Surface(shape = RoundedCornerShape(4.dp), color = AccentBlue.copy(alpha = 0.2f)) {
                                    Text("Q${idx + 1}", color = PrimarySky, fontSize = 12.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(horizontal = 8.dp, vertical = 3.dp))
                                }
                                Spacer(Modifier.width(8.dp))
                                q.category?.let { Text(it, color = TextMuted, fontSize = 11.sp, modifier = Modifier.align(Alignment.CenterVertically)) }
                            }
                            Spacer(Modifier.height(8.dp))
                            Text(q.question, color = TextBright, fontSize = 14.sp, fontWeight = FontWeight.Medium)
                            q.hint?.let { Spacer(Modifier.height(4.dp)); Text("Hint: $it", color = TextMuted, fontSize = 11.sp) }
                            Spacer(Modifier.height(10.dp))
                            OutlinedTextField(
                                value = answers[q.id] ?: "",
                                onValueChange = { answers = answers + (q.id to it) },
                                label = { Text("Your Answer", color = TextMuted) },
                                minLines = 2, modifier = Modifier.fillMaxWidth(),
                                colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = PrimarySky, unfocusedBorderColor = TextMuted, focusedTextColor = TextBright, unfocusedTextColor = TextBright)
                            )
                        }
                    }
                }

                if (questions.isNotEmpty() && score == null) {
                    item {
                        Spacer(Modifier.height(8.dp))
                        Button(
                            onClick = {
                                scope.launch {
                                    isSubmitting = true
                                    try {
                                        val questionsList = questions.map { mapOf("id" to it.id, "question" to it.question) }
                                        val res = ApiClient.getApiService(tokenManager).submitMockTest(SubmitMockTestRequest(questionsList, answers))
                                        score = res.body()?.score
                                        grade = res.body()?.grade
                                    } catch (e: Exception) { errorMsg = "Submit error: ${e.localizedMessage}" }
                                    isSubmitting = false
                                }
                            },
                            modifier = Modifier.fillMaxWidth().height(50.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = AccentBlue), enabled = !isSubmitting
                        ) {
                            if (isSubmitting) CircularProgressIndicator(color = Color.White, modifier = Modifier.size(22.dp))
                            else Text("Submit Test", fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}
