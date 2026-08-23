package com.careerai.app.data.api

import android.content.Context
import android.content.SharedPreferences
import com.careerai.app.data.storage.SecureTokenManager
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import java.util.concurrent.TimeUnit

object ApiClient {

    // ─── URL management ──────────────────────────────────────────────────────
    // Default: Android emulator.  Change to your PC's WiFi IP for physical device.
    // e.g.  "http://192.168.1.5:4000/api/"
    private const val DEFAULT_BASE_URL = "http://10.0.2.2:4000/api/"
    private const val PREFS_NAME       = "api_client_prefs"
    private const val KEY_BASE_URL     = "base_url"

    private var prefs: SharedPreferences? = null

    /** Call once from Application or MainActivity before first use. */
    fun init(context: Context) {
        if (prefs == null) {
            prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        }
    }

    private var _baseUrl: String? = null

    private fun resolvedBaseUrl(): String {
        if (_baseUrl == null) {
            _baseUrl = prefs?.getString(KEY_BASE_URL, DEFAULT_BASE_URL) ?: DEFAULT_BASE_URL
        }
        return _baseUrl!!
    }

    fun getBaseUrl(): String = resolvedBaseUrl()

    fun setBaseUrl(url: String) {
        val clean = if (url.endsWith("/")) url else "$url/"
        _baseUrl = clean
        prefs?.edit()?.putString(KEY_BASE_URL, clean)?.apply()
        retrofitInstance = null   // force recreation
    }

    fun resetToDefault() {
        setBaseUrl(DEFAULT_BASE_URL)
    }

    // ─── Retrofit singleton ───────────────────────────────────────────────────
    private var retrofitInstance: Retrofit? = null

    fun getApiService(tokenManager: SecureTokenManager): ApiService {
        if (retrofitInstance == null) {
            val logging = HttpLoggingInterceptor().apply {
                level = HttpLoggingInterceptor.Level.BODY
            }

            val authInterceptor = Interceptor { chain ->
                val original = chain.request()
                val token = tokenManager.getToken()
                val requestBuilder = original.newBuilder()
                if (!token.isNullOrBlank()) {
                    requestBuilder.header("Authorization", "Bearer $token")
                }
                requestBuilder.header("Content-Type", "application/json")
                chain.proceed(requestBuilder.build())
            }

            val client = OkHttpClient.Builder()
                .addInterceptor(authInterceptor)
                .addInterceptor(logging)
                .connectTimeout(20, TimeUnit.SECONDS)
                .readTimeout(30, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .build()

            retrofitInstance = Retrofit.Builder()
                .baseUrl(resolvedBaseUrl())
                .client(client)
                .addConverterFactory(GsonConverterFactory.create())
                .build()
        }
        return retrofitInstance!!.create(ApiService::class.java)
    }
}
