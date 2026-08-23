set JAVA_HOME=C:\Program Files\Android\Android Studio\jbr
set ANDROID_HOME=C:\Users\Prasanna\AppData\Local\Android\Sdk
cd /d c:\Users\Prasanna\OneDrive\Desktop\career-ai\mobile-application
call android\gradlew.bat -p android --stop >nul 2>&1
if exist "node_modules\@expo\dom-webview" rmdir /s /q "node_modules\@expo\dom-webview"
if exist "node_modules\@expo\log-box" rmdir /s /q "node_modules\@expo\log-box"
if exist "node_modules\react-native\node_modules\@react-native\gradle-plugin\shared\build" rmdir /s /q "node_modules\react-native\node_modules\@react-native\gradle-plugin\shared\build"
if exist "node_modules\react-native\node_modules\@react-native\gradle-plugin\settings-plugin\build" rmdir /s /q "node_modules\react-native\node_modules\@react-native\gradle-plugin\settings-plugin\build"
if exist "node_modules\react-native\node_modules\@react-native\gradle-plugin\react-native-gradle-plugin\build" rmdir /s /q "node_modules\react-native\node_modules\@react-native\gradle-plugin\react-native-gradle-plugin\build"
call android\gradlew.bat -p android assembleRelease > build_release.log 2>&1
