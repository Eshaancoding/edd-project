// Libraries WiFi + Firebase
#include <Arduino.h>
#include <WiFi.h>
#include <FirebaseClient.h>
#include <WiFiClientSecure.h>
#include <FirebaseJson.h>

// Libraries for TFT (communication protocol/library for displaying text/shapes on screen) + others
#include <SPI.h>
#include <TFT_eSPI.h> // Graphics and font library for ST7735 driver chip
#include "HTTPClient.h"
#include "WiFiClient.h"
#include "pin_config.h"

// PINS to be defined for TFT
#define PIN_PCM5102A_DIN 43
#define PIN_PCM5102A_BCLK 44
#define PIN_PCM5102A_LRCLK 18

// Firebase initialize client
#define DATABASE_SECRET "AIzaSyCt4_VJ1h6DndF1143QZnUqngXGxTJzSPU"
#define DATABASE_URL "https://edd-project-f9d25-default-rtdb.firebaseio.com"

// Initialize Wifi classes for firebase
WiFiClientSecure ssl;
DefaultNetwork network;
AsyncClientClass client(ssl, getNetwork(network));

// Initialize firebase client for connection
FirebaseApp app;
RealtimeDatabase Database;
AsyncResult result;
LegacyToken dbSecret(DATABASE_SECRET);

// Device id 
const char* device_id = "be231c";

// WiFi name and password (we use phone hotspot)
String ssid = "eshaan";
String password = "765ESHAAN";

// Initialize library to draw to screen
TFT_eSPI tft = TFT_eSPI(); // Invoke library, pins defined in User_Setup.h

void setup(void) {
  Serial.begin(115200); // Initialize Serial monitor for debugging

  // ESP32 have pins you have to turn high if you want to power it on
  pinMode(PIN_POWER_ON, OUTPUT); 
  digitalWrite(PIN_POWER_ON, HIGH);

  // more initialize to screen
  tft.init();
  tft.setRotation(3);
  tft.fillScreen(TFT_BLACK);

  // Connect to wifi
  WiFi.disconnect();
  WiFi.mode(WIFI_STA);
  WiFi.begin(ssid.c_str(), password.c_str());
  delay(2000);
  int tries = 1;
  while (WiFi.status() != WL_CONNECTED) {
    // Display # of attempts in the TFT screen
    std::string msg = "#";
    msg += std::to_string(tries);
    msg += " Wifi Connection Failed";

    tft.fillScreen(TFT_BLACK);
    tft.drawCentreString(msg.c_str(), 180, 60, 2);
    delay(1000);

    tries += 1;
  }

  // initialize firebase!
  ssl.setInsecure();
  initializeApp(client, app, getAuth(dbSecret));
  app.getApp<RealtimeDatabase>(Database);
  Database.url(DATABASE_URL);
  client.setAsyncResult(result);

  // send result
  tft.fillScreen(TFT_BLACK);
  tft.println("Firebase + WiFi Successfully Connected.");
}

// access values given a specific key (param) of a json object.
std::string retStrJSON (FirebaseJson json, std::string param) {
  FirebaseJsonData result;
  json.get(result, param.c_str());
  return std::string(result.to<String>().c_str());
}

void loop() {
  // get status from server
  std::string user_id = "/devices/";
  user_id += device_id;
  String string_res = Database.get<String>(client, user_id.c_str()); // use .c_str()
  FirebaseJson json_result;
  json_result.setJsonData(string_res.c_str());

  // get specific attributes from data.
  std::string display = retStrJSON(json_result, "display");
  std::string name = retStrJSON(json_result, "name");
  std::string partyId = retStrJSON(json_result, "partyId");
  std::string userId = retStrJSON(json_result, "userId");

  // draw
  tft.fillScreen(TFT_BLACK);
  tft.setTextColor(TFT_WHITE, TFT_WHITE); 

  if (partyId != "None" && userId != "None") { // we have a valid id
    // Draw name
    tft.drawCentreString(name.c_str(), 170, 50, 4);
    int CenterX = 170;
    int CenterY = 120;
    
    // Draw symbol related to the group number (display attribute)
    int groupNumber = std::stoi(display);
    switch (groupNumber) {
      case 0: 
        tft.fillRect(CenterX - 25, CenterY - 25, 50, 50, TFT_RED); // draw rect if group number 0
        break;
      case 1: 
        tft.fillTriangle(CenterX, CenterY - 30, CenterX - 30, CenterY + 30, CenterX + 30, CenterY + 30, TFT_BLUE); // draw triangle if group number 1
        break;
      case 2: 
        tft.fillRect(CenterX - 40, CenterY - 20, 80, 40, TFT_GREEN); // draw rectangle if group number 2
        break;
      default: 
        tft.fillCircle(CenterX, CenterY, 30, shapeColor);
        break;
    }

    delay(3000); // ping server every 3 seconds to update information
  } else { 
    // we do not have a valid id; wait and ping server every 3 seconds to update any valid id. Else, just draw the device id
    tft.drawCentreString("Device ID:", 170, 60, 4);
    tft.drawCentreString(device_id, 170, 100, 4);

    delay(3000); // ping server every 3 seconds to update whether we have a valid id or not
  }
}

// TFT Pin check
#if PIN_LCD_WR != TFT_WR || PIN_LCD_RD != TFT_RD || PIN_LCD_CS != TFT_CS ||    \
    PIN_LCD_DC != TFT_DC || PIN_LCD_RES != TFT_RST || PIN_LCD_D0 != TFT_D0 ||  \
    PIN_LCD_D1 != TFT_D1 || PIN_LCD_D2 != TFT_D2 || PIN_LCD_D3 != TFT_D3 ||    \
    PIN_LCD_D4 != TFT_D4 || PIN_LCD_D5 != TFT_D5 || PIN_LCD_D6 != TFT_D6 ||    \
    PIN_LCD_D7 != TFT_D7 || PIN_LCD_BL != TFT_BL ||                            \
    TFT_BACKLIGHT_ON != HIGH || 170 != TFT_WIDTH || 320 != TFT_HEIGHT
#error                                                                         \
    "Error! Please make sure <User_Setups/Setup206_LilyGo_T_Display_S3.h> is selected in <TFT_eSPI/User_Setup_Select.h>"
#error                                                                         \
    "Error! Please make sure <User_Setups/Setup206_LilyGo_T_Display_S3.h> is selected in <TFT_eSPI/User_Setup_Select.h>"
#error                                                                         \
    "Error! Please make sure <User_Setups/Setup206_LilyGo_T_Display_S3.h> is selected in <TFT_eSPI/User_Setup_Select.h>"
#error                                                                         \
    "Error! Please make sure <User_Setups/Setup206_LilyGo_T_Display_S3.h> is selected in <TFT_eSPI/User_Setup_Select.h>"
#endif

#if ESP_IDF_VERSION >= ESP_IDF_VERSION_VAL(5, 0, 0)
#error                                                                         \
    "The current version is not supported for the time being, please use a version below Arduino ESP32 3.0"
#endif

// /*
//   Rui Santos
//   Complete project details at Complete project details at
//   https://RandomNerdTutorials.com/esp32-http-get-post-arduino/

//   Permission is hereby granted, free of charge, to any person obtaining a
//   copy of this software and associated documentation files.

//   The above copyright notice and this permission notice shall be included in
//   all copies or substantial portions of the Software.
// */
// // ESP32 open server on port 10000 to receive a flaot


