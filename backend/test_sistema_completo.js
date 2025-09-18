// Script de teste completo para o sistema BierBox
// Testa funcionalidades principais do backend

const axios = require("axios");

// Configurações de teste
const BASE_URL = process.env.BACKEND_URL || "http://localhost:3000";
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

const TEST_CARD_TOKEN = "test_card_token_123"; // Token de teste do Mercado Pago (simulado )

class SistemaCompleto {
    constructor() {
        this.authToken = null;
        this.userId = null;
        this.enderecoId = null;
        this.preferenciaId = null; // ID da preferência de pagamento
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
        console.log("\n🔐 Teste 1: Registro de usuário");
        
        const resultado = await this.request("POST", "/users/register", TEST_USER);
        
        if (resultado.success) {
            console.log("✅ Usuário registrado com sucesso");
            this.resultados.registro = true;
            return true;
        } else {
            console.log("❌ Erro no registro:", resultado.error);
            this.resultados.registro = false;
            return false;
        }
    }

    // Teste 2: Login
    async testeLogin() {
        console.log("\n🔑 Teste 2: Login");
        
        const resultado = await this.request("POST", "/users/login", {
            email: TEST_USER.email,
            password: TEST_USER.senha
        });
        
        if (resultado.success && resultado.data.token) {
            this.authToken = resultado.data.token;
            this.userId = resultado.data.user?.id;
            console.log("✅ Login realizado com sucesso");
            console.log(`   Token obtido: ${this.authToken.substring(0, 20)}...`);
            this.resultados.login = true;
            return true;
        } else {
            console.log("❌ Erro no login:", resultado.error);
            this.resultados.login = false;
            return false;
        }
    }

    // Teste 3: Criar endereço
    async testeCriarEndereco() {
        console.log("\n🏠 Teste 3: Criar endereço");
        
        // Assumindo que a rota de endereços é /api/enderecos
        const resultado = await this.request("POST", "/api/enderecos", TEST_ENDERECO);
        
        if (resultado.success && resultado.data.data) {
            this.enderecoId = resultado.data.data.id;
            console.log("✅ Endereço criado com sucesso");
            console.log(`   Endereço ID: ${this.enderecoId}`);
            this.resultados.endereco = true;
            return true;
        } else {
            console.log("❌ Erro ao criar endereço:", resultado.error);
            this.resultados.endereco = false;
            return false;
        }
    }

    // Teste 4: Listar boxes (mantido, assumindo que a rota é /boxes)
    async testeListarBoxes() {
        console.log("\n📦 Teste 4: Listar boxes");
        
        const resultado = await this.request("GET", "/boxes");
        
        if (resultado.success) {
            console.log("✅ Boxes listadas com sucesso");
            console.log(`   Total de boxes: ${resultado.data.data?.length || 0}`);
            this.resultados.boxes = true;
            return true;
        } else {
            console.log("❌ Erro ao listar boxes:", resultado.error);
            this.resultados.boxes = false;
            return false;
        }
    }

    // Teste 5: Criar Preferência de Pagamento (substitui criar assinatura)
    async testeCriarPreferenciaPagamento() {
        console.log("\n💳 Teste 5: Criar Preferência de Pagamento");
        
        if (!this.enderecoId) {
            console.log("❌ Endereço necessário para criar preferência de pagamento");
            this.resultados.preferenciaPagamento = false;
            return false;
        }

        const dadosPreferencia = {
            items: [
                {
                    id: "box-cerveja-1",
                    title: "Box de Cerveja Artesanal",
                    description: "Assinatura mensal de 4 cervejas",
                    quantity: 1,
                    unit_price: 100.00 // Valor de teste
                }
            ],
            payer: {
                email: TEST_USER.email
            },
            external_reference: `user_${this.userId}_${Date.now()}`,
            back_urls: {
                success: `${BASE_URL}/pagamento/sucesso`,
                pending: `${BASE_URL}/pagamento/pendente`,
                failure: `${BASE_URL}/pagamento/falha`
            },
            notification_url: `${BASE_URL}/api/pagamentos/webhook` // Seu webhook
        };
        
        const resultado = await this.request("POST", "/api/pagamentos/criar-preferencia", dadosPreferencia);
        
        if (resultado.success && resultado.data.data) {
            this.preferenciaId = resultado.data.data.id;
            console.log("✅ Preferência de Pagamento criada com sucesso");
            console.log(`   Preferência ID: ${this.preferenciaId}`);
            console.log(`   URL de Pagamento: ${resultado.data.data.init_point}`);
            this.resultados.preferenciaPagamento = true;
            return true;
        } else {
            console.log("❌ Erro ao criar preferência de pagamento:", resultado.error);
            this.resultados.preferenciaPagamento = false;
            return false;
        }
    }

    // Teste 6: Simular Webhook de Pagamento (substitui webhook de teste genérico)
    async testeSimularWebhookPagamento() {
        console.log("\n🔗 Teste 6: Simular Webhook de Pagamento");
        
        if (!this.preferenciaId) {
            console.log("❌ Preferência de pagamento necessária para simular webhook");
            this.resultados.simularWebhook = false;
            return false;
        }

        // Simula um webhook de pagamento aprovado
        const webhookData = {
            action: "payment.created",
            data: {
                id: "123456789", // ID de pagamento simulado
                status: "approved",
                external_reference: `user_${this.userId}_${Date.now()}`,
                transaction_amount: 100.00,
                payment_method_id: "visa",
                // Outros dados relevantes do pagamento
            },
            type: "payment"
        };
        
        // A rota do webhook é /api/pagamentos/webhook
        const resultado = await this.request("POST", "/api/pagamentos/webhook", webhookData);
        
        if (resultado.success) {
            console.log("✅ Webhook de Pagamento simulado com sucesso");
            this.resultados.simularWebhook = true;
            return true;
        } else {
            console.log("❌ Erro ao simular webhook de pagamento:", resultado.error);
            this.resultados.simularWebhook = false;
            return false;
        }
    }

    // Teste 7: Endpoint de saúde (mantido, assumindo que a rota é /)
    async testeSaude() {
        console.log("\n❤️ Teste 7: Endpoint de saúde");
        
        const resultado = await this.request("GET", "/");
        
        if (resultado.success) {
            console.log("✅ Serviço funcionando corretamente");
            this.resultados.saude = true;
            return true;
        } else {
            console.log("❌ Serviço com problemas:", resultado.error);
            this.resultados.saude = false;
            return false;
        }
    }

    // Executar todos os testes
    async executarTodosOsTestes() {
        console.log("🚀 INICIANDO TESTES COMPLETOS DO SISTEMA BIERBOX");
        console.log("================================================");
        console.log(`📍 URL Base: ${BASE_URL}`);
        console.log(`👤 Usuário de teste: ${TEST_USER.email}\n`);

        // Executar testes em sequência
        await this.testeSaude();
        
        const loginSucesso = await this.testeRegistroUsuario() && await this.testeLogin();
        
        if (loginSucesso) {
            await this.testeCriarEndereco();
            await this.testeListarBoxes();
            await this.testeCriarPreferenciaPagamento();
            await this.testeSimularWebhookPagamento();
        }

        // Gerar relatório final
        this.gerarRelatorioFinal();
    }

    // Gerar relatório final
    gerarRelatorioFinal() {
        console.log("\n📊 RELATÓRIO FINAL DOS TESTES");
        console.log("================================");
        
        const testes = [
            { nome: "Endpoint de Saúde", key: "saude" },
            { nome: "Registro de Usuário", key: "registro" },
            { nome: "Login", key: "login" },
            { nome: "Criar Endereço", key: "endereco" },
            { nome: "Listar Boxes", key: "boxes" },
            { nome: "Criar Preferência de Pagamento", key: "preferenciaPagamento" },
            { nome: "Simular Webhook de Pagamento", key: "simularWebhook" }
        ];

        let totalTestes = 0;
        let testesPassaram = 0;

        testes.forEach(teste => {
            const passou = this.resultados[teste.key];
            const status = passou ? "✅ PASSOU" : "❌ FALHOU";
            console.log(`${teste.nome}: ${status}`);
            
            totalTestes++;
            if (passou) testesPassaram++;
        });

        console.log("\n📈 RESUMO");
        console.log(`Total de testes: ${totalTestes}`);
        console.log(`Testes que passaram: ${testesPassaram}`);
        console.log(`Testes que falharam: ${totalTestes - testesPassaram}`);
        console.log(`Taxa de sucesso: ${((testesPassaram / totalTestes) * 100).toFixed(1)}%`);

        if (testesPassaram === totalTestes) {
            console.log("\n🎉 TODOS OS TESTES PASSARAM!");
            console.log("Sistema BierBox funcionando perfeitamente.");
        } else if (testesPassaram >= totalTestes * 0.8) {
            console.log("\n⚠️ MAIORIA DOS TESTES PASSOU");
            console.log("Sistema funcional com algumas pendências.");
        } else {
            console.log("\n❌ MUITOS TESTES FALHARAM");
            console.log("Sistema precisa de correções antes de ir para produção.");
        }

        return testesPassaram === totalTestes;
    }
}

// Executar testes se o script for chamado diretamente
if (require.main === module) {
    const tester = new SistemaCompleto();
    tester.executarTodosOsTestes()
        .then(sucesso => {
            process.exit(sucesso ? 0 : 1);
        })
        .catch(error => {
            console.error("❌ Erro fatal durante os testes:", error);
            process.exit(1);
        });
}

module.exports = SistemaCompleto;
