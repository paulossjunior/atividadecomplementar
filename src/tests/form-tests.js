/**
 * Casos de Teste para o Sistema de Registro de Atividades Complementares
 * Execute este arquivo no console do navegador para testar automaticamente
 */

class FormTester {
  constructor() {
    this.testResults = [];
    this.currentTest = 0;
  }

  // Utilitários para simular interações
  fillField(id, value) {
    const field = document.getElementById(id);
    if (field) {
      field.value = value;
      field.dispatchEvent(new Event('input', { bubbles: true }));
      field.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    return false;
  }

  selectOption(selectId, value) {
    const select = document.getElementById(selectId);
    if (select) {
      select.value = value;
      select.dispatchEvent(new Event('change', { bubbles: true }));
      return true;
    }
    return false;
  }

  clickButton(id) {
    const button = document.getElementById(id);
    if (button) {
      button.click();
      return true;
    }
    return false;
  }

  submitForm() {
    const form = document.getElementById('student-form');
    if (form) {
      form.dispatchEvent(new Event('submit', { bubbles: true }));
      return true;
    }
    return false;
  }

  clearForm() {
    // Limpar campos do estudante
    this.fillField('student-name', '');
    this.fillField('student-email', '');
    this.fillField('student-id', '');
    
    // Limpar atividades selecionadas
    if (window.selectedActivities) {
      window.selectedActivities = [];
      if (window.renderSelectedActivities) {
        window.renderSelectedActivities();
      }
      if (window.updatePointsSummary) {
        window.updatePointsSummary();
      }
    }
  }

  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Casos de Teste

  async testCase1_CamposObrigatoriosVazios() {
    console.log('🧪 TESTE 1: Campos obrigatórios vazios');
    
    this.clearForm();
    
    // Tentar enviar formulário vazio
    const result = this.submitForm();
    
    await this.wait(100);
    
    // Verificar se mostra erro
    const errorMsg = document.getElementById('error-message');
    const hasError = errorMsg && errorMsg.style.display !== 'none';
    
    this.logResult('Teste 1', hasError, 'Deve mostrar erro para campos vazios');
    return hasError;
  }

  async testCase2_EmailInvalido() {
    console.log('🧪 TESTE 2: Email inválido');
    
    this.clearForm();
    
    // Preencher com email inválido
    this.fillField('student-name', 'João Silva');
    this.fillField('student-email', 'email-invalido');
    this.fillField('student-id', '12345');
    
    const result = this.submitForm();
    
    await this.wait(100);
    
    const errorMsg = document.getElementById('error-message');
    const hasError = errorMsg && errorMsg.textContent.includes('email válido');
    
    this.logResult('Teste 2', hasError, 'Deve mostrar erro para email inválido');
    return hasError;
  }

  async testCase3_SemAtividades() {
    console.log('🧪 TESTE 3: Sem atividades selecionadas');
    
    this.clearForm();
    
    // Preencher dados válidos mas sem atividades
    this.fillField('student-name', 'Maria Santos');
    this.fillField('student-email', 'maria@exemplo.com');
    this.fillField('student-id', '67890');
    
    const result = this.submitForm();
    
    await this.wait(100);
    
    const errorMsg = document.getElementById('error-message');
    const hasError = errorMsg && errorMsg.textContent.includes('atividade');
    
    this.logResult('Teste 3', hasError, 'Deve mostrar erro quando não há atividades');
    return hasError;
  }

  async testCase4_AdicionarAtividade() {
    console.log('🧪 TESTE 4: Adicionar atividade');
    
    this.clearForm();
    
    // Selecionar categoria
    const categorySelected = this.selectOption('category-select', 'ensino');
    
    await this.wait(200);
    
    // Selecionar atividade
    const activitySelected = this.selectOption('activity-select', '1.1');
    
    await this.wait(200);
    
    // Preencher campos da atividade
    this.fillField('units-count', '1');
    this.fillField('activity-link', 'https://exemplo.com/comprovante.pdf');
    this.fillField('activity-comments', 'Teste de comentário');
    this.selectOption('activity-year', '2023');
    
    await this.wait(200);
    
    // Clicar em adicionar atividade
    const addClicked = this.clickButton('add-activity-btn');
    
    await this.wait(500);
    
    // Verificar se atividade foi adicionada
    const activityList = document.getElementById('selected-list');
    const hasActivity = activityList && !activityList.textContent.includes('Nenhuma atividade');
    
    this.logResult('Teste 4', hasActivity, 'Deve adicionar atividade à lista');
    return hasActivity;
  }

  async testCase5_RegistroCompleto() {
    console.log('🧪 TESTE 5: Registro completo válido');
    
    // Garantir que há pelo menos uma atividade (do teste anterior)
    await this.testCase4_AdicionarAtividade();
    
    // Preencher dados do estudante
    this.fillField('student-name', 'Pedro Oliveira');
    this.fillField('student-email', 'pedro@exemplo.com');
    this.fillField('student-id', '11111');
    
    // Limpar mensagens anteriores
    const successMsg = document.getElementById('success-message');
    const errorMsg = document.getElementById('error-message');
    if (successMsg) successMsg.style.display = 'none';
    if (errorMsg) errorMsg.style.display = 'none';
    
    const result = this.submitForm();
    
    await this.wait(1000);
    
    // Verificar se mostra sucesso
    const hasSuccess = successMsg && successMsg.style.display !== 'none';
    
    this.logResult('Teste 5', hasSuccess, 'Deve salvar registro completo com sucesso');
    return hasSuccess;
  }

  async testCase6_ValidacaoTipoComprovante() {
    console.log('🧪 TESTE 6: Validação tipo de comprovante');
    
    this.clearForm();
    
    // Selecionar categoria e atividade
    this.selectOption('category-select', 'pesquisa');
    await this.wait(200);
    this.selectOption('activity-select', '2.1');
    await this.wait(200);
    
    // Selecionar tipo upload mas não fazer upload
    const uploadRadio = document.getElementById('proof-upload');
    if (uploadRadio) {
      uploadRadio.checked = true;
      uploadRadio.dispatchEvent(new Event('change', { bubbles: true }));
    }
    
    // Preencher outros campos
    this.fillField('units-count', '2');
    this.selectOption('activity-year', '2022');
    
    // Tentar adicionar sem arquivo
    const addClicked = this.clickButton('add-activity-btn');
    
    await this.wait(200);
    
    // Deve mostrar erro sobre arquivo
    const hasError = window.lastAlert && window.lastAlert.includes('upload');
    
    this.logResult('Teste 6', hasError, 'Deve validar upload de arquivo');
    return hasError;
  }

  async testCase7_MultiplosAnos() {
    console.log('🧪 TESTE 7: Múltiplos anos para semestres');
    
    this.clearForm();
    
    // Selecionar atividade de semestre
    this.selectOption('category-select', 'ensino');
    await this.wait(200);
    this.selectOption('activity-select', '1.1'); // Monitoria (semestre)
    await this.wait(200);
    
    // Definir múltiplas unidades
    this.fillField('units-count', '3');
    await this.wait(200);
    
    // Verificar se campo de múltiplos anos apareceu
    const multipleYearsSection = document.getElementById('multiple-years-section');
    const isVisible = multipleYearsSection && multipleYearsSection.style.display !== 'none';
    
    if (isVisible) {
      // Preencher anos
      this.fillField('activity-years', '2021, 2022, 2023');
      this.fillField('activity-link', 'https://exemplo.com/monitoria.pdf');
    }
    
    this.logResult('Teste 7', isVisible, 'Deve mostrar campo para múltiplos anos');
    return isVisible;
  }

  // Interceptar alerts para teste
  setupAlertInterception() {
    const originalAlert = window.alert;
    window.lastAlert = '';
    window.alert = function(message) {
      window.lastAlert = message;
      console.log('🚨 Alert interceptado:', message);
      return true;
    };
  }

  // Executar todos os testes
  async runAllTests() {
    console.log('🚀 Iniciando bateria de testes...\n');
    
    this.setupAlertInterception();
    
    const tests = [
      () => this.testCase1_CamposObrigatoriosVazios(),
      () => this.testCase2_EmailInvalido(),
      () => this.testCase3_SemAtividades(),
      () => this.testCase4_AdicionarAtividade(),
      () => this.testCase5_RegistroCompleto(),
      () => this.testCase6_ValidacaoTipoComprovante(),
      () => this.testCase7_MultiplosAnos()
    ];

    for (let i = 0; i < tests.length; i++) {
      try {
        await tests[i]();
        await this.wait(500); // Pausa entre testes
      } catch (error) {
        console.error(`❌ Erro no teste ${i + 1}:`, error);
        this.logResult(`Teste ${i + 1}`, false, `Erro: ${error.message}`);
      }
    }

    this.showSummary();
  }

  logResult(testName, passed, description) {
    const status = passed ? '✅ PASSOU' : '❌ FALHOU';
    console.log(`${status} - ${testName}: ${description}`);
    
    this.testResults.push({
      name: testName,
      passed,
      description
    });
  }

  showSummary() {
    console.log('\n📊 RESUMO DOS TESTES:');
    console.log('='.repeat(50));
    
    let passed = 0;
    let failed = 0;
    
    this.testResults.forEach(result => {
      const status = result.passed ? '✅' : '❌';
      console.log(`${status} ${result.name}: ${result.description}`);
      
      if (result.passed) passed++;
      else failed++;
    });
    
    console.log('='.repeat(50));
    console.log(`📈 Total: ${this.testResults.length} testes`);
    console.log(`✅ Passou: ${passed}`);
    console.log(`❌ Falhou: ${failed}`);
    console.log(`📊 Taxa de sucesso: ${((passed / this.testResults.length) * 100).toFixed(1)}%`);
    
    if (failed === 0) {
      console.log('🎉 Todos os testes passaram!');
    } else {
      console.log('⚠️ Alguns testes falharam. Verifique os problemas acima.');
    }
  }
}

// Função para executar os testes
window.runFormTests = async function() {
  const tester = new FormTester();
  await tester.runAllTests();
};

// Função para executar teste individual
window.runSingleTest = async function(testNumber) {
  const tester = new FormTester();
  tester.setupAlertInterception();
  
  const tests = {
    1: () => tester.testCase1_CamposObrigatoriosVazios(),
    2: () => tester.testCase2_EmailInvalido(),
    3: () => tester.testCase3_SemAtividades(),
    4: () => tester.testCase4_AdicionarAtividade(),
    5: () => tester.testCase5_RegistroCompleto(),
    6: () => tester.testCase6_ValidacaoTipoComprovante(),
    7: () => tester.testCase7_MultiplosAnos()
  };
  
  if (tests[testNumber]) {
    await tests[testNumber]();
    tester.showSummary();
  } else {
    console.log('❌ Número de teste inválido. Use 1-7.');
  }
};

console.log('🧪 Testes carregados! Use os comandos:');
console.log('- runFormTests() - Executar todos os testes');
console.log('- runSingleTest(1-7) - Executar teste específico');