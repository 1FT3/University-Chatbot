from urllib.request import urlopen as uReq
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from bs4 import BeautifulSoup as soup

DRIVER_PATH = '.\chromedriver.exe'
service = Service(DRIVER_PATH)
driver = webdriver.Chrome(service=service)

page_url = 'https://www.fatsoma.com/p/clubcanterbury' #CHANGE THIS

driver.get(page_url)
pageSource = driver.page_source
driver.quit()
club = "Chemistry"
page_soup = soup(pageSource, 'html.parser')

outfile = "clubDetails" + club + ".csv"
headers = "ID,Club,Title,Time,Price\n"
f = open(outfile, 'w')
f.write(headers)

eventDiv = page_soup.findAll('div', {"class": "_content_xz4oby"})
id = 0
for event in eventDiv:
    title = event.h3.a.text
    time = event.div.span.text
    price = event.findAll('div', {"class": "_price_xz4oby"})[0].text
    try:
        f.write(str(id) + ","+ club + "," + title.replace("\n", "") + "," + time.replace("\n", "") + "," + price.replace("\n", "") + "\n")
        id = id + 1
    except:
        next
f.close()
