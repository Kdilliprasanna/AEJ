@echo off
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set ANDROID_HOME=C:\Users\Prasanna\AppData\Local\Android\Sdk
cd /d c:\Users\Prasanna\OneDrive\Desktop\career-ai\mobile-application
taskkill /F /IM java.exe >nul 2>&1
for /d /r "node_modules" %%d in (build) do @if exist "%%d" rmdir /s /q "%%d" >nul 2>&1
if exist "android\app\build" rmdir /s /q "android\app\build" >nul 2>&1
if exist "android\.gradle" rmdir /s /q "android\.gradle" >nul 2>&1
call .\android\gradlew.bat -p android assembleDebug > build.log 2>&1
