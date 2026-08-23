package com.careerai.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.careerai.app.data.api.ApiClient
import com.careerai.app.data.storage.SecureTokenManager
import com.careerai.app.ui.screens.*
import com.careerai.app.ui.theme.BgDark
import com.careerai.app.ui.theme.CareerAITheme

class MainActivity : ComponentActivity() {
    private lateinit var tokenManager: SecureTokenManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        ApiClient.init(applicationContext)          // load saved server URL
        tokenManager = SecureTokenManager(applicationContext)
        setContent {
            CareerAITheme {
                Surface(modifier = Modifier.fillMaxSize(), color = BgDark) {
                    CareerAiApp(tokenManager)
                }
            }
        }
    }
}

@Composable
fun CareerAiApp(tokenManager: SecureTokenManager) {
    val navController = rememberNavController()
    val start = if (tokenManager.isLoggedIn()) "dashboard" else "login"

    fun navigateTo(route: String) = navController.navigate(route)
    fun goBack() = navController.popBackStack()
    fun logout() {
        tokenManager.clearSession()
        navController.navigate("login") { popUpTo(0) { inclusive = true } }
    }

    NavHost(navController = navController, startDestination = start) {

        // ── AUTH ──────────────────────────────────────────────────────────────
        composable("login") {
            LoginScreen(
                tokenManager = tokenManager,
                onLoginSuccess = { navController.navigate("dashboard") { popUpTo("login") { inclusive = true } } },
                onNavigateToRegister = { navController.navigate("register") }
            )
        }
        composable("register") {
            RegisterScreen(
                tokenManager = tokenManager,
                onRegisterSuccess = { navController.navigate("dashboard") { popUpTo("login") { inclusive = true } } },
                onNavigateToLogin = { navController.popBackStack() }
            )
        }

        // ── MAIN ──────────────────────────────────────────────────────────────
        composable("dashboard") {
            DashboardScreen(
                tokenManager = tokenManager,
                onNavigate = { navigateTo(it) },
                onLogout = { logout() }
            )
        }
        composable("profile") {
            ProfileScreen(tokenManager = tokenManager, onBack = { goBack() }, onLogout = { logout() })
        }

        // ── AI FEATURES ───────────────────────────────────────────────────────
        composable("copilot") {
            AiCopilotScreen(tokenManager = tokenManager, onBack = { goBack() })
        }
        composable("coverLetter") {
            CoverLetterScreen(tokenManager = tokenManager, onBack = { goBack() })
        }
        composable("roadmap") {
            CareerRoadmapScreen(tokenManager = tokenManager, onBack = { goBack() })
        }
        composable("chat") {
            AiChatScreen(tokenManager = tokenManager, onBack = { goBack() })
        }

        // ── INTERVIEW ─────────────────────────────────────────────────────────
        composable("liveInterview") {
            LiveInterviewScreen(tokenManager = tokenManager, onBack = { goBack() })
        }
        composable("mockInterview") {
            MockInterviewScreen(tokenManager = tokenManager, onBack = { goBack() })
        }

        // ── RESUME ────────────────────────────────────────────────────────────
        composable("ats") {
            AtsAnalysisScreen(tokenManager = tokenManager, onBack = { goBack() })
        }

        // ── JOBS ──────────────────────────────────────────────────────────────
        composable("jobs") {
            JobSearchScreen(tokenManager = tokenManager, onBack = { goBack() })
        }
        composable("applications") {
            ApplicationTrackerScreen(tokenManager = tokenManager, onBack = { goBack() })
        }

        // ── NOTIFICATIONS ─────────────────────────────────────────────────────
        composable("notifications") {
            NotificationsScreen(tokenManager = tokenManager, onBack = { goBack() })
        }

        // ── ADMIN ─────────────────────────────────────────────────────────────
        composable("admin") {
            AdminAnalyticsScreen(tokenManager = tokenManager, onBack = { goBack() })
        }
    }
}
