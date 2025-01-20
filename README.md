# Hotel Booker
Saudações, espero que esta documentação encontre-o bem. Esse arquivo tem o objetivo documentar os passos sobre como executar o Hotel Booker API bem como usar suas funcionalidades através de chamadas HTTP.

## Setup do ambiente
1. Crie o arquivo com as variáveis de ambiente:

```bash
cp .env.example .env
```

2. Inicie o banco de dados:
```bash
# Cria um usuário e sobe o banco de dados
docker-compose up -d
```

3. Instale as dependências
```bash
npm install
``` 

4. Inicie a aplicação
```bash
npm run start
```

5. Acesse a API

[Hotel Booker API](http://localhost:3000/api)

## Como usar a API
Você pode usar a API do Hotel Booker de duas formas:

1. Como dono da hotelaria, onde você pode:
1.1 Criar uma conta de usuário,
1.2 Cadastrar quartos de hotel;

2. Como cliente buscando um quarto de hotel para reservar;
2.1 Criar uma conta de usuário,
2.2 Alugar Quartos de hotel;

A seguir estão documentados os dois fluxos de chamadas de API que você pode seguir.

### Dono do Hotel

1. Crie uma conta
- post para create user

2. Cadastre os quartos disponíveis no seu Hotel


### Cliente do Hotel