require('chromedriver');

const {Builder,By,Key,Util,  until} = require('selenium-webdriver');
const script = require('jest');
const { beforeAll } = require('@jest/globals');
 
var url;
  
// // declaring one test group, with common initialisation.
// describe('Execute tests on localhost', () => {

//   let driver;

//   beforeAll(async () => {    
//     driver = new Builder().forBrowser("chrome").build();
//   }, 10000);
 
//   afterAll(async () => {
//     await driver.quit();
//   }, 15000);

//   jest.setTimeout(300000)
  
//   test("Vérifie que l'on ne peut se connecter avec un mauvais mot de passe", async () => {
//     await driver.get( url );
//     await driver.findElement(By.id("details-button")).click()
//     await driver.findElement(By.id("proceed-link")).click()
    
//     await driver.findElement( By.css(".username-container")).click();
//     await driver.findElement ( By.css (".second")).sendKeys ( "Aperence", Key.TAB)
//     await driver.findElement ( By.name ("inscmdp")).sendKeys ( "test", Key.TAB)
//     await driver.findElement ( By.name ("confmdp")).sendKeys ( "test", Key.RETURN)
//     try{
//         await driver.switchTo().alert().dismiss();    // si on a déjà ce nom dans la base de donnée
//         console.warn("Nom d'utilisateur déjà utilisé")
//     }catch{
//         await driver.findElement(By.css(".username-container")).click();
//         await driver.findElement(By.css(".link-report")).click();
//         console.warn("Nom d'utilisateur créé")
//     }
//     await driver.findElement ( By.css (".first")).sendKeys ( "Aperence", Key.TAB)
    
//     await driver.findElement ( By.id ("connmdp")).sendKeys ( "test2", Key.ENTER)
//     await driver.switchTo().alert().dismiss();
//     let urlDestination = await driver.getCurrentUrl()
//     console.log(urlDestination)
//     expect(urlDestination).toContain(url + "/log.html")

//     await driver.findElement ( By.css (".first")).sendKeys ( "Aperence", Key.TAB)
    
//     await driver.findElement ( By.id ("connmdp")).sendKeys ( "test", Key.ENTER)

//     urlDestination = await driver.getCurrentUrl()

//     expect(urlDestination).toContain(url + "/display.html")
//     //await driver.wait(false, 300000, 'Timed out after 30 seconds', 5000)

//   });
// });