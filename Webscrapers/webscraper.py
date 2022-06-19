from urllib.request import urlopen as uReq
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup as soup

DRIVER_PATH = '.\chromedriver.exe'
service = Service(DRIVER_PATH)
driver = webdriver.Chrome(service=service)
schools = ["computing", "law", "mathematics-statistics-actuarial-science", "biosciences", "physical-sciences", "psychology", "economics"]
school = "economics"
page_url = 'https://www.kent.ac.uk/'+ school +'/people'

driver.get(page_url)
pageSource = driver.page_source
driver.quit()

page_soup = soup(pageSource, 'html.parser')

outfile = "contactDeets" + school + ".csv"
headers = "ID,Name,Email,Location\n"
f = open(outfile, 'w')
f.write(headers)

links = page_soup.findAll('a', {"class": "card card--backed card--colour-white card--horizontal card--profile u-chevron"})

email = ''
location = ''
id = 0
for link in links:
    uClient = uReq(link['href'])
    link_soup = soup(uClient.read(), 'html.parser')
    contactInfo = link_soup.findAll('li', {"class":"info-sidebar__item"})
    name = link_soup.findAll('h1', {"class":"profile__title"})[0].text
    email = contactInfo[0].a.text
    try:
        location = contactInfo[2].pre.text
    except:
        try:
            location = contactInfo[1].pre.text
        except:
            location = "No location"
    
    try:
        f.write(str(id) + "," + name + "," + email + "," + location.replace(",", "|").replace("\n", "|") + "\n")
        id = id + 1
    except:
        next

uClient.close()
f.close()