package com.careerai.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Lock
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.careerai.app.data.api.ApiClient
import com.careerai.app.data.model.UniversityAnalytics
import com.careerai.app.data.storage.SecureTokenManager
import com.careerai.app.ui.theme.*

@Composable
fun AdminAnalyticsScreen(
    tokenManager: SecureTokenManager,
    onBack: () -> Unit
) {
    var analyticsData by remember { mutableStateOf<UniversityAnalytics?>(null) }
    var privacyNotice by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(true) }
    var errorMsg by remember { mutableStateOf("") }

    LaunchedEffect(Unit) {
        try {
            val api = ApiClient.getApiService(tokenManager)
            val res = api.getUniversityAnalytics()
            if (res.isSuccessful && res.body()?.ok == true) {
                analyticsData = res.body()?.analytics
                privacyNotice = res.body()?.notice ?: "Data is strictly anonymized and aggregated."
            } else if (res.code() == 403) {
                errorMsg = "Access Denied (403): Candidate accounts are not authorized to access institutional analytics."
            } else {
                errorMsg = "HTTP Error: ${res.code()}"
            }
        } catch (e: Exception) {
            errorMsg = "Error: ${e.localizedMessage}"
        } finally {
            isLoading = false
        }
    }

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
            Text("University Analytics", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextBright)
        }

        Spacer(modifier = Modifier.height(12.dp))

        Card(
            modifier = Modifier.fillMaxWidth(),
            colors = CardDefaults.cardColors(containerColor = CardDark),
            shape = RoundedCornerShape(10.dp)
        ) {
            Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.Lock, contentDescription = null, tint = PrimarySky, modifier = Modifier.size(20.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    privacyNotice.ifEmpty { "Privacy Policy Enforced: Aggregated metrics only. Zero candidate PII exposed." },
                    color = TextMuted,
                    fontSize = 11.sp
                )
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        if (isLoading) {
            Box(modifier = Modifier.fillMaxWidth().height(200.dp), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = PrimarySky)
            }
        } else if (errorMsg.isNotEmpty()) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = CardDark),
                shape = RoundedCornerShape(10.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Authorization Notice", color = ErrorRed, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(errorMsg, color = TextMuted, fontSize = 13.sp)
                }
            }
        } else analyticsData?.let { data ->
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                MetricRow("Total Registered Students", "${data.totalRegisteredStudents}")
                MetricRow("Active Cohort Students", "${data.activeStudents}")
                MetricRow("Resume Completion Rate", "${data.resumeCompletionRate}%")
                MetricRow("Avg Cohort ATS Score", "${data.avgAtsScore}%")
                MetricRow("Applications Tracked", "${data.totalApplicationsSubmitted}")
                MetricRow("Interviews Reached", "${data.interviewsReached}")
            }
        }
    }
}

@Composable
fun MetricRow(label: String, value: String) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(8.dp),
        colors = CardDefaults.cardColors(containerColor = CardDark)
    ) {
        Row(
            modifier = Modifier.padding(16.dp).fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(label, color = TextMuted, fontSize = 14.sp)
            Text(value, color = PrimarySky, fontWeight = FontWeight.Bold, fontSize = 18.sp)
        }
    }
}
