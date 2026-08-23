package com.careerai.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.NotificationsNone
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.careerai.app.data.api.ApiClient
import com.careerai.app.data.model.NotificationItem
import com.careerai.app.data.storage.SecureTokenManager
import com.careerai.app.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun NotificationsScreen(
    tokenManager: SecureTokenManager,
    onBack: () -> Unit
) {
    var notifications by remember { mutableStateOf<List<NotificationItem>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    val scope = rememberCoroutineScope()

    fun load() {
        scope.launch {
            isLoading = true
            try {
                val res = ApiClient.getApiService(tokenManager).getNotifications()
                notifications = res.body()?.notifications ?: emptyList()
            } catch (_: Exception) {}
            isLoading = false
        }
    }

    LaunchedEffect(Unit) { load() }

    Column(Modifier.fillMaxSize().background(BgDark).padding(16.dp)) {
        Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
            IconButton(onClick = onBack) { Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = PrimarySky) }
            Text("Notifications", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextBright, modifier = Modifier.weight(1f))
            IconButton(onClick = { load() }) { Icon(Icons.Default.Refresh, contentDescription = "Refresh", tint = PrimarySky) }
        }
        Spacer(Modifier.height(12.dp))

        if (isLoading) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) { CircularProgressIndicator(color = PrimarySky) }
        } else if (notifications.isEmpty()) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Icon(Icons.Default.NotificationsNone, contentDescription = null, tint = TextMuted, modifier = Modifier.size(48.dp))
                    Spacer(Modifier.height(12.dp))
                    Text("All caught up!", color = TextMuted, fontSize = 16.sp)
                    Text("No notifications right now", color = TextMuted, fontSize = 13.sp)
                }
            }
        } else {
            LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                items(notifications) { notif ->
                    val accentColor = when (notif.type?.lowercase()) {
                        "success" -> SuccessGreen
                        "warning" -> WarningYellow
                        "error" -> ErrorRed
                        else -> PrimarySky
                    }
                    Card(
                        Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(10.dp),
                        colors = CardDefaults.cardColors(containerColor = if (notif.read) CardDark else CardDark.copy(alpha = 0.95f))
                    ) {
                        Row(Modifier.padding(14.dp).fillMaxWidth(), verticalAlignment = Alignment.Top) {
                            Icon(Icons.Default.Info, contentDescription = null, tint = accentColor, modifier = Modifier.size(22.dp).padding(top = 2.dp))
                            Spacer(Modifier.width(12.dp))
                            Column(Modifier.weight(1f)) {
                                notif.title?.let { Text(it, fontWeight = FontWeight.Bold, color = TextBright, fontSize = 14.sp) }
                                notif.message?.let { Spacer(Modifier.height(2.dp)); Text(it, color = TextBright, fontSize = 13.sp, lineHeight = 18.sp) }
                                notif.createdAt?.let { Spacer(Modifier.height(6.dp)); Text(it, color = TextMuted, fontSize = 11.sp) }
                            }
                            if (!notif.read) {
                                Surface(shape = RoundedCornerShape(50), color = PrimarySky, modifier = Modifier.size(8.dp)) {}
                            }
                        }
                    }
                }
            }
        }
    }
}
