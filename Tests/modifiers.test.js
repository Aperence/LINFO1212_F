require('chromedriver');

const {Builder,By,Key,Util,  until} = require('selenium-webdriver');
const script = require('jest');
const { beforeAll } = require('@jest/globals');
 
var url = "https://localhost:8080/modif"

describe('Execute tests on modifs pages', () => {
  let driver;

  beforeAll(async () => {    
    driver = new Builder().forBrowser("chrome").build();   // connecter en admin
  }, 10000);
 
  afterAll(async () => {
    await driver.quit();
  }, 15000);

  jest.setTimeout(300000)
  
  test("Vérifie que l'on ne peut soumettre sans avoir choisi de nom si on est un Admin (employé)", async () => {
    await driver.get( url + "/staffmodif");
    await driver.findElement(By.id("details-button")).click()   //accepte les danger HTTPS
    await driver.findElement(By.id("proceed-link")).click()
    await driver.wait(async ()=>{
      try{
        var submit = await driver.findElement(By.css(".submitButton"))
        await submit.click()
        await driver.switchTo().alert().dismiss()
        return true
      }catch{           //pas d'alerte => fonctionne pas
        return false
      }
    }, 10000, 'Timed out after 10 seconds', 1000)
    ;   //nom manquant
    urlDestination = await driver.getCurrentUrl()
    expect(urlDestination).toContain(url + "/staffmodif")

  });


  test("Vérifie que l'on ne peut soumettre sans avoir choisi de nom si on est un Admin (animal)", async () => {
    await driver.get( url + "/animalmodif");
    await driver.wait(async ()=>{
      try{
        var submit = await driver.findElement(By.css(".submitButton"))
        await submit.click()
        await driver.switchTo().alert().dismiss()
        return true
      }catch{           //pas d'alerte => fonctionne pas
        return false
      }
    }, 10000, 'Timed out after 10 seconds', 1000)
    ;   //nom manquant
    urlDestination = await driver.getCurrentUrl()
    expect(urlDestination).toContain(url + "/animalmodif")

  });


  test("Vérifie que l'on ne peut soumettre sans avoir rempli le nom (employé)", async () => {
    await driver.get( url + "/staffmodif?name=Georges");
    await driver.wait( async ()=>{
      try{
        let selection = driver.findElement(By.id("nameSelection02:00"));
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

    }, 10000, 'Timed out after 20 seconds', 1000)
    urlDestination = await driver.getCurrentUrl()
    expect(urlDestination).toContain(url + "/staffmodif?name=Georges")
  });


  test("Vérifie que l'on ne peut soumettre sans avoir rempli la tâche (employé)", async () => {
    await driver.get( url + "/staffmodif?name=Georges");
    await driver.wait( async ()=>{
      try{
        let selection = driver.findElement(By.id("taskList22:00"));
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

    }, 10000, 'Timed out after 20 seconds', 1000)
    urlDestination = await driver.getCurrentUrl()
    expect(urlDestination).toContain(url + "/staffmodif?name=Georges")
  });

  test("Vérifie que l'on peut soumettre et que la tâche est ajoutée à Timetable (employé)", async () => {
    await driver.get( url + "/staffmodif?name=Georges");

    //choisi un animal
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

    //choisi une tâche
    await driver.wait( async ()=>{
      try{
        let selection = driver.findElement(By.id("nameSelection05:30"));
        await selection.click()
        selection.sendKeys(Key.ARROW_DOWN)
        return true
      }
      catch{
        return false
      }
    }, 20000, 'Timed out after 20 seconds', 2000)

    //envoie la requête
    driver.sendKeys(Key.ENTER)
    urlDestination = await driver.getCurrentUrl()
    expect(urlDestination).toContain(url + "/animalmodif?name=test")

    //vérifie que ajouté à la DB
  });


  test("Vérifie que l'on ne peut soumettre sans avoir rempli le nom (animal)", async () => {
    await driver.get( url + "/animalmodif?name=test");
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

    }, 10000, 'Timed out after 20 seconds', 1000)
    urlDestination = await driver.getCurrentUrl()
    expect(urlDestination).toContain(url + "/animalmodif?name=test")
  });

  test("Vérifie que l'on ne peut soumettre sans avoir rempli la tâche (animal)", async () => {
    await driver.get( url + "/animalmodif?name=test");
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

    }, 10000, 'Timed out after 20 seconds', 1000)
    urlDestination = await driver.getCurrentUrl()
    expect(urlDestination).toContain(url + "/animalmodif?name=test")
  });


  test("Vérifie que l'on peut soumettre et que la tâche est ajoutée à Timetable (animal)", async () => {
    await driver.get( url + "/animalmodif?name=test");

    //choisi un employé
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

    //choisi une tâche
    await driver.wait( async ()=>{
      try{
        let selection = driver.findElement(By.id("nameSelection05:30"));
        await selection.click()
        selection.sendKeys(Key.ARROW_DOWN)
        return true
      }
      catch{
        return false
      }
    }, 20000, 'Timed out after 20 seconds', 2000)

    //envoie la requête
    driver.sendKeys(Key.ENTER)
    urlDestination = await driver.getCurrentUrl()
    expect(urlDestination).toContain(url + "/animalmodif?name=test")

    //vérifie que ajouté à la DB
  });
});
