import zipfile

aar_path = r"C:\Users\Prasanna\.gradle\caches\modules-2\files-2.1\com.facebook.hermes\hermes-android\250829098.0.14\d86fa5d7fca49bddc3fe4343899ea72809d32593\hermes-android-250829098.0.14-release.aar"
with zipfile.ZipFile(aar_path, 'r') as z:
    classes_jar = z.read('classes.jar')
    with open('tmp_test_classes.jar', 'wb') as f:
        f.write(classes_jar)

with zipfile.ZipFile('tmp_test_classes.jar', 'r') as cz:
    names = cz.namelist()
    print("Classes in classes.jar total:", len(names))
    has_unicode = any('AndroidUnicodeUtils' in n for n in names)
    print("Has AndroidUnicodeUtils?", has_unicode)
