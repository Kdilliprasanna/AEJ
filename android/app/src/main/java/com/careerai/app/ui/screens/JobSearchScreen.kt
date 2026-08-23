package com.careerai.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.filled.Bookmark
import androidx.compose.material.icons.filled.Search
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.careerai.app.data.api.ApiClient
import com.careerai.app.data.model.Job
import com.careerai.app.data.model.SaveJobRequest
import com.careerai.app.data.storage.SecureTokenManager
import com.careerai.app.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun JobSearchScreen(
    tokenManager: SecureTokenManager,
    onBack: () -> Unit
) {
    var searchQuery by remember { mutableStateOf("Full Stack Developer") }
    var jobsList by remember { mutableStateOf<List<Job>>(emptyList()) }
    var isLoading by remember { mutableStateOf(false) }
    var statusMessage by remember { mutableStateOf("") }
    val scope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        // Fetch default job discovery
        try {
            isLoading = true
            val api = ApiClient.getApiService(tokenManager)
            val res = api.searchJobs(searchQuery, "Remote")
            if (res.isSuccessful && res.body()?.ok == true) {
                jobsList = res.body()?.jobs ?: emptyList()
            }
        } catch (e: Exception) {
            statusMessage = "Search Notice: ${e.localizedMessage}"
        } finally {
            isLoading = false
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BgDark)
            .padding(16.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            IconButton(onClick = onBack) {
                Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = "Back", tint = PrimarySky)
            }
            Text("Real Job Discovery", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextBright)
        }

        Spacer(modifier = Modifier.height(12.dp))

        Row(modifier = Modifier.fillMaxWidth(), verticalAlignment = Alignment.CenterVertically) {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                label = { Text("Job Title or Skill", color = TextMuted) },
                singleLine = true,
                modifier = Modifier.weight(1f),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = PrimarySky,
                    unfocusedBorderColor = TextMuted,
                    focusedTextColor = TextBright,
                    unfocusedTextColor = TextBright
                )
            )

            Spacer(modifier = Modifier.width(8.dp))

            IconButton(
                onClick = {
                    scope.launch {
                        isLoading = true
                        try {
                            val api = ApiClient.getApiService(tokenManager)
                            val res = api.searchJobs(searchQuery, "Remote")
                            if (res.isSuccessful && res.body()?.ok == true) {
                                jobsList = res.body()?.jobs ?: emptyList()
                            }
                        } catch (e: Exception) {
                            statusMessage = "Error: ${e.localizedMessage}"
                        } finally {
                            isLoading = false
                        }
                    }
                },
                modifier = Modifier
                    .size(50.dp)
                    .background(AccentBlue, shape = RoundedCornerShape(8.dp))
            ) {
                Icon(Icons.Default.Search, contentDescription = "Search", tint = Color.White)
            }
        }

        if (statusMessage.isNotEmpty()) {
            Text(statusMessage, color = WarningYellow, fontSize = 12.sp, modifier = Modifier.padding(vertical = 4.dp))
        }

        Spacer(modifier = Modifier.height(16.dp))

        if (isLoading) {
            Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                CircularProgressIndicator(color = PrimarySky)
            }
        } else {
            LazyLazyJobColumn(
                jobsList = jobsList,
                tokenManager = tokenManager
            )
        }
    }
}

@Composable
fun LazyLazyJobColumn(
    jobsList: List<Job>,
    tokenManager: SecureTokenManager
) {
    val scope = rememberCoroutineScope()
    var savedNotice by remember { mutableStateOf("") }

    if (savedNotice.isNotEmpty()) {
        Text(savedNotice, color = SuccessGreen, fontSize = 12.sp, modifier = Modifier.padding(bottom = 8.dp))
    }

    LazyColumn(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        items(jobsList) { job ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(10.dp),
                colors = CardDefaults.cardColors(containerColor = CardDark)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(job.title, fontWeight = FontWeight.Bold, color = TextBright, fontSize = 16.sp)
                        Text("${job.matchScore ?: 85}% Match", color = SuccessGreen, fontWeight = FontWeight.ExtraBold, fontSize = 13.sp)
                    }

                    Text("${job.company} • ${job.location ?: "Remote"}", color = TextMuted, fontSize = 13.sp)

                    Spacer(modifier = Modifier.height(8.dp))

                    Text(
                        job.description ?: "High match position requiring full stack capabilities.",
                        color = TextBright,
                        fontSize = 12.sp,
                        maxLines = 2
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Button(
                        onClick = {
                            scope.launch {
                                try {
                                    val api = ApiClient.getApiService(tokenManager)
                                    val res = api.saveJob(SaveJobRequest(job.id, job.title, job.company))
                                    if (res.isSuccessful) {
                                        savedNotice = "Saved ${job.title} to Career AI Dashboard!"
                                    }
                                } catch (e: Exception) {
                                    savedNotice = "Failed to save: ${e.localizedMessage}"
                                }
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = PrimarySky),
                        shape = RoundedCornerShape(6.dp),
                        modifier = Modifier.align(Alignment.End)
                    ) {
                        Icon(Icons.Default.Bookmark, contentDescription = null, modifier = Modifier.size(16.dp))
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Save Job", fontSize = 12.sp, color = BgDark, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
