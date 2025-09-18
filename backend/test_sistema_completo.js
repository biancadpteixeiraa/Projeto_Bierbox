const axios = require("axios");

// Configurações de teste
const BASE_URL = process.env.BACKEND_URL || "http://localhost:4000";
const TEST_USER = {
    nome_completo: "Usuário Teste BierBox",
    email: "teste.bierbox@email.com",
    senha: "senha123",
    telefone: "11999999999",
    cpf: "12345678901"
};

const TEST_ENDERECO = {
    nome_endereco: "Casa",
    cep: "01310-100",
    logradouro: "Av. Paulista",
    numero: "1000",
    complemento: "Apto 101",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    estado: "SP"
};

const TEST_CARD_TOKEN = "test_card_token_123"; // Token de teste do Mercado Pago

class SistemaCompleto {
    constructor( ) {
        this.authToken = null;
        this.userId = null;
        this.enderecoId = null;
        this.assinaturaId = null;
        this.pagamentoId = null;
        this.resultados = {};
    }

    // Utilitário para fazer requisições autenticadas
    async request(method, endpoint, data = null) {
        const config = {
            method,
            url: `${BASE_URL}${endpoint}`,
            headers: {}
        };

        if (this.authToken) {
            config.headers["Authorization"] = `Bearer ${this.authToken}`;
        }

        if (data) {
            config.headers["Content-Type"] = "application/json";
            config.data = data;
        }

        try {
            const response = await axios(config);
            return { success: true, data: response.data };
        } catch (error) {
            return { 
                success: false, 
                error: error.response?.data?.message || error.message,
                status: error.response?.status
            };
        }
    }

    // Teste 1: Registro de usuário
    async testeRegistroUsuario() {
        console.log("\nTeste 1: Registro de usuário");
        
        const resultado = await this.request("POST", "/auth/register", TEST_USER);
        
        if (resultado.success) {
            console.log("Usuário registrado com sucesso");
            this.resultados.registro = true;
            return true;
        } else {
            console.log("Erro no registro:", resultado.error);
            this.resultados.registro = false;
            return false;
        }
    }

    // Teste 2: Login
    async testeLogin() {
        console.log("\nTeste 2: Login");
        
        const resultado = await this.request("POST", "/auth/login", {
            email: TEST_USER.email,
            password: TEST_USER.senha
        });
        
        if (resultado.success && resultado.data.token) {
            this.authToken = resultado.data.token;
            this.userId = resultado.data.user?.id;
            console.log("Login realizado com sucesso");
            console.log(`   Token obtido: ${this.authToken.substring(0, 20)}...`);
            this.resultados.login = true;
            return true;
        } else {
            console.log("Erro no login:", resultado.error);
            this.resultados.login = false;
            return false;
        }
    }

    // Teste 3: Criar endereço
    async testeCriarEndereco() {
        console.log("\nTeste 3: Criar endereço");
        
        const resultado = await this.request("POST", "/enderecos", TEST_ENDERECO);
        
        if (resultado.success && resultado.data.data) {
            this.enderecoId = resultado.data.data.id;
            console.log("Endereço criado com sucesso");
            console.log(`   Endereço ID: ${this.enderecoId}`);
            this.resultados.endereco = true;
            return true;
        } else {
            console.log("Erro ao criar endereço:", resultado.error);
            this.resultados.endereco = false;
            return false;
        }
    }

    // Teste 4: Listar boxes
    async testeListarBoxes() {
        console.log("\nTeste 4: Listar boxes");
        
        const resultado = await this.request("GET", "/boxes");
        
        if (resultado.success) {
            console.log("Boxes listadas com sucesso");
            console.log(`   Total de boxes: ${resultado.data.data?.length || 0}`);
            this.resultados.boxes = true;
            return true;
        } else {
            console.log("Erro ao listar boxes:", resultado.error);
            this.resultados.boxes = false;
            return false;
        }
    }

    // Teste 5: Criar assinatura
    async testeCriarAssinatura() {
        console.log("\nTeste 5: Criar assinatura");
        
        if (!this.enderecoId) {
            console.log("Endereço necessário para criar assinatura");
            this.resultados.assinatura = false;
            return false;
        }

        const dadosAssinatura = {
            box_id: 1, 
            endereco_id: this.enderecoId,
            tipo_plano: "mensal",
            quantidade_cervejas: 4,
            card_token_id: TEST_CARD_TOKEN
        };
        
        const resultado = await this.request("POST", "/assinaturas", dadosAssinatura);
        
        if (resultado.success && resultado.data.data) {
            this.assinaturaId = resultado.data.data.assinatura.id;
            console.log("Assinatura criada com sucesso");
            console.log(`   Assinatura ID: ${this.assinaturaId}`);
            console.log(`   Mercado Pago ID: ${resultado.data.data.mercado_pago?.id}`);
            this.resultados.assinatura = true;
            return true;
        } else {
            console.log("Erro ao criar assinatura:", resultado.error);
            this.resultados.assinatura = false;
            return false;
        }
    }

    // Teste 6: Listar assinaturas
    async testeListarAssinaturas() {
        console.log("\nTeste 6: Listar assinaturas");
        
        const resultado = await this.request("GET", "/assinaturas");
        
        if (resultado.success) {
            console.log("Assinaturas listadas com sucesso");
            console.log(`   Total de assinaturas: ${resultado.data.data?.length || 0}`);
            this.resultados.listarAssinaturas = true;
            return true;
        } else {
            console.log("Erro ao listar assinaturas:", resultado.error);
            this.resultados.listarAssinaturas = false;
            return false;
        }
    }

    // Teste 7: Criar pagamento único
    async testeCriarPagamento() {
        console.log("\nTeste 7: Criar pagamento único");
        
        if (!this.enderecoId) {
            console.log("Endereço necessário para criar pagamento");
            this.resultados.pagamento = false;
            return false;
        }

        const dadosPagamento = {
            box_id: 1,
            endereco_id: this.enderecoId,
            quantidade_cervejas: 6,
            card_token_id: TEST_CARD_TOKEN,
            installments: 1
        };
        
        const resultado = await this.request("POST", "/pagamentos", dadosPagamento);
        
        if (resultado.success && resultado.data.data) {
            this.pagamentoId = resultado.data.data.pagamento.id;
            console.log("Pagamento criado com sucesso");
            console.log(`   Pagamento ID: ${this.pagamentoId}`);
            console.log(`   Status: ${resultado.data.data.mercado_pago?.status}`);
            this.resultados.pagamento = true;
            return true;
        } else {
            console.log("Erro ao criar pagamento:", resultado.error);
            this.resultados.pagamento = false;
            return false;
        }
    }

    // Teste 8: Verificar status do pagamento
    async testeVerificarStatusPagamento() {
        console.log("\nTeste 8: Verificar status do pagamento");
        
        if (!this.pagamentoId) {
            console.log("Pagamento necessário para verificar status");
            this.resultados.statusPagamento = false;
            return false;
        }
        
        const resultado = await this.request("GET", `/pagamentos/${this.pagamentoId}/status`);
        
        if (resultado.success) {
            console.log("Status verificado com sucesso");
            console.log(`   Status atual: ${resultado.data.data?.pagamento?.status}`);
            this.resultados.statusPagamento = true;
            return true;
        } else {
            console.log("Erro ao verificar status:", resultado.error);
            this.resultados.statusPagamento = false;
            return false;
        }
    }

    // Teste 9: Pausar assinatura
    async testePausarAssinatura() {
        console.log("\nTeste 9: Pausar assinatura");
        
        if (!this.assinaturaId) {
            console.log("Assinatura necessária para pausar");
            this.resultados.pausarAssinatura = false;
            return false;
        }
        
        const resultado = await this.request("PATCH", `/assinaturas/${this.assinaturaId}/pausar`);
        
        if (resultado.success) {
            console.log("Assinatura pausada com sucesso");
            this.resultados.pausarAssinatura = true;
            return true;
        } else {
            console.log("Erro ao pausar assinatura:", resultado.error);
            this.resultados.pausarAssinatura = false;
            return false;
        }
    }

    // Teste 10: Reativar assinatura
    async testeReativarAssinatura() {
        console.log("\nTeste 10: Reativar assinatura");
        
        if (!this.assinaturaId) {
            console.log("Assinatura necessária para reativar");
            this.resultados.reativarAssinatura = false;
            return false;
        }
        
        const resultado = await this.request("PATCH", `/assinaturas/${this.assinaturaId}/reativar`);
        
        if (resultado.success) {
            console.log("Assinatura reativada com sucesso");
            this.resultados.reativarAssinatura = true;
            return true;
        } else {
            console.log("Erro ao reativar assinatura:", resultado.error);
            this.resultados.reativarAssinatura = false;
            return false;
        }
    }

    // Teste 11: Webhook de teste
    async testeWebhook() {
        console.log("\nTeste 11: Webhook de teste");
        
        const webhookData = {
            type: "payment",
            data: {
                id: "123456789"
            }
        };
        
        const resultado = await this.request("POST", "/webhooks/mercadopago", webhookData);
        
        if (resultado.success) {
            console.log("Webhook processado com sucesso");
            this.resultados.webhook = true;
            return true;
        } else {
            console.log("Erro no webhook:", resultado.error);
            this.resultados.webhook = false;
            return false;
        }
    }

    // Teste 12: Endpoint de saúde
    async testeSaude() {
        console.log("\nTeste 12: Endpoint de saúde");
        
        const resultado = await this.request("GET", "/webhooks/test");
        
        if (resultado.success) {
            console.log("Serviço funcionando corretamente");
            this.resultados.saude = true;
            return true;
        } else {
            console.log("Serviço com problemas:", resultado.error);
            this.resultados.saude = false;
            return false;
        }
    }

    async executarTodosOsTestes() {
        console.log("INICIANDO TESTES COMPLETOS DO SISTEMA BIERBOX");
        console.log("================================================");
        console.log(`URL Base: ${BASE_URL}`);
        console.log(`Usuário de teste: ${TEST_USER.email}\n`);

        await this.testeSaude();
        
        const loginSucesso = await this.testeRegistroUsuario() && await this.testeLogin();
        
        if (loginSucesso) {
            await this.testeCriarEndereco();
            await this.testeListarBoxes();
            await this.testeCriarAssinatura();
            await this.testeListarAssinaturas();
            await this.testeCriarPagamento();
            await this.testeVerificarStatusPagamento();
            await this.testePausarAssinatura();
            await this.testeReativarAssinatura();
        }
        
        await this.testeWebhook();

        // Gerar relatório final
        this.gerarRelatorioFinal();
    }

    // Gerar relatório final
    gerarRelatorioFinal() {
        console.log("\nRELATÓRIO FINAL DOS TESTES");
        
        const testes = [
            { nome: "Endpoint de Saúde", key: "saude" },
            { nome: "Registro de Usuário", key: "registro" },
            { nome: "Login", key: "login" },
            { nome: "Criar Endereço", key: "endereco" },
            { nome: "Listar Boxes", key: "boxes" },
            { nome: "Criar Assinatura", key: "assinatura" },
            { nome: "Listar Assinaturas", key: "listarAssinaturas" },
            { nome: "Criar Pagamento", key: "pagamento" },
            { nome: "Verificar Status Pagamento", key: "statusPagamento" },
            { nome: "Pausar Assinatura", key: "pausarAssinatura" },
            { nome: "Reativar Assinatura", key: "reativarAssinatura" },
            { nome: "Webhook", key: "webhook" }
        ];

        let totalTestes = 0;
        let testesPassaram = 0;

        testes.forEach(teste => {
            const passou = this.resultados[teste.key];
            const status = passou ? "PASSOU" : "FALHOU";
            console.log(`${teste.nome}: ${status}`);
            
            totalTestes++;
            if (passou) testesPassaram++;
        });

        console.log("\nRESUMO");
        console.log(`Total de testes: ${totalTestes}`);
        console.log(`Testes que passaram: ${testesPassaram}`);
        console.log(`Testes que falharam: ${totalTestes - testesPassaram}`);
        console.log(`Taxa de sucesso: ${((testesPassaram / totalTestes) * 100).toFixed(1)}%`);

        if (testesPassaram === totalTestes) {
            console.log("\nTODOS OS TESTES PASSARAM!");
            console.log("Sistema BierBox funcionando perfeitamente.");
        } else if (testesPassaram >= totalTestes * 0.8) {
            console.log("\nMAIORIA DOS TESTES PASSOU");
            console.log("Sistema funcional com algumas pendências.");
        } else {
            console.log("\nMUITOS TESTES FALHARAM");
            console.log("Sistema precisa de correções antes de ir para produção.");
        }

        return testesPassaram === totalTestes;
    }
}

if (require.main === module) {
    const tester = new SistemaCompleto();
    tester.executarTodosOsTestes()
        .then(sucesso => {
            process.exit(sucesso ? 0 : 1);
        })
        .catch(error => {
            console.error("Erro durante os testes:", error);
            process.exit(1);
        });
}

module.exports = SistemaCompleto;
