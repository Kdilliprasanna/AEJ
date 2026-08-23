import zipfile

aar = r"C:\Users\Prasanna\.gradle\caches\modules-2\files-2.1\com.facebook.react\react-android\0.76.9\905ed1a5bd9ce22607585c8b49e44a9b1b403bac\react-android-0.76.9-release.aar"

with zipfile.ZipFile(aar, 'r') as z:
    for f in z.namelist():
        if f.endswith('.so'):
            print(f)
