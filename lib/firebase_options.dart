// File generated by FlutterFire CLI.
// ignore_for_file: type=lint
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// Default [FirebaseOptions] for use with your Firebase apps.
///
/// Example:
/// ```dart
/// import 'firebase_options.dart';
/// // ...
/// await Firebase.initializeApp(
///   options: DefaultFirebaseOptions.currentPlatform,
/// );
/// ```
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      return web;
    }
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for ios - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      case TargetPlatform.macOS:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for macos - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      case TargetPlatform.windows:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for windows - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      case TargetPlatform.linux:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for linux - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
      default:
        throw UnsupportedError(
          'DefaultFirebaseOptions are not supported for this platform.',
        );
    }
  }

  static const FirebaseOptions web = FirebaseOptions(
    apiKey: 'AIzaSyDFkiJcVktgWUry8bh7VFyJSN7PAKhBsJA',
    appId: '1:354109293556:web:a77b840ab5ca874f7cefa1',
    messagingSenderId: '354109293556',
    projectId: 'the-learning-games-8a10e',
    authDomain: 'the-learning-games-8a10e.firebaseapp.com',
    storageBucket: 'the-learning-games-8a10e.appspot.com',
    measurementId: 'G-SKF4VYSFKK',
  );

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyC_PThi8nLYosZyupVTlKkd79gSrnUpNKk',
    appId: '1:354109293556:android:51391a60322c88157cefa1',
    messagingSenderId: '354109293556',
    projectId: 'the-learning-games-8a10e',
    storageBucket: 'the-learning-games-8a10e.appspot.com',
  );
}
