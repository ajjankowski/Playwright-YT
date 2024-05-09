import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';

test.describe('Pulpit tests', () => {
    const userId = loginData.userId;
    const userPassword = loginData.userPassword;

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.getByTestId('login-input').fill(userId);
        await page.getByTestId('password-input').fill(userPassword);
        await page.getByTestId('login-button').click();
    })

    test('quick payment with correct data', async ({ page }) => {
        // Arrange
        const receiverId = '2';
        const transferAmount = '150';
        const transferTitle = 'pizza';
        const expectedTransferReceiver = 'Chuck Demobankowy';

        // Act
        await page.locator('#widget_1_transfer_receiver').selectOption(receiverId);
        await page.locator('#widget_1_transfer_amount').fill(transferAmount);
        await page.locator('#widget_1_transfer_title').fill(transferTitle);
        await page.locator('#execute_btn').click();
        await page.getByTestId('close-button').click();

        // Assert
        await expect(page.locator('#show_messages')).toHaveText(
            `Przelew wykonany! ${expectedTransferReceiver} - ${transferAmount},00PLN - ${transferTitle}`);
    });

    test('successful mobile top-up', async ({ page }) => {
        // Arrange
        const phoneNumber = '500 xxx xxx';
        const amountOfMoney = '50';

        // Act
        await page.locator('#widget_1_topup_receiver').selectOption(phoneNumber);
        await page.locator('#widget_1_topup_amount').fill(amountOfMoney);
        await page.locator('#widget_1_topup_agreement').click();
        await page.getByRole('button', { name: 'doładuj telefon' }).click();
        await page.getByTestId('close-button').click();

        // Assert
        await expect(page.locator('#show_messages')).toHaveText(`Doładowanie wykonane! ${amountOfMoney},00PLN na numer ${phoneNumber}`);
    });

    test('correct balance after successful mobile top-up', async ({ page }) => {
        // Arrange
        const phoneNumber = '500 xxx xxx';
        const amountOfMoney = '50';
        const expectedMessage = `Doładowanie wykonane! ${amountOfMoney},00PLN na numer ${phoneNumber}`;
        const initialBalance = await page.locator('#money_value').innerText();
        const expectedBalance = Number(initialBalance) - Number(amountOfMoney);

        // Act
        await page.locator('#widget_1_topup_receiver').selectOption(phoneNumber);
        await page.locator('#widget_1_topup_amount').fill(amountOfMoney);
        await page.locator('#widget_1_topup_agreement').click();
        await page.getByRole('button', { name: 'doładuj telefon' }).click();
        await page.getByTestId('close-button').click();

        // Assert
        await expect(page.locator('#money_value')).toHaveText(`${expectedBalance}`);
    });
});
