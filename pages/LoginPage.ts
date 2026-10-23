import { expect, type Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  async goto(): Promise<void> {
    await super.goto('/web/index.php/auth/login');
  }

  get usernameInput(): Locator {
    return this.page.getByPlaceholder('Username');
  }

  get passwordInput(): Locator {
    return this.page.getByPlaceholder('Password');
  }

  get loginButton(): Locator {
    return this.page.getByRole('button', { name: 'Login' });
  }

  get errorAlert(): Locator {
    return this.page.locator('.oxd-alert-content-text');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectInvalidCredentials(): Promise<void> {
    await expect(this.errorAlert).toHaveText('Invalid credentials');
  }

  async errorForField(label: 'Username' | 'Password'): Promise<Locator> {
    return this.groupByLabel(label).locator('.oxd-input-field-error-message');
  }
}
