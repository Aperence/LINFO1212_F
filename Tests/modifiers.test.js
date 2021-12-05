require('chromedriver');

const {Builder,By,Key,Util,  until} = require('selenium-webdriver');
const script = require('jest');
const { beforeAll } = require('@jest/globals');
const assert = require("assert")
var MongoClient = require('mongodb').MongoClient
 
var url = "https://localhost:8080/modif"
var url_append = "https://localhost:8080/tools/append"
var url_clear = "https://localhost:8080/tools/clear"
var listHour = ["00:00", "08:00", "16:00"]


describe('Execute tests on modifs pages', () => {
  let driver;

  beforeAll(async () => {    
    driver = new Builder().forBrowser("chrome").build();   // connecter en admin
    await driver.get( url + "/staffmodif");
    await driver.findElement(By.id("details-button")).click()   //accepte les danger HTTPS
    await driver.findElement(By.id("proceed-link")).click()
    await driver.get(url_clear)
    await driver.get(url_append)
    
    return true
  }, 10000);
 
  afterAll(async () => {
    await driver.quit();
  }, 15000);

  jest.setTimeout(300000)
  

  test("Vérifie que l'on ne peut soumettre sans avoir rempli le nom (employé)", async () => {
    await driver.get( url + "/staffmodif?name=Georges");
    var Hourindex = 0
    await driver.wait( async ()=>{
      try{
        let selection = driver.findElement(By.id("nameSelection" + listHour[Hourindex]));
        await selection.click()
        selection.sendKeys(Key.ARROW_DOWN)
        return true
      }
      catch{
        Hourindex++;
        Hourindex = Hourindex%3
        return false
      }
    }, 20000, 'Timed out after 20 seconds', 2000)
    await driver.wait( async () =>{
      try{
        var submit = await driver.findElement(By.css(".submitButton"))
        await submit.click()
        await driver.switchTo().alert().dismiss()
        return true
      }catch{
        return false
      }

    }, 10000, 'Timed out after 10 seconds', 1000)
    urlDestination = await driver.getCurrentUrl()
    expect(urlDestination).toContain(url + "/staffmodif?name=Georges")
  });


  test("Vérifie que l'on ne peut soumettre sans avoir rempli la tâche (employé)", async () => {
    await driver.get( url + "/staffmodif?name=Georges");
    var Hourindex = 0
    await driver.wait( async ()=>{
      try{
        let selection = driver.findElement(By.id("taskList" +  listHour[Hourindex]));
        await selection.click()
        selection.sendKeys(Key.ARROW_DOWN)
        return true
      }
      catch{
        Hourindex++
        Hourindex = Hourindex%3
        return false
      }
    }, 20000, 'Timed out after 20 seconds', 2000)
    await driver.wait( async () =>{
      try{
        var submit = await driver.findElement(By.css(".submitButton"))
        await submit.click()
        await driver.switchTo().alert().dismiss()
        return true
      }catch{
        return false
      }

    }, 10000, 'Timed out after 10 seconds', 1000)
    urlDestination = await driver.getCurrentUrl()
    expect(urlDestination).toContain(url + "/staffmodif?name=Georges")
  });

  test("Vérifie que l'on peut soumettre et que la tâche est ajoutée à Timetable (employé)", async () => {
    await driver.get( url + "/staffmodif?name=Georges");

    //choisi un animal
    var Hourindex = 0
    await driver.wait( async ()=>{
      try{
        let selection = driver.findElement(By.id("nameSelection" + listHour[Hourindex]));
        await selection.click()
        selection.sendKeys(Key.ARROW_DOWN)  
        return true
      }
      catch{
        Hourindex++
        Hourindex = Hourindex%3
        return false
      }
    }, 20000, 'Timed out after 20 seconds', 2000)

    //choisi une tâche
    await driver.wait( async ()=>{
      try{
        let selection = driver.findElement(By.id("taskList" + listHour[Hourindex]));
        await selection.click()
        selection.sendKeys(Key.ARROW_DOWN)
        return true
      }
      catch{
        return false
      }
    }, 20000, 'Timed out after 20 seconds', 2000)
    //envoie la requête
    await driver.wait( async () =>{
      try{
        var submit = await driver.findElement(By.css(".submitButton"))
        await submit.click()
        return true
      }catch{
        return false
      }

    }, 10000, 'Timed out after 20 seconds', 1000)
    urlDestination = await driver.getCurrentUrl()
    expect(urlDestination).toContain(url + "/staffmodif?name=Georges")
    await driver.wait( async ()=>{
      MongoClient.connect("mongodb://localhost:27017",(err,db)=>{
          db.db('site').collection("timetable").find({time : "05:30"}).toArray((err,doc)=>{
            assert(doc.length>0,"Requête non aboutie : l'objet n'a pas été ajouté")
          })
      })
      return true
    }, 10000, "Requête non aboutie : l'objet n'a pas été ajouté", 5000)


    //vérifie que ajouté à la DB
  });


  test("Vérifie que l'on ne peut soumettre sans avoir rempli le nom (animal)", async () => {
    await driver.get( url + "/animalmodif?name=Lion");
    await driver.wait( async ()=>{
      try{
        let selection = driver.findElement(By.id("nameSelection04:30"));
        await selection.click()
        selection.sendKeys(Key.ARROW_DOWN)
        return true
      }
      catch{
        return false
      }
    }, 20000, 'Timed out after 20 seconds', 2000)
    await driver.wait( async () =>{
      try{
        var submit = await driver.findElement(By.css(".submitButton"))
        await submit.click()
        await driver.switchTo().alert().dismiss()
        return true
      }catch{
        return false
      }

    }, 10000, 'Timed out after 10 seconds', 1000)
    urlDestination = await driver.getCurrentUrl()
    expect(urlDestination).toContain(url + "/animalmodif?name=Lion")
  });

  test("Vérifie que l'on ne peut soumettre sans avoir rempli la tâche (animal)", async () => {
    await driver.get( url + "/animalmodif?name=Lion");
    await driver.wait( async ()=>{
      try{
        let selection = driver.findElement(By.id("taskList05:30"));
        await selection.click()
        selection.sendKeys(Key.ARROW_DOWN)
        return true
      }
      catch{
        return false
      }
    }, 20000, 'Timed out after 20 seconds', 2000)
    await driver.wait( async () =>{
      try{
        var submit = await driver.findElement(By.css(".submitButton"))
        await submit.click()
        await driver.switchTo().alert().dismiss()
        return true
      }catch{
        return false
      }

    }, 10000, 'Timed out after 10 seconds', 1000)
    urlDestination = await driver.getCurrentUrl()
    expect(urlDestination).toContain(url + "/animalmodif?name=Lion")
  });


  test("Vérifie que l'on peut soumettre et que la tâche est ajoutée à Timetable (animal)", async () => {
    await driver.get( url + "/animalmodif?name=Lion");

    //choisi un employé
    await driver.wait( async ()=>{
      try{
        let selection = driver.findElement(By.id("taskList07:30"));
        await selection.click()
        selection.sendKeys(Key.ARROW_DOWN)  
        return true
      }
      catch{
        return false
      }
    }, 20000, 'Timed out after 20 seconds', 2000)

    //choisi une tâche
    await driver.wait( async ()=>{
      try{
        let selection = driver.findElement(By.id("nameSelection07:30"));
        await selection.click()
        selection.sendKeys(Key.ARROW_DOWN)
        return true
      }
      catch{
        return false
      }
    }, 20000, 'Timed out after 20 seconds', 2000)

    //envoie la requête
    await driver.wait( async () =>{
      try{
        var submit = await driver.findElement(By.css(".submitButton"))
        await submit.click()
        return true
      }catch{
        return false
      }

    }, 10000, 'Timed out after 10 seconds', 1000)
    urlDestination = await driver.getCurrentUrl()
    expect(urlDestination).toContain(url + "/animalmodif?name=Lion")
    await driver.wait( async ()=>{
      MongoClient.connect("mongodb://localhost:27017",(err,db)=>{
          db.db('site').collection("timetable").find({time : "07:30"}).toArray((err,doc)=>{
            assert(doc.length>0, "Requête non aboutie : l'objet n'a pas été ajouté")
          })
      })
      return true
    }, 10000, "Requête non aboutie : l'objet n'a pas été ajouté", 5000)
  });
});
