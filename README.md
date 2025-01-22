# Hotel Booker
Saudações, espero que esta documentação encontre-o bem. Esse arquivo tem o objetivo documentar os passos sobre como executar o Hotel Booker API bem como usar suas funcionalidades através de chamadas HTTP.

## Setup do ambiente
1. Crie o arquivo com as variáveis de ambiente:

```bash
cp .env.example .env
```

2. Inicie o banco de dados:
```bash
# Cria um usuário no mongo e sobe o banco de dados
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

## Considerações
* Fiz um pequeno ajuste conceitual na implementação, a descrição original comenta sobre o número de quartos, em que, ao fazer uma reserva a pessoa escolheria o número de quartos. Ao invés, ajustei para que ao fazer uma reserva o cliente informe a quantidade de pessoas que vão acompanhar ele, isso se traduz em interações como: se o cliente está acompanhado por 4 pessoas e o quarto só acomoda 3, a API não irá permitir a reserva (comentando para guiar o entendimento),
* Implementei para que o saldo do cliente fosse creditado ao confirmar o pagamento da reserva,
* Checkin só é possível com o pagamento confirmado;

## Como usar a API
Você pode usar a API do Hotel Booker de duas formas:

1. Como dono da hotelaria, em que você pode:
1.1 Criar uma conta de usuário,
1.2 Cadastrar quartos de hotel; ou

2. Como cliente da hotelaria, em você pode:
2.1 Criar uma conta de usuário,
2.2 Alugar Quartos de hotel,
2.3 Informar comprovante de pagamento,
2.4 Fazer checkin ou checkout,
2.5 Gerar comprovante da reserva;

A seguir estão documentados os dois fluxos de chamadas de API que você pode seguir.

### Dono do Hotel

1. Crie uma conta
- [Criar conta](http://localhost:3000/api#/User/UserController_create)

2. Cadastre os quartos disponíveis no Hotel;
- [Crie quartos de hotel](http://localhost:3000/api#/Room/RoomController_create)

### Cliente do Hotel
1. Crie uma conta de usuário
- [Criar conta](http://localhost:3000/api#/User/UserController_create)

2. Encontre quartos de hotéis
- [Lista de quartos de hotel](http://localhost:3000/api#/Room/RoomController_list)

3. Reserve um quarto de hotel
- [Faça uma reserva](http://localhost:3000/api#/Room/RoomController_book)

4. Envie o comprovante de pagamento
- [Envie o comprovante](http://localhost:3000/api#/Room/RoomController_payment)

5. Faça checkin no quarto
[CheckIn](http://localhost:3000/api#/Room/RoomController_checkin)

6. Faça checkout no quarto
[Checkout](http://localhost:3000/api#/Room/RoomController_checkout)

## Por fazer
* Autenticação e autorização;
* Criar um módulo para armazenar as informações das reservas de quartos (booking). Estava seguindo por esse caminho mas quis manter a modelagem de dados simples e [acabei removendo](https://github.com/arufonsekun/hotel-booker/commit/026fad3558275575eaa3dd67475f9c333d94ee9c), no fim conclui que era uma boa ideia e deveria ter mantido;
* Testes unitários e de integração;
