# 🧠 Contexto do Projeto

App estilo comunicador aumentativo (semelhante ao Proloquo2Go):

* Botões representam objetos, verbos, conectivos
* Usuário monta frases
* Funciona 100% offline
* Login e sincronização apenas quando online
* Ferramenta assistiva → **não pode falhar nem reiniciar inesperadamente**

---

# ⚙️ Stack

* React
* Vite
* VitePWA
* Workbox
* IndexedDB para dados locais

---

# 🔥 Decisões Técnicas

## 1️⃣ Workbox Mode

### ✅ `injectManifest`

**Motivo:**

* Controle total do Service Worker
* Estratégias customizadas
* Offline-first real
* Suporte futuro a Background Sync
* Controle de atualização

❌ Não usar `generateSW` (limita controle)

---

## 2️⃣ Estratégia de Atualização

### ✅ `registerType: 'prompt'`

**Motivo:**

* Evita reload automático
* Usuário decide quando atualizar
* Não interrompe montagem de frases

❌ Não usar `autoUpdate`

---

## 3️⃣ Periodic SW Updates

### ❌ Desabilitar

**Motivo:**

* Pode detectar atualização no meio da sessão
* Gera distração
* App assistivo precisa previsibilidade

---

## 4️⃣ Offline Ready Prompt

### ✅ Sim (mas discreto)

**Motivo:**

* Transmite segurança
* Informa que já pode usar offline

⚠️ Implementar como:

* Indicador discreto
* Não modal
* Não invasivo

---

## 5️⃣ Geração de Ícones PWA

### ❌ Não gerar “on the fly”

### ✅ Gerar manualmente

**Motivo:**

* Controle total de:

  * Padding
  * Safe area
  * Versão maskable
* Melhor compatibilidade Android/iOS
* Produto assistivo exige qualidade visual

---

# 🗄️ Estratégia de Dados

## Offline-first real

### 🔹 Assets (ícones, imagens, UI)

→ Cache First

### 🔹 API (login / sync)

→ Network First

### 🔹 Dados do usuário

→ IndexedDB

Estrutura sugerida:

* users
* vocabulary
* phrases
* pendingSync

---

# 🔄 Sincronização

Quando online:

* Processar `pendingSync`
* Atualizar servidor
* Resolver conflitos se necessário

Nunca depender apenas do cache do SW para dados críticos.

---

# 🛡️ Regras de Ouro para seu App

* ❌ Nunca reiniciar automaticamente
* ❌ Nunca atualizar no meio da sessão
* ✅ Sempre permitir controle manual de update
* ✅ Garantir que a frase montada nunca seja perdida
* ✅ Experiência previsível e estável

---

# 🧩 Configuração Final Recomendada

| Configuração         | Valor              |
| -------------------- | ------------------ |
| Workbox              | injectManifest     |
| registerType         | prompt             |
| autoUpdate           | não                |
| periodic SW updates  | não                |
| offline ready prompt | sim (discreto)     |
| Ícones automáticos   | não                |
| IndexedDB            | sim                |
| Estratégia geral     | Offline-first real |

---

# 🎯 Filosofia Arquitetural

Para apps assistivos:

> Estabilidade > Atualização
> Previsibilidade > Automação
> Controle manual > Comportamento automático