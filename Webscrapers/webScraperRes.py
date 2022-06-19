import urllib.request
import time
import requests
from bs4 import BeautifulSoup 
import mysql.connector
from mysql.connector import Error



try:
    connection = mysql.connector.connect(host="dragon.kent.ac.uk",
                                         database='ii53',
                                         user='ii53',
                                         password="pacha%u")
    if connection.is_connected():
        db_Info = connection.get_server_info()
        print("Connected to MySQL Server version ", db_Info)

        mySql_Drop_Table= """DROP TABLE IF EXISTS Restaurants"""

        mySql_Create_Table_Query = """CREATE TABLE Restaurants (Id int(8) NOT NULL AUTO_INCREMENT,                                 
                                                                Name varchar(250) NOT NULL,
                                                                Menu varchar(250) NOT NULL,
                                                                Locations varchar(250) NOT NULL,  
                                                                PRIMARY KEY(Id))"""

        cursor = connection.cursor()
        cursor.execute("select database();")
        record = cursor.fetchone()
        cursor.execute(mySql_Drop_Table)
        cursor.execute(mySql_Create_Table_Query)
        print("You're connected to database: ", record)
        print("Restaurants Table created successfully ")

      

except Error as e:
    print("Error while connecting to MySQL", e)


# def insert_menu(menus):
#     query = "INSERT INTO Restaurants(Name,Menu) " \
#             "VALUES(%s,%s)"
#     cursor.execute(query, menus)


page_url = 'https://www.kent.ac.uk/catering/canterbury' #CHANGE THIS
response  = requests.get(page_url)

soup = BeautifulSoup(response.text, "html.parser")

links = soup.findAll('a', {'class' : 'card card--flexible'})

for link in links:
    href = link['href']
    res = requests.get(href)
    soup2= BeautifulSoup(res.text , "html.parser")

    menue = soup2.findAll('a', {'class' : 'document-list__link'})
    location = soup2.findAll('div', {'class' : 'lead'})[0].text
    for i in menue:      
        href2 = i['href']
        if "information" in href2:
           continue
        title = soup2.findAll('h1', {'id' : "page-title"})[0].text
        
        query = "INSERT INTO Restaurants(Name,Menu,Locations) VALUES(%s,%s,%s)"
        cursor.execute(query,(title,href2,location))
        time.sleep(1)
     



connection.commit()
cursor.close()
connection.close()
print("MySQL connection is closed")