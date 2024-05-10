import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { loginData } from '../test-data/login.data';

test.describe('User login to Demobank', { tag: ['@login', '@smoke'] }, () => {
  let loginPage: LoginPage;

  const userId = loginData.userId;
  const userPassword = loginData.userPassword;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    loginPage = new LoginPage(page);
  });

  test('successful login with correct credentials', { tag: "@positive" }, async ({ page }) => {
    // Arrange
    const expectedUserName = 'Jan Demobankowy';
    // Act
    await loginPage.login(userId, userPassword);
    // Assert
    await expect(loginPage.userName).toHaveText(expectedUserName);
  });

  test('unsuccessful login with too short username', { tag: "@negative" }, async ({ page }) => {
    // Arrange
    const wrongUserId = 'tester';
    const expectedErrorMessage = 'identyfikator ma min. 8 znaków';
    // Act
    await loginPage.loginInput.fill(wrongUserId);
    await loginPage.passwordInput.click();
    // Assert
    await expect(loginPage.loginError).toHaveText(expectedErrorMessage);
  });

  test('unsuccessful login with too short password', { tag: "@negative" }, async ({ page }) => {
    // Arrange
    const wrongUserPassword = '123';
    const expectedErrorMessage = 'hasło ma min. 8 znaków';
    // Act
    await loginPage.loginInput.fill(userId);
    await loginPage.passwordInput.fill(wrongUserPassword);
    await loginPage.passwordInput.blur();
    // Assert
    await expect(loginPage.passwordError).toHaveText(expectedErrorMessage);
  });
});
