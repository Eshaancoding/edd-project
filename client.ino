#include <TFT_eSPI.h> // Graphics and font library for ST7735 driver chip
#include <SPI.h>
#include "WiFi.h"
#include "HTTPClient.h"
#include "WiFiClient.h"
#include "Audio.h"
#include "pin_config.h"

#define PIN_PCM5102A_DIN 43
#define PIN_PCM5102A_BCLK 44
#define PIN_PCM5102A_LRCLK 18

String ssid = "eshaan";
String password = "765ESHAAN";

String first = "Harrison";
String second = "Eshaan";

Audio audio;

TFT_eSPI tft = TFT_eSPI();  // Invoke library, pins defined in User_Setup.h

void setup(void)
{
    Serial.begin(115200);

    pinMode(PIN_POWER_ON, OUTPUT);
    digitalWrite(PIN_POWER_ON, HIGH);

    tft.init();
    tft.setRotation(1);
    tft.fillScreen(TFT_BLACK);

    WiFi.disconnect();
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid.c_str(), password.c_str());
    delay(2000);
    int tries = 1;
    while (WiFi.status() != WL_CONNECTED) {
        std::string msg = "#";
        msg += std::to_string(tries);
        msg += " Wifi Connection Failed. Retrying...";

        tft.fillScreen(TFT_BLACK);
        tft.drawCentreString(msg.c_str(), 180, 60, 2); 
        delay(1000);
        
        tries += 1;
    }

    tft.fillScreen(TFT_BLACK);
    tft.println("Wifi Successfully Connected.");

    getPeople();
}

String getPayload(const char* url) {
  HTTPClient http;
  String payload = "";

  if (WiFi.status() == WL_CONNECTED) {
    http.begin(url);             // Initialize the HTTP request
    int httpCode = http.GET();    // Send the GET request

    if (httpCode > 0) {           // Check for successful response
      payload = http.getString(); // Get the payload as a string
    } else {
      Serial.print("Error on HTTP request: ");
      Serial.println(httpCode);
    }

        http.end(); // Close the connection
  } else {
    Serial.println("Wi-Fi disconnected");
  }

  return payload; // Return the response payload
}

void drawPeople () {
    tft.fillScreen(TFT_BLACK);
    tft.setTextColor(TFT_WHITE, TFT_WHITE); // Do not plot the background colour
    tft.drawCentreString(first.c_str(), 180, 60, 4); 
    tft.drawCentreString(second.c_str(), 180, 100, 4);
}

void loop()
{
    drawPeople();
    
    first = getPayload("http://172.20.10.3:8765/");
    second = getPayload("http://172.20.10.3:8765/test-name");

    delay(1000);
}


// TFT Pin check
#if PIN_LCD_WR  != TFT_WR || \
    PIN_LCD_RD  != TFT_RD || \
    PIN_LCD_CS    != TFT_CS   || \
    PIN_LCD_DC    != TFT_DC   || \
    PIN_LCD_RES   != TFT_RST  || \
    PIN_LCD_D0   != TFT_D0  || \
    PIN_LCD_D1   != TFT_D1  || \
    PIN_LCD_D2   != TFT_D2  || \
    PIN_LCD_D3   != TFT_D3  || \
    PIN_LCD_D4   != TFT_D4  || \
    PIN_LCD_D5   != TFT_D5  || \
    PIN_LCD_D6   != TFT_D6  || \
    PIN_LCD_D7   != TFT_D7  || \
    PIN_LCD_BL   != TFT_BL  || \
    TFT_BACKLIGHT_ON   != HIGH  || \
    170   != TFT_WIDTH  || \
    320   != TFT_HEIGHT
#error  "Error! Please make sure <User_Setups/Setup206_LilyGo_T_Display_S3.h> is selected in <TFT_eSPI/User_Setup_Select.h>"
#error  "Error! Please make sure <User_Setups/Setup206_LilyGo_T_Display_S3.h> is selected in <TFT_eSPI/User_Setup_Select.h>"
#error  "Error! Please make sure <User_Setups/Setup206_LilyGo_T_Display_S3.h> is selected in <TFT_eSPI/User_Setup_Select.h>"
#error  "Error! Please make sure <User_Setups/Setup206_LilyGo_T_Display_S3.h> is selected in <TFT_eSPI/User_Setup_Select.h>"
#endif

#if ESP_IDF_VERSION >= ESP_IDF_VERSION_VAL(5,0,0)
#error  "The current version is not supported for the time being, please use a version below Arduino ESP32 3.0"
#endif

// /*
//   Rui Santos
//   Complete project details at Complete project details at https://RandomNerdTutorials.com/esp32-http-get-post-arduino/

//   Permission is hereby granted, free of charge, to any person obtaining a copy
//   of this software and associated documentation files.

//   The above copyright notice and this permission notice shall be included in all
//   copies or substantial portions of the Software.
// */
// // ESP32 open server on port 10000 to receive a flaot

