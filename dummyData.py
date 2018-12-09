import json
import random
import urllib.request

def main():
    url = "127.0.0.1:3000"
    body = generateData()
    postData(url,body)

def generateData():
    body = [
        {
          "HealthData":
          {
            "HeightData":
            {
              "DataStatus":1,
              "Height":1778
            },
            "PainData":
            {
              "DataStatus":1,
              "PainIndex":5
            },
            "WeightData":
            {
              "DataStatus":1,
              "Weight":68084
            },
            "BMIData":
            {
              "BodyMassIndex":22.0,
              "Height":1778,
              "Weight":68084,
              "DataStatus":1
            },
            "HeartRateData":
            {
              "DataStatus":1,
              "BestHr":true,
              "Hr":79,
              "Source":3
            },
            "NibpData":
            {
              "DataStatus":1,
              "Systolic":13182,
              "Diastolic":7328,
              "Map":9279,
              "HR":76,
              "Modifiers": [
                {"Name":"CuffLocation","Value":0},
                {"Name":"CuffSize","Value":0},
                {"Name":"PatientPosition","Value":0}
              ]
            },
            "PatientData":
            {
              "DataStatus":1,
              "FirstName":null,
              "LastName":"John Doe",
              "MiddleName":null,
              "FullName":"John Doe",
              "Number":""
            },
            "SessionData":
            {
              "SessionDate":"2018-11-26T09:20:39"
            },
            "Spo2Data":
            {
              "DataStatus":1,"Sat":96,"HR":79,
              "Modifiers": [
                {"Name":"Location","Value":0},
                {"Name":"O2Method","Value":0},
                {"Name":"O2FlowRate","Value":0}
              ]
            },
            "TemperatureData":
            {
              "DataStatus":1,"Mode":0,"Temperature":308.15
            }
          }
        }
    ]
    return body

def postData(url, body):
    req = urllib.request.Request(myurl)
    req.add_header('Content-Type', 'application/json; charset=utf-8')
    jsonData = json.dumps(body)
    jsondataasbytes = jsondata.encode('utf-8')
    req.add_header('Content-Length', len(jsondataasbytes))
    print(jsondataasbytes)
    response = urllib.request.urlopen(req, jsondataasbytes)


main()
