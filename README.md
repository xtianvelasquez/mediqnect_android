Download MQTT broker:
https://mosquitto.org/download/

Download Android Studio:
https://developer.android.com/studio

Download Gradle:
file:  gradle-8.11.1-all.zip
link: https://services.gradle.org/distributions/
Process: Place and extract it to C:\Users\<user>\.gradle\wrapper\dists\gradle-8.11.1-all\<random-folder>\

Download JDK-21:
file: https://download.oracle.com/java/21/archive/jdk-21.0.6_windows-x64_bin.exe
link: https://www.oracle.com/java/technologies/javase/jdk21-archive-downloads.html
Process: Install it and copy path directory

**Add ADB to Your System’s PATH**
Step 1: Locate ADB
1. Open File Explorer and navigate to: C:\Users\<user>\AppData\Local\Android\Sdk\platform-tools
2. Copy this directory path.

Step 2: Edit Environment Variables
3. Press `Win + S`, type "Environment Variables", and open it.
4. Click "Environment Variables" under the Advanced tab.
5. Under System Variables, find the `Path` variable and click Edit.
6. Click New and paste: C:\Users\<user>\AppData\Local\Android\Sdk\platform-tools
7. Click OK to save everything.
8. Restart your terminal or IDE.

Step 3: Verify ADB Installation
9. Open Command Prompt (`Win + R` → Type `cmd` → Press Enter).
10. Run: adb --version
11. If it displays the ADB version, the setup is complete!

**Add JDK 21 to Your JAVA_HOME**
Step 1: Locate JDK 21
1. Open File Explorer and navigate to: C:\Program Files\Java\jdk-21
2. Copy this directory path.

Step 2: Set JAVA_HOME Environment Variable
3. Press `Win + S`, type "Environment Variables", and open it.
4. Click "Environment Variables" under the Advanced tab.
5. Under System Variables, click New (or Edit if `JAVA_HOME` already exists).
   - Set Variable Name as `JAVA_HOME`.
   - Set Variable Value as: C:\Program Files\Java\jdk-21
6. Click OK to save everything.

Step 3: Add Java to System’s PATH
7. In System Variables, find `Path` and click Edit.
8. Click New and paste: C:\Program Files\Java\jdk-21\bin
9. Click OK to save everything.
10. Restart your terminal or IDE.

Step 4: Verify Java Installation
11. Open Command Prompt and run:
   - java -version
   - echo %JAVA_HOME%
   - javac -version
12. If `java -version` shows Java 21, your setup is correct!

**Ionic Capacitor Android Setup**

`ionic build`
Compiles the Ionic project into web assets (`www` folder). This step ensures the latest frontend changes are included before syncing with Capacitor.

`npx cap add android`
Adds the Android platform to the Capacitor project. This sets up the `android/` directory and necessary native files.

`npx cap sync android`
Synchronizes web assets, configuration files, and plugins with the Android project. Run this after making changes to your frontend or adding new plugins.

`npx cap open android`
Opens the Android project in Android Studio, allowing you to modify native configurations, debug, or build the app manually.

`npx cap run android`
Builds and deploys the app to a connected Android device or emulator. This command runs the app using the latest synced assets.

**Ionic File Generation**
Open your terminal in the src/app/ directory and run the following command:
ionic g page login
ionic g page signup
ionic g page profile

ionic g service services/alert
ionic g service services/load
ionic g service services/auth
ionic g service services/websocket

ionic g guard guards/auth
ionic g guard guards/protected

**Initialize Database**
Run this command in HeidiSQL: CREATE DATABASE if NOT EXISTS mediqnect;

**Ionic Dependency Instalations**
Open your terminal in the project's root directory and run the following command:
npm install axios
npm install mqtt
npm install cordova-plugin-local-notification
npm install @awesome-cordova-plugins/local-notifications
npm install @capacitor/local-notifications
npm install @capacitor/preferences

**Backend Dependency Instalations**
Open your command prompt and run the following command:
pip install fastapi
pip install paho-mqtt
pip install passlib[bcrypt]
pip install pyjwt
pip install pymysql
pip install sqlalchemy
pip install uvicorn

Run the ionic web: ionic serve
Run the fastapi backend: uvicorn main:app --reload

verify /protected: curl -H "Authorization: Bearer <your-token>" http://localhost:8000/protected

**Useful Commands**
ipconfig
adb devices
