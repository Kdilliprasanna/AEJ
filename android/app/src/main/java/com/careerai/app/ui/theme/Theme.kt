package com.careerai.app.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable

private val DarkColorScheme = darkColorScheme(
    primary = PrimarySky,
    secondary = AccentBlue,
    background = BgDark,
    surface = CardDark,
    onPrimary = TextBright,
    onBackground = TextBright,
    onSurface = TextBright
)

@Composable
fun CareerAITheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        content = content
    )
}
