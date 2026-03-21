import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GroqService {
  private readonly logger = new Logger(GroqService.name);
  private readonly apiKey = process.env.GROQ_API_KEY;

  async getChatCompletion(userMessage: string): Promise<string> {
    const systemPrompt = "Você é o assistente Ficaqui, um guia local do Centro de Aracaju. Seu objetivo é reduzir a fricção física do consumidor (calor e trânsito). Se o usuário pedir algo fora do estoque simulado, responda com empatia, sugira que ele visite pontos turísticos como o Palácio Olímpio Campos ou a Praça Fausto Cardoso, e prometa que o Ficaqui avisará assim que encontrar o produto nas lojas parceiras.";

    if (!this.apiKey) {
      this.logger.warn('GROQ_API_KEY não foi fornecida. Usando fallback de simulação.');
      return `(Simulação do Llama) Poxa rei, no momento não encontrei "${userMessage}" nas lojas físicas. Mas aproveite a sombra no Palácio Olímpio Campos que eu te aviso quando chegar!`;
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
      this.logger.error('Erro na chamada ao Groq', e);
      return "Desculpe, meu sistema está indisponível no momento.";
    }
  }
}
