@echo off
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set ANDROID_HOME=C:\Users\Prasanna\AppData\Local\Android\Sdk
cd /d c:\Users\Prasanna\OneDrive\Desktop\career-ai\mobile-application
call .\android\gradlew.bat -p android assembleDebug
