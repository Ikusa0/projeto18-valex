# VALEX

Projeto em TypeScript e postgreSQL. API de cartões de benefícios. A API será responsável pela criação, recarga, ativação e processamento das compras.

## ROTAS

### /cards/create

> Cria um novo cartão.

- Headers:

```json
  {
    x-api-key (String): "Chave API da empresa."
  }
```

- Body:

```json
  {
    employeeId (Number): "ID do empregado."
    cardType (String): "Tipo do cartão, deve ser: 'groceries', 'restaurant', 'transport', 'education', 'health'"
  }
```

- Resposta:

```json
  HTTP CODE: 201
  
  {
    id (Number): "ID do novo cartão criado."
  }
```

### /cards/activate/:cardId

> Ativa um cartão não ativado.

- Params:

```json
  {
    cardId: "ID do card a ser ativado."
  }
```

- Body:

```json
  {
    employeeId (Number): "ID do empregado."
    securityCode (String): "Código de segurança do cartão."
    password (String): "Nova senha do cartão, precisa ter exatamente 4 dígitos numéricos."
  }
```

- Resposta:

```json
  HTTP CODE: 200
```

### /cards/balance/:cardId

> Retorna o saldo e extrato do cartão.

- Params:

```json
  {
    cardId: "ID do card a ser ativado."
  }
```

- Body:

```json
  {
    employeeId (Number): "ID do empregado."
    securityCode (String): "Código de segurança do cartão."
  }
```

- Resposta:

```json
  HTTP CODE: 200

  {
    balance (Number): "Saldo do cartão.",
    transactions (Object[]): [
      { 
        id (Number): "ID da transação.", 
        cardId (Number): "ID do cartão", 
        businessId (Number): "ID do estabelecimento onde a compra foi feita.", 
        businessName (String): "Nome do estabelecimento onde a compra foi feita.", 
        timestamp (Date): "Data da compra no formato DD/MM/YYYY", 
        amount (Number): "Total gasto em centavos." 
      }
    ]
    recharges (Object[]): [
      { 
        id (Number): "ID da recarga.",
        cardId (Number): "ID do cartão",  
        timestamp (Date): "Data da recarga no formato DD/MM/YYYY",
        amount (Number): "Total recarregado em centavos." 
      }
    ]
  }
```

### /cards/block/:cardId

> Bloqueia um cartão.

- Params:

```json
  {
    cardId: "ID do card a ser ativado."
  }
```

- Body:

```json
  {
    employeeId (Number): "ID do empregado."
    securityCode (String): "Código de segurança do cartão."
    password (String): "Senha do cartão, precisa ter exatamente 4 dígitos numéricos."
  }
```

- Resposta:

```json
  HTTP CODE: 200
```

### /cards/unblock/:cardId

> Desbloqueia um cartão.

- Params:

```json
  {
    cardId: "ID do card a ser ativado."
  }
```

- Body:

```json
  {
    employeeId (Number): "ID do empregado."
    securityCode (String): "Código de segurança do cartão."
    password (String): "Senha do cartão, precisa ter exatamente 4 dígitos numéricos."
  }
```

- Resposta:

```json
  HTTP CODE: 200
```

### /cards/recharge/:cardId

> Faz uma recarga no cartão.

- Headers:

```json
  {
    x-api-key (String): "Chave API da empresa."
  }
```

- Params:

```json
  {
    cardId: "ID do card a ser ativado."
  }
```

- Body:

```json
  {
    amount (Number): "Total da recarga em centavos."
  }
```

- Resposta:

```json
  HTTP CODE: 201
```

### /cards/transaction/:cardId

> Realiza uma compra com o cartão.

- Params:

```json
  {
    cardId: "ID do card a ser ativado."
  }
```

- Body:

```json
  {
    amount (Number): "Total da recarga em centavos.",
    password (String): "Senha do cartão, precisa ter exatamente 4 dígitos numéricos.",
    businessId (Number): "ID do estabelecimento onde a compra foi feita."
  }
```

- Resposta:

```json
  HTTP CODE: 201
```
