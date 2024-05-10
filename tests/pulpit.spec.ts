import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { PulpitPage } from '../pages/pulpit.page';
import { loginData } from '../test-data/login.data';

test.describe('Pulpit tests', { tag: ['@pulpit', '@smoke'] }, () => {
    let pulpitPage: PulpitPage;

    const userId = loginData.userId;
    const userPassword = loginData.userPassword;

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        const loginPage = new LoginPage(page);
        await loginPage.login(userId, userPassword);

        pulpitPage = new PulpitPage(page);
    });

    test('quick payment with correct data', { tag: "@positive" }, async ({ page }) => {
        // Arrange
        const receiverId = '2';
        const transferAmount = '150';
        const transferTitle = 'pizza';
        const expectedTransferReceiver = 'Chuck Demobankowy';
        const expectedConfirmationMessage = `Przelew wykonany! ${expectedTransferReceiver} - ${transferAmount},00PLN - ${transferTitle}`;
        // Act
        await pulpitPage.executeQuickPayment(receiverId, transferAmount, transferTitle);
        // Assert
        await expect(pulpitPage.confirmationMessage).toHaveText(
            expectedConfirmationMessage);
    });

    test('successful mobile payment', { tag: "@positive" }, async ({ page }) => {
        // Arrange
        const phoneNumber = '500 xxx xxx';
        const amountOfMoney = '50';
        const expectedMessage = `Doładowanie wykonane! ${amountOfMoney},00PLN na numer ${phoneNumber}`;
        // Act
        await pulpitPage.executeMobilePayment(phoneNumber, amountOfMoney);
        // Assert
        await expect(pulpitPage.confirmationMessage).toHaveText(expectedMessage);
    });

    test('correct balance after successful mobile payment', { tag: "@positive" }, async ({ page }) => {
        // Arrange
        const phoneNumber = '500 xxx xxx';
        const amountOfMoney = '50';
        const initialBalance = await page.locator('#money_value').innerText();
        const expectedBalance = Number(initialBalance) - Number(amountOfMoney);
        // Act
        await pulpitPage.executeMobilePayment(phoneNumber, amountOfMoney);
        // Assert
        await expect(pulpitPage.moneyValue).toHaveText(`${expectedBalance}`);
    });
});
