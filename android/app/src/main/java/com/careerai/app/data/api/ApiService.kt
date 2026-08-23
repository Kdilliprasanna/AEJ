package com.careerai.app.data.api

import com.careerai.app.data.model.*
import retrofit2.Response
import retrofit2.http.*

interface ApiService {

    // ── AUTH ──────────────────────────────────────────────────────────────────
    @POST("auth/login")
    suspend fun login(@Body body: LoginRequest): Response<AuthResponse>

    @POST("auth/register")
    suspend fun register(@Body body: RegisterRequest): Response<AuthResponse>

    // ── PROFILE ───────────────────────────────────────────────────────────────
    @GET("profile/get")
    suspend fun getProfile(): Response<Map<String, Profile>>

    @PATCH("profile/update")
    suspend fun updateProfile(@Body body: Profile): Response<Map<String, Profile>>

    // ── RESUME ATS ────────────────────────────────────────────────────────────
    @POST("resume/analyze-text")
    suspend fun analyzeResumeText(@Body body: AtsAnalysisRequest): Response<AtsAnalysisResponse>

    // ── COVER LETTER ──────────────────────────────────────────────────────────
    @POST("cover-letters/generate")
    suspend fun generateCoverLetter(@Body body: CoverLetterRequest): Response<CoverLetterResponse>

    @GET("cover-letters")
    suspend fun getCoverLetters(): Response<CoverLettersListResponse>

    @DELETE("cover-letters/{id}")
    suspend fun deleteCoverLetter(@Path("id") id: String): Response<Map<String, Any>>

    // ── CAREER ROADMAP ────────────────────────────────────────────────────────
    @POST("career-roadmap/generate")
    suspend fun generateCareerRoadmap(@Body body: RoadmapRequest): Response<RoadmapResponse>

    @GET("career-roadmap")
    suspend fun getCareerRoadmaps(): Response<Map<String, Any>>

    // ── AI CHAT / CAREER COACH ────────────────────────────────────────────────
    @POST("ai/chat")
    suspend fun sendChatMessage(@Body body: ChatRequest): Response<ChatResponse>

    // ── MOCK INTERVIEW / TEST ─────────────────────────────────────────────────
    @GET("interview/questions")
    suspend fun getMockQuestions(): Response<MockQuestionsResponse>

    @POST("interview/submit")
    suspend fun submitMockTest(@Body body: SubmitMockTestRequest): Response<MockTestResultResponse>

    @POST("interview/eval-star")
    suspend fun evaluateStarAnswer(@Body body: Map<String, String>): Response<Map<String, Any>>

    // ── JOB DISCOVERY ─────────────────────────────────────────────────────────
    @GET("jobs/advanced-search")
    suspend fun searchJobs(
        @Query("query") query: String = "Software Engineer",
        @Query("location") location: String = "Remote"
    ): Response<JobDiscoveryResponse>

    @POST("jobs/save")
    suspend fun saveJob(@Body body: SaveJobRequest): Response<Map<String, Any>>

    // ── APPLICATION TRACKER ───────────────────────────────────────────────────
    @GET("applications/list")
    suspend fun getApplications(): Response<ApplicationsResponse>

    @POST("applications/create")
    suspend fun createApplication(@Body body: ApplicationItem): Response<Map<String, Any>>

    @PATCH("applications/update-status")
    suspend fun updateApplicationStatus(@Body body: Map<String, String>): Response<Map<String, Any>>

    // ── JOB COPILOT ───────────────────────────────────────────────────────────
    @POST("copilot/analyze-job")
    suspend fun analyzeJobWithCopilot(@Body body: CopilotRequest): Response<CopilotResponse>

    @GET("copilot/sessions")
    suspend fun getCopilotSessions(): Response<CopilotSessionsResponse>

    // ── LIVE AI INTERVIEWER ───────────────────────────────────────────────────
    @POST("live-interview/start")
    suspend fun startLiveInterview(@Body body: LiveInterviewStartRequest): Response<LiveInterviewSessionResponse>

    @POST("live-interview/submit-answer")
    suspend fun submitLiveInterviewAnswer(@Body body: SubmitAnswerRequest): Response<Map<String, Any>>

    @POST("live-interview/complete")
    suspend fun completeLiveInterview(@Body body: Map<String, String>): Response<Map<String, Any>>

    @GET("live-interview/sessions")
    suspend fun getLiveInterviewSessions(): Response<Map<String, Any>>

    // ── NOTIFICATIONS ─────────────────────────────────────────────────────────
    @GET("notifications/list")
    suspend fun getNotifications(): Response<NotificationsResponse>

    // ── ANALYTICS ─────────────────────────────────────────────────────────────
    @POST("analytics/track")
    suspend fun trackAnalyticsEvent(@Body body: Map<String, Any>): Response<Map<String, Any>>

    @GET("analytics/summary")
    suspend fun getAnalyticsSummary(): Response<Map<String, Any>>

    // ── ADMIN / UNIVERSITY ANALYTICS ─────────────────────────────────────────
    @GET("admin/university-analytics")
    suspend fun getUniversityAnalytics(): Response<UniversityAnalyticsResponse>

    @GET("admin/audit-logs")
    suspend fun getAuditLogs(): Response<Map<String, Any>>

    // ── ACCOUNT ───────────────────────────────────────────────────────────────
    @POST("account/export")
    suspend fun exportAccountData(): Response<Map<String, Any>>

    @POST("account/delete")
    suspend fun deleteAccount(): Response<Map<String, Any>>

    // ── HEALTH ────────────────────────────────────────────────────────────────
    @GET("health")
    suspend fun getHealth(): Response<Map<String, Any>>
}
