import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GroqService {
  private readonly logger = new Logger(GroqService.name);
  private readonly apiKey = process.env.GROQ_API_KEY;

  async getChatCompletion(
    userMessage: string, 
    userProfile: any, 
    storeData: any, 
    productData: any, 
    history: any
  ): Promise<string> {
    const systemPrompt = `Você é o "Cérebro" do Ficaqui, uma IA especialista em revitalização urbana e comércio do Centro de Aracaju. Sua missão é reduzir a fricção física (calor, trânsito, falta de estoque) conectando o usuário ao lojista tradicional.

Contexto de Dados (JSON Input Dinâmico em Tempo Real):
1. User Profile: ${JSON.stringify(userProfile)}
2. Current View (Map): Foco nas coordenadas do Centro de Aracaju (Praça Fausto Cardoso e arredores).
3. Store Data (Prisma/Postgres): ${JSON.stringify(storeData)}
4. Product Data: ${JSON.stringify(productData)}
5. Histórico da Conversa: ${JSON.stringify(history)}

Regras de Resposta:
- RAG (Retrieval-Augmented Generation): Sempre priorize os dados de produtos vindos do meu banco Postgres informados acima. Se o produto existir (Product Data), informe a loja correspondente e avise do estoque.
- Consciência Urbana: Sugira rotas com sombra e segurança.
- Gamificação: Explique o sistema de CentroCoins.
- Tom de Voz: Amigável, ágil e com sotaque leve de Sergipe ("oxente", "rei"), mas profissional.

Sua saída deve ser EXCLUSIVAMENTE um objeto JSON válido no formato:
{ "text": "sua resposta aqui", "action": "show_route | update_map_pins | trigger_confetti | none", "metadata": { "coordenadas": [-10.9125, -37.0450] } }`;

    if (!this.apiKey) {
      this.logger.warn('GROQ_API_KEY não foi fornecida. Usando fallback de simulação via JSON.');
      return JSON.stringify({
        text: `(Simulação do Llama) Oxente rei, recebi seus dados reais do Postgres! Você tem ${userProfile?.centroCoins ?? 0} CentroCoins. Mas no momento minha API Key está offline. Fique na sombra aqui da Fausto Cardoso que te aviso depois!`,
        action: "none",
        metadata: { coordenadas: [-10.9125, -37.0450] }
      });
    }

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ],
          response_format: { type: "json_object" }
        })
      });
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (e) {
      this.logger.error('Erro na chamada ao Groq', e);
      return "Desculpe, meu sistema está indisponível no momento.";
    }
  }

  async getAdminInsights(opportunities: any): Promise<string> {
    const systemPrompt = `Você atua como o 'Cérebro' do projeto Ficaqui, uma IA de Inteligência Urbana focada em orientar políticas públicas para a revitalização do Centro de Aracaju.
Seu objetivo é analisar os dados do Dashboard (fluxo de pessoas, prédios abandonados, buscas por comércio) e sugerir ações baseadas nestes 3 pilares:

O Fundo Ficaqui: Sugerir concessões de prédios públicos abandonados para a iniciativa privada transformá-los em Âncoras de Atração (Mercados Gastronômicos, Hubs de Inovação) com redução de impostos.

Uso Misto e Moradia: Identificar prédios comerciais vazios com potencial para Uso Misto (Lojas no térreo + Moradia nos andares superiores). Sugerir Isenção de IPTU e redução de ISS para as construtoras que fizerem o retrofit. Lembre-se: 'Quem mora no Centro, consome no Centro'.

Formalização e Efeito Âncora: Sugerir Alvará Expresso para ambulantes e isenções fiscais para atrair Grandes Empresas para áreas com alto fluxo, criando novos polos de atração em desertos comerciais.`;

    const userMessage = `Por favor, analise as seguintes oportunidades mapeadas e aplique os 3 pilares para sugerir estratégias: \n\n${JSON.stringify(opportunities, null, 2)}`;

    if (!this.apiKey) {
      return JSON.stringify({ 
        insight: "Simulação de Insight Llama: Sugestão de Retrofit para uso misto nos ativos mapeados e incentivos perimetrais no Centro." 
      });
    }

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage }
          ]
        })
      });
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (e) {
      this.logger.error('API Error', e);
      return "Sistema Groq indisponível no momento.";
    }
  }
}
