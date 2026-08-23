@echo off
set ANDROID_HOME=C:\Users\Prasanna\AppData\Local\Android\Sdk
set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set PATH=C:\Users\Prasanna\AppData\Local\Android\Sdk\platform-tools;%JAVA_HOME%\bin;%PATH%
echo ===================================================
echo 📱 Launching Native Android App on Physical Device
echo ===================================================
echo Reversing ports 8081 and 4000 for ADB USB connection...
"C:\Users\Prasanna\AppData\Local\Android\Sdk\platform-tools\adb.exe" reverse tcp:8081 tcp:8081
"C:\Users\Prasanna\AppData\Local\Android\Sdk\platform-tools\adb.exe" reverse tcp:4000 tcp:4000
echo Building and installing native Android App (NO EXPO GO)...
npx expo run:android
