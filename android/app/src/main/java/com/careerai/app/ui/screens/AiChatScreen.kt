package com.careerai.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.Send
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.careerai.app.data.api.ApiClient
import com.careerai.app.data.model.ChatMessage
import com.careerai.app.data.model.ChatRequest
import com.careerai.app.data.storage.SecureTokenManager
import com.careerai.app.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun AiChatScreen(
    tokenManager: SecureTokenManager,
    onBack: () -> Unit
) {
    data class UiMessage(val role: String, val content: String)

    var messages by remember { mutableStateOf(listOf(UiMessage("assistant", "👋 Hi! I'm your AI Career Coach. Ask me anything about your career, resume, interviews, or job search strategy!"))) }
    var inputText by remember { mutableStateOf("") }
    var isSending by remember { mutableStateOf(false) }
    val scope = rememberCoroutineScope()
    val listState = rememberLazyListState()

    Column(Modifier.fillMaxSize().background(BgDark)) {
        Row(Modifier.fillMaxWidth().padding(horizontal = 8.dp, vertical = 8.dp), verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = PrimarySky) }
            Column {
                Text("AI Career Coach", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = TextBright)
                Text("Powered by Career AI", fontSize = 11.sp, color = TextMuted)
            }
        }

        HorizontalDivider(color = CardDark, thickness = 1.dp)

        LazyColumn(
            state = listState,
            modifier = Modifier.weight(1f).padding(horizontal = 16.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(messages) { msg ->
                val isUser = msg.role == "user"
                Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = if (isUser) Arrangement.End else Arrangement.Start) {
                    Surface(
                        shape = RoundedCornerShape(
                            topStart = 12.dp, topEnd = 12.dp,
                            bottomStart = if (isUser) 12.dp else 4.dp,
                            bottomEnd = if (isUser) 4.dp else 12.dp
                        ),
                        color = if (isUser) AccentBlue else CardDark,
                        modifier = Modifier.widthIn(max = 300.dp)
                    ) {
                        Text(
                            msg.content, color = TextBright, fontSize = 14.sp,
                            modifier = Modifier.padding(12.dp), lineHeight = 20.sp
                        )
                    }
                }
            }
        }

        LaunchedEffect(messages.size) { if (messages.isNotEmpty()) listState.animateScrollToItem(messages.size - 1) }

        HorizontalDivider(color = CardDark, thickness = 1.dp)

        Row(Modifier.fillMaxWidth().padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
            OutlinedTextField(
                value = inputText, onValueChange = { inputText = it },
                placeholder = { Text("Ask your career question...", color = TextMuted, fontSize = 13.sp) },
                singleLine = false, maxLines = 3,
                modifier = Modifier.weight(1f),
                colors = OutlinedTextFieldDefaults.colors(focusedBorderColor = PrimarySky, unfocusedBorderColor = TextMuted, focusedTextColor = TextBright, unfocusedTextColor = TextBright)
            )
            Spacer(Modifier.width(8.dp))
            IconButton(
                onClick = {
                    if (inputText.isBlank()) return@IconButton
                    val userMsg = inputText.trim()
                    inputText = ""
                    val updatedMessages = messages + UiMessage("user", userMsg)
                    messages = updatedMessages
                    scope.launch {
                        isSending = true
                        try {
                            val history = updatedMessages.dropLast(1).takeLast(10).map { ChatMessage(it.role, it.content) }
                            val res = ApiClient.getApiService(tokenManager).sendChatMessage(ChatRequest(userMsg, history))
                            val reply = res.body()?.reply ?: res.body()?.message ?: "I'm here to help! Could you rephrase your question?"
                            messages = messages + UiMessage("assistant", reply)
                        } catch (e: Exception) {
                            messages = messages + UiMessage("assistant", "⚠️ Network issue: ${e.localizedMessage}")
                        }
                        isSending = false
                    }
                },
                modifier = Modifier.size(50.dp).background(if (isSending) CardDark else AccentBlue, RoundedCornerShape(8.dp)),
                enabled = !isSending
            ) {
                if (isSending) CircularProgressIndicator(color = PrimarySky, modifier = Modifier.size(22.dp))
                else Icon(Icons.AutoMirrored.Filled.Send, contentDescription = "Send", tint = Color.White)
            }
        }
    }
}
