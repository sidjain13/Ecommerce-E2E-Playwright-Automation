// import { test, expect } from '@playwright/test';
// import MainData from "../testData/mainData.json"
// import { LoginPage } from '../pages/LoginPage';

// for(let data of MainData){
//          test(`first test ${data.loginEmail}`, async ({ page }) => {
//         // const context = await browser.newContext();
//         // const page1 = await context.newPage();
//         let loginPageObj = new LoginPage(page);

//         await loginPageObj.goto();
       
//         // LOGIN TO WEBSITE
//         await loginPageObj.setEmailInputElm(data.loginEmail);
//         await loginPageObj.setPasswordInputElm(data.loginPassword);
//         await loginPageObj.clickLoginBtnElm();

//          // WAITING FOR CARD TO BE LOADED
//         await page.locator(".card-body").first().waitFor();

//          // LOADING DATA OF THE SESSION STORAGE AND THE FILE IS CREATED CALLED State.JSON
//         await page.context().storageState({ path: data.stateFile });

//         await page.context().close();

//     });
//     }

   