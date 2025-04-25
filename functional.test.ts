import { test, expect } from '@playwright/test';

test.describe('Testes de funcionalidade do Trello Clone', () => {
  test.beforeEach(async ({ page }) => {
    // Navegar para a página inicial
    await page.goto('/');
  });

  test('Página inicial deve carregar corretamente', async ({ page }) => {
    // Verificar se o título da página está correto
    await expect(page).toHaveTitle(/Trello Clone/);
    
    // Verificar se os elementos principais estão presentes
    await expect(page.locator('h1')).toContainText('Bem-vindo ao Trello Clone');
    await expect(page.getByRole('link', { name: 'Entrar' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Criar conta' })).toBeVisible();
  });

  test('Fluxo de autenticação deve funcionar', async ({ page }) => {
    // Clicar no botão de login
    await page.getByRole('link', { name: 'Entrar' }).click();
    
    // Verificar se estamos na página de login
    await expect(page).toHaveURL(/login/);
    
    // Preencher o formulário de login
    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByLabel('Senha').fill('senha123');
    
    // Enviar o formulário
    await page.getByRole('button', { name: 'Entrar' }).click();
    
    // Verificar se fomos redirecionados para a página de quadros
    await expect(page).toHaveURL(/boards/);
    
    // Verificar se os elementos do dashboard estão presentes
    await expect(page.locator('h1')).toContainText('Meus Quadros');
  });

  test('Deve ser possível criar um novo quadro', async ({ page }) => {
    // Fazer login primeiro
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByLabel('Senha').fill('senha123');
    await page.getByRole('button', { name: 'Entrar' }).click();
    
    // Verificar se estamos na página de quadros
    await expect(page).toHaveURL(/boards/);
    
    // Clicar no botão de novo quadro
    await page.getByRole('button', { name: 'Novo Quadro' }).click();
    
    // Preencher o título do quadro (simulação)
    await page.getByLabel('Título').fill('Quadro de Teste');
    
    // Criar o quadro
    await page.getByRole('button', { name: 'Criar' }).click();
    
    // Verificar se fomos redirecionados para o novo quadro
    await expect(page).toHaveURL(/board\/\d+/);
    
    // Verificar se o título do quadro está correto
    await expect(page.locator('h1')).toContainText('Quadro de Teste');
  });

  test('Deve ser possível criar listas e cartões', async ({ page }) => {
    // Fazer login e navegar para um quadro
    await page.goto('/login');
    await page.getByLabel('Email').fill('admin@example.com');
    await page.getByLabel('Senha').fill('senha123');
    await page.getByRole('button', { name: 'Entrar' }).click();
    await page.goto('/board/1');
    
    // Adicionar uma nova lista
    await page.getByRole('button', { name: 'Adicionar outra lista' }).click();
    await page.getByPlaceholder('Digite o título da lista...').fill('Lista de Teste');
    await page.getByRole('button', { name: 'Adicionar lista' }).click();
    
    // Verificar se a lista foi criada
    await expect(page.locator('h3').last()).toContainText('Lista de Teste');
    
    // Adicionar um novo cartão
    await page.getByText('Adicionar um cartão').last().click();
    await page.getByPlaceholder('Digite o título do cartão...').fill('Cartão de Teste');
    await page.getByRole('button', { name: 'Adicionar' }).click();
    
    // Verificar se o cartão foi criado
    await expect(page.locator('.card-item').last()).toContainText('Cartão de Teste');
  });
});
