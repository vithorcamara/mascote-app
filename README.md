# Mascote App - Comunicação Aumentativa e Alternativa (CAA)

O Mascote App é uma aplicação web voltada para a Comunicação Aumentativa e Alternativa (CAA), projetada para auxiliar pessoas com dificuldades de fala ou linguagem a construir frases e se comunicar de forma eficaz através de símbolos, imagens e síntese de voz.

## 🚀 Funcionalidades Recentes

### 📝 Conjugação Verbal Inteligente
O app agora conta com um sistema de conjugação automática de verbos em português.
- **Modal de Conjugação**: Ao selecionar um verbo, um modal é aberto permitindo a escolha do tempo verbal (**Passado, Presente, Futuro ou Imperativo**).
- **Lógica Gramatical Avançada**: Suporte completo para verbos regulares (-ar, -er, -ir) e ampla cobertura para verbos irregulares complexos como *ir, sair, fazer, trazer, dizer, ter, vir, poder, saber, querer, dar, dormir, vestir, ler e ver*.
- **Concordância**: O verbo é automaticamente conjugado de acordo com o sujeito (pronome) selecionado anteriormente na frase.

### 🔗 Seção de Conectivos
Nova categoria de "Conectivos" para enriquecer a construção das frases.
- Exibição de chips retangulares (Ex: E, COM, PARA, DE, NO, NA).
- Organização automática em ordem alfabética e visualização em caixa alta para facilitar a leitura.

### 🗣️ Síntese de Voz (TTS)
- Integração com a Web Speech API para leitura em voz alta das frases formadas.
- Modal dedicado para configuração de voz, velocidade e tom.

## 🛠️ Tecnologias Utilizadas

- **React + Vite**: Base da aplicação para alta performance e desenvolvimento ágil.
- **Vanilla CSS**: Estilização personalizada e responsiva.
- **PWA (Progressive Web App)**: O Mascote App pode ser instalado em dispositivos móveis e funciona offline.
- **Web Speech API**: Para a funcionalidade de "falar" a frase construída.

## 📁 Estrutura de Vocabulário
Os itens de comunicação estão organizados em arquivos JSON dentro de `src/services/vocabulary/`, facilitando a expansão e personalização das categorias (Ações, Casa, Comida, Emoções, Lugares, Saúde, Vestuário e Conectivos).

## 💻 Desenvolvimento

Para rodar o projeto localmente:

1. Clone o repositório.
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

---
Este projeto é uma ferramenta de apoio à inclusão e acessibilidade.
