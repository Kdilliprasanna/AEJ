package com.careerai.app.data.model

// ─────────────────────────── AUTH ───────────────────────────

data class LoginRequest(val email: String, val password: String)

data class RegisterRequest(val name: String, val email: String, val password: String)

data class AuthResponse(val token: String?, val user: User?, val message: String?)

data class User(
    val id: String,
    val email: String,
    val name: String?,
    val role: String? = "candidate",
    val createdAt: String?
)

// ─────────────────────────── PROFILE ───────────────────────────

data class Profile(
    val id: String? = null,
    val userId: String? = null,
    val name: String? = null,
    val email: String? = null,
    val phone: String? = null,
    val targetRole: String? = null,
    val educationField: String? = null,
    val degree: String? = null,
    val skills: List<String>? = null,
    val summary: String? = null,
    val locations: List<String>? = null
)

// ─────────────────────────── RESUME ATS ───────────────────────────

data class AtsAnalysisRequest(val resumeText: String, val jobDescription: String? = "")

data class AtsAnalysisResponse(
    val score: Int = 0,
    val rawScore: Int = 0,
    val matchedKeywords: List<String>? = null,
    val missingKeywords: List<String>? = null,
    val weakSections: List<String>? = null,
    val recommendations: List<String>? = null
)

// ─────────────────────────── JOB DISCOVERY ───────────────────────────

data class Job(
    val id: String,
    val title: String,
    val company: String,
    val location: String? = "Remote",
    val description: String? = null,
    val matchScore: Int? = 85,
    val source: String? = "Internal Catalog"
)

data class JobDiscoveryResponse(val ok: Boolean, val count: Int? = 0, val provider: String? = null, val jobs: List<Job>? = null)

data class SaveJobRequest(val jobId: String, val jobTitle: String, val company: String)

// ─────────────────────────── APPLICATIONS ───────────────────────────

data class ApplicationItem(
    val id: String? = null,
    val jobTitle: String? = null,
    val company: String? = null,
    val status: String? = "Applied",
    val appliedAt: String? = null,
    val notes: String? = null
)

data class ApplicationsResponse(val ok: Boolean, val applications: List<ApplicationItem>? = null)

// ─────────────────────────── COVER LETTER ───────────────────────────

data class CoverLetterRequest(
    val targetRole: String,
    val company: String,
    val jobDescription: String,
    val resumeSummary: String? = ""
)

data class CoverLetterItem(val id: String, val targetRole: String, val company: String, val content: String, val createdAt: String? = null)

data class CoverLetterResponse(val ok: Boolean, val coverLetter: CoverLetterItem? = null, val message: String? = null)

data class CoverLettersListResponse(val ok: Boolean, val coverLetters: List<CoverLetterItem>? = null)

// ─────────────────────────── CAREER ROADMAP ───────────────────────────

data class RoadmapRequest(val targetRole: String, val currentSkills: String? = "", val experience: String? = "Fresher")

data class RoadmapWeek(val week: Int, val title: String, val tasks: List<String>? = null, val resources: List<String>? = null)

data class RoadmapResponse(val ok: Boolean, val roadmap: List<RoadmapWeek>? = null, val targetRole: String? = null, val message: String? = null)

// ─────────────────────────── MOCK INTERVIEW ───────────────────────────

data class MockQuestion(val id: String, val question: String, val category: String? = null, val hint: String? = null)

data class MockQuestionsResponse(val ok: Boolean, val questions: List<MockQuestion>? = null)

data class SubmitMockTestRequest(val questions: List<Map<String, String>>, val answers: Map<String, String>)

data class MockTestResultResponse(val ok: Boolean, val score: Int? = 0, val grade: String? = null, val evaluation: List<Map<String, Any>>? = null)

// ─────────────────────────── AI CHAT ───────────────────────────

data class ChatMessage(val role: String, val content: String)

data class ChatRequest(val message: String, val history: List<ChatMessage>? = null)

data class ChatResponse(val ok: Boolean, val reply: String? = null, val message: String? = null)

// ─────────────────────────── JOB COPILOT ───────────────────────────

data class CopilotRequest(
    val jobTitle: String,
    val company: String,
    val jobDescription: String,
    val url: String? = ""
)

data class CopilotAnalysis(
    val matchScore: Int? = null,
    val matchedSkills: List<String>? = null,
    val missingSkills: List<String>? = null,
    val resumeSuggestions: List<String>? = null,
    val coverLetterDraft: String? = null,
    val interviewQuestions: List<String>? = null
)

data class CopilotResponse(val ok: Boolean, val matchScore: Int? = null, val analysis: CopilotAnalysis? = null, val coverLetterDraft: String? = null)

data class CopilotSessionsResponse(val ok: Boolean, val sessions: List<Map<String, Any>>? = null)

// ─────────────────────────── NOTIFICATIONS ───────────────────────────

data class NotificationItem(
    val id: String,
    val title: String? = null,
    val message: String? = null,
    val type: String? = "info",
    val read: Boolean = false,
    val createdAt: String? = null
)

data class NotificationsResponse(val ok: Boolean, val notifications: List<NotificationItem>? = null)

// ─────────────────────────── AI LIVE INTERVIEWER ───────────────────────────

data class LiveInterviewStartRequest(val targetRole: String, val difficulty: String = "Mid-Level", val company: String? = "")

data class LiveInterviewSessionResponse(val ok: Boolean, val session: LiveInterviewSession? = null, val question: String? = null)

data class LiveInterviewSession(
    val id: String,
    val targetRole: String,
    val status: String,
    val currentTurnIndex: Int,
    val turns: List<InterviewTurn>? = null
)

data class InterviewTurn(
    val turnIndex: Int,
    val question: String,
    val answer: String? = null,
    val evaluation: TurnEvaluation? = null
)

data class TurnEvaluation(
    val overallScore: Int = 0,
    val starScore: Int = 0,
    val technicalScore: Int = 0,
    val communicationScore: Int = 0,
    val feedback: String? = null
)

data class SubmitAnswerRequest(val sessionId: String, val answer: String, val responseType: String = "text")

// ─────────────────────────── UNIVERSITY ANALYTICS ───────────────────────────

data class UniversityAnalyticsResponse(val ok: Boolean, val privacyProtected: Boolean = true, val notice: String? = null, val analytics: UniversityAnalytics? = null)

data class UniversityAnalytics(
    val totalRegisteredStudents: Int = 0,
    val activeStudents: Int = 0,
    val resumeCompletionRate: Int = 0,
    val avgAtsScore: Int = 0,
    val totalApplicationsSubmitted: Int = 0,
    val interviewsReached: Int = 0,
    val topSkillGaps: List<SkillGapItem>? = null,
    val placementReadiness: PlacementReadiness? = null
)

data class SkillGapItem(val skill: String, val count: Int)

data class PlacementReadiness(val highReadiness: Int = 0, val moderateReadiness: Int = 0, val needsSupport: Int = 0)
