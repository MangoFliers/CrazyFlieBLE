#include <math.h>
const int ledPin=2;                 //Connect the LED Grove module to Pin2, Digital 2
const int thresholdvalue=10;         //The threshold for which the LED should turn on. 
float Rsensor; //Resistance of sensor in K
void setup() {
  Serial.begin(9600);                //Start the Serial connection
  pinMode(ledPin,OUTPUT);            //Set the LED on Digital 12 as an OUTPUT
}
void loop() {
  
  
  int sensorValues[10];
  
  
//  for(int i = 0; i < 10; i++){
//    sensorValues[i] = analogRead(0);
//    Serial.println(analogRead(0));
//    delay(10);
//  }

  int sensorValue =  analogRead(0); // = average(sensorValues, 10);
  
  Rsensor=(float)(1023-sensorValue)*10/sensorValue;
  if(Rsensor>thresholdvalue)
  {
    digitalWrite(ledPin,HIGH);
  }
  else
  {
    digitalWrite(ledPin,LOW);
  }
  Serial.print("the analog read data is ");
  Serial.println(sensorValue);
  Serial.print("the sensor resistance is ");
  Serial.println(Rsensor,DEC);  //show the light intensity on the serial monitor;
}


int average(int* sensorValues, int size){
  int sum = 0;
  for(int i = 0; i < size; i++){
    sum += sensorValues[i];
  }

  return sum / size;
}

