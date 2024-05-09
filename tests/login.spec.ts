import { test, expect } from '@playwright/test';

test.describe('User login to Demobank', () => {
  const userId = 'testerLO';
  const userPassword = '12345678';
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  })

  test('successful login with correct credentials', async ({ page }) => {
    // Arrange
    const expectedUserName = 'Jan Demobankowy';

    // Act
    await page.getByTestId('login-input').fill(userId);
    await page.getByTestId('password-input').fill(userPassword);
    await page.getByTestId('login-button').click();

    // Assert
    await expect(page.getByTestId('user-name')).toHaveText(expectedUserName);
  });

  test('unsuccessful login with too short username', async ({ page }) => {
    // Arrange
    const wrongUserId = 'tester';

    // Act
    await page.getByTestId('login-input').fill(wrongUserId);
    await page.getByTestId('password-input').click();

    // Assert
    await expect(page.getByTestId('error-login-id')).toHaveText('identyfikator ma min. 8 znaków');
  });

  test('unsuccessful login with too short password', async ({ page }) => {
    // Arrange
    const wrongUserPassword = '123';

    // Act
    await page.getByTestId('login-input').fill(userId);
    await page.getByTestId('password-input').fill(wrongUserPassword);
    await page.getByTestId('password-input').blur();

    // Assert
    await expect(page.getByTestId('error-login-password')).toHaveText('hasło ma min. 8 znaków');
  });
});
