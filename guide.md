Generate keystore:
keytool -genkey -v -keystore release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias your_key_alias

Convert jks to base 64 txt:
base64 -i android/keystores/release-key.jks > keystore_base64.txt