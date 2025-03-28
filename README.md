# Laundrify

A modern React Native/Expo app for tracking washing machine availability in dormitories, built with TypeScript and Expo Router.

## Features

- View washing machines available on each floor
- Toggle machine status between "available" and "in use"
- Visual indicators for machine status
- TypeScript for type safety and better developer experience
- Expo Router for navigation

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/laundrify.git
cd laundrify
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm start
# or
yarn start
```

4. Use the Expo Go app on your mobile device to scan the QR code, or run on a simulator

## Project Structure

- `app/` - Expo Router pages and layouts
  - `_layout.tsx` - Root layout component with navigation configuration
  - `index.tsx` - Home screen showing the list of floors
- `components/` - Reusable UI components
  - `FloorList.tsx` - Component to list all floors
  - `Floor.tsx` - Component to display a single floor
  - `WashingMachine.tsx` - Component to display washing machine status
- `data/` - Data files
  - `floors.ts` - Contains the floors and washing machines data with TypeScript types

## Technology Stack

- React Native
- Expo & Expo Router
- TypeScript
- React Hooks for state management

## License

MIT 


Arduino Code:

#include <SoftwareSerial.h>

SoftwareSerial espSerial(10, 11); // 11 RX,10 TX (connect to ESP TX, RX)

const int LDR_PIN = A0;
const int KNOWN_RESISTOR = 10000;

const int SAMPLING_PERIOD = 1000;
const int AVERAGING_TIME = 10;

const int motionSensorPin = 2;
const int powerPin = 3;
const int ledPin = LED_BUILTIN;

unsigned long motionTimeout = 10000;
unsigned long lastMotionTime = 0;
bool checkingLaundry = false;

void setup() {
    pinMode(ledPin, OUTPUT);
    digitalWrite(ledPin, HIGH);

    pinMode(motionSensorPin, INPUT);
    pinMode(powerPin, OUTPUT);

    Serial.begin(115200);       // USB Serial for debugging
    espSerial.begin(115200);      // Lower baud rate for stable SoftwareSerial
}

void loop() {
    int motionDetected = digitalRead(motionSensorPin);

    if (motionDetected == HIGH) {
        lastMotionTime = millis();
        checkingLaundry = false;

        digitalWrite(powerPin, LOW);
        digitalWrite(ledPin, LOW);

        Serial.println("MOTION:1");
        espSerial.println("MOTION:1"); // Send to ESP with newline for better parsing
    }

    if (millis() - lastMotionTime > motionTimeout) {
        checkingLaundry = true;
    }

    while (checkingLaundry) {
        Serial.println("MOTION:0"); // Added print here
        espSerial.println("MOTION:0");
        checkLaundry(); // Start LDR averaging

        unsigned long checkStartTime = millis();
        while (millis() - checkStartTime < 10000) {
            if (digitalRead(motionSensorPin) == HIGH) {
                Serial.println("MOTION:1");
                espSerial.println("MOTION:1");
                checkingLaundry = false;
                return;
            }
            delay(500);
        }
    }

    delay(500);
}

void checkLaundry() {
    long totalResistance = 0;
    int readingsCount = 0;

    digitalWrite(powerPin, HIGH);

    for (int i = 0; i < AVERAGING_TIME; i++) {
        if (digitalRead(motionSensorPin) == HIGH) {
            Serial.println("MOTION:1");
            espSerial.println("MOTION:1");
            checkingLaundry = false;
            digitalWrite(powerPin, LOW);
            return;
        }
        espSerial.println("MOTION:0");

        int sensorValue = analogRead(LDR_PIN);
        float voltage = sensorValue * (5.0 / 1023.0);
        float ldrResistance = (KNOWN_RESISTOR * (5.0 - voltage)) / voltage;

        totalResistance += ldrResistance;
        readingsCount++;

        delay(SAMPLING_PERIOD);
    }

    digitalWrite(powerPin, LOW);

    float averageResistance = totalResistance / readingsCount;

    // Send only the relevant data to ESP
    if (averageResistance < 8000) {
        Serial.println("LAUNDRY:0");
        espSerial.println("LAUNDRY:0");
    } else {
        Serial.println("LAUNDRY:1");
        espSerial.println("LAUNDRY:1");
    }
}







#include "secrets.h"
#include <Firebase.h>


Firebase fb(REFERENCE_URL);


void setup() {
    Serial.begin(115200);  // Serial for communication with Arduino
    WiFi.mode(WIFI_STA);
    WiFi.disconnect();
    delay(1000);


    Serial.println("\nConnecting to WiFi...");
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);


    while (WiFi.status() != WL_CONNECTED) {
        Serial.print(".");
        delay(500);
    }


    Serial.println("\nWiFi Connected");


    fb.setInt("/test", 1738);
    fb.setInt("/hasmotion", 10);
    fb.setInt("/haslaundry", 5);
}


void loop() {
   
        fb.setInt("/test", 18);
        delay(50);
        String message = Serial.readStringUntil('\n');  // Read from Arduino
        message.trim();  // Ensure no extra spaces


        if (message.startsWith("MOTION:")) {
            int motionStatus = message.substring(7).toInt();
            fb.setInt("/hasmotion", motionStatus);
            Serial.println("Firebase Updated: Motion = " + String(motionStatus));
        }
        else if (message.startsWith("LAUNDRY:")) {
            int laundryStatus = message.substring(8).toInt();
            fb.setInt("/haslaundry", laundryStatus);
            Serial.println("Firebase Updated: Laundry = " + String(laundryStatus));
        }
   
}




#define WIFI_SSID     "utexas-iot"
#define WIFI_PASSWORD "68448516348347489491"


/*


          FIREBASE SETUP


  ------------------------------------------------
  IMPORTANT: Choose Firebase Initialization Method
  ------------------------------------------------


  1. ** Test Mode (No Authentication) **:


     - Ensure Firebase rules are set to allow public access. Set the rules as follows:
       {
         "rules": {
           ".read": "true",
           ".write": "true"
         }
       }


  2. ** Locked Mode (With Authentication) **:


     - Obtain your Firebase Authentication Token:
       1. Open your Firebase Console: https://console.firebase.google.com/
       2. Navigate to your project.
       3. Click on the gear icon next to "Project Overview" and select "Project settings".
       4. Go to the "Service accounts" tab.
       5. In the "Database secrets" section, click on "Show" to reveal your authentication token.


     - Ensure Firebase rules require authentication. Set the rules as follows:
       {
         "rules": {
           ".read": "auth != null",
           ".write": "auth != null"
         }
       }


  Note: Using authentication is recommended for production environments to secure your data.
*/


/* Test Mode (No Authentication) */
#define REFERENCE_URL "https://laundrymachine-f9fdf-default-rtdb.firebaseio.com/"


/* Uncomment the following line for Locked Mode (With Authentication) */
// #define AUTH_TOKEN "YOUR-AUTHENTICATION-CODE"
