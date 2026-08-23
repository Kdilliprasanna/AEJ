# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.

# react-native-reanimated
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# react-native-gesture-handler
-keep class com.swmansion.gesturehandler.** { *; }
-keep class com.swmansion.gesturehandler.react.** { *; }
-dontwarn com.swmansion.gesturehandler.**

# react-native-screens
-keep class com.swmansion.rnscreens.** { *; }
-dontwarn com.swmansion.rnscreens.**

# react-native-safe-area-context
-keep class com.th3rdwave.safeareacontext.** { *; }
-dontwarn com.th3rdwave.safeareacontext.**

# expo
-keep class expo.modules.** { *; }
