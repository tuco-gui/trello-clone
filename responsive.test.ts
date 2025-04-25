import { test, expect } from '@playwright/test';

test.describe('Testes de responsividade do Trello Clone', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para a página inicial
    await page.goto('/');
  });

  test('Layout deve ser responsivo em dispositivos móveis', async ({ page }) => {
    // Configurar viewport para simular um dispositivo móvel
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    
    // Verificar se o título da página está correto
    await expect(page).toHaveTitle(/Trello Clone/);
    
    // Verificar se os elementos principais estão presentes e adaptados
    await expect(page.locator('h1')).toContainText('Bem-vindo ao Trello Clone');
    await expect(page.getByRole('link', { name: 'Entrar' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Criar conta' })).toBeVisible();
    
    // Verificar se os botões estão empilhados em dispositivos móveis
    const entrarButton = page.getByRole('link', { name: 'Entrar' });
    const criarContaButton = page.getByRole('link', { name: 'Criar conta' });
    
    const entrarBox = await entrarButton.boundingBox();
    const criarContaBox = await criarContaButton.boundingBox();
    
    // Em dispositivos móveis, os botões devem estar empilhados (um abaixo do outro)
    expect(entrarBox.y + entrarBox.height <= criarContaBox.y).toBeTruthy();
  });

  test('Layout deve ser responsivo em tablets', async ({ page }) => {
    // Configurar viewport para simular um tablet
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    
    // Fazer login e navegar para um quadro
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByLabel('Senha').fill('senha123');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await page.goto('/boards');
    
    // Verificar se o layout de quadros está em grade
    const quadros = page.locator('.grid');
    await expect(quadros).toBeVisible();
    
    // Verificar se há pelo menos 2 quadros por linha
    const gridComputedStyle = await quadros.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('grid-template-columns');
    });
    
    // Deve ter pelo menos 2 colunas no grid
    expect(gridComputedStyle.split(' ').length).toBeGreaterThanOrEqual(2);
  });

  test('Layout deve ser responsivo em desktops', async ({ page }) => {
    // Configurar viewport para simular um desktop
    await page.setViewportSize({ width: 1280, height: 800 });
    
    // Fazer login e navegar para um quadro
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByLabel('Senha').fill('senha123');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await page.goto('/board/1');
    
    // Verificar se as listas estão lado a lado
    const listas = page.locator('.flex');
    await expect(listas).toBeVisible();
    
    // Verificar se o layout horizontal está funcionando
    const listaComputedStyle = await listas.evaluate((el) => {
      return window.getComputedStyle(el).getPropertyValue('flex-direction');
    });
    
    // Em desktop, as listas devem estar em linha (row)
    expect(listaComputedStyle).toBe('row');
  });
});
