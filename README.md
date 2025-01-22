# Hotel Booker
Saudações, espero que esta documentação encontre-o bem. Esse arquivo tem o objetivo documentar os passos sobre como executar o Hotel Booker API, documentar suas funcionalidades, e comentar um pouco sobre os detalhes de sua implementação.

## Setup do ambiente
1. Crie o arquivo com as variáveis de ambiente:

```bash
cp .env.example .env
```

2. Inicie o banco de dados:
```bash
# Sobe um container com mongo e cria um banco de dados e um usuário (as credenciais já estão corretas no .env.example ;) )
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
* Defini que o check-in só é possível com o pagamento confirmado,
* Adicionei um endpoint de check-out que "limpa" as informações de reserva de um quarto;

## Esquemas

Criei dois esquemas, um para usuário e um para quarto (`user.schema` e `room.schema`). Optei por não criar um esquema para a reserva para manter o fluxo simples, porém imagino que a modelagem teria ficado melhor se tivesse feito. Vamos a definição dos esquemas:

### Usuário

```js
User {
  _id: string;
  name: string;
  email: string;
  password: string;
  credit: number; // saldo que o usuário usa pra reservar quartos de hotel
}
```

### Quarto de hotel
```js
Room {
  _id: string;
  __v: number;
  name: string;
  description: string;
  price: number; // valor do quarto
  capacity: number; // quantas pessoas podem se acomodar nele
  bookerId: string; // quem está reservando (null significa que ninguém está)
  booked: boolean; // se o quarto está reservado ou não
  paymentConfirmed: boolean; // se o pagamento da reserva foi confirmado
  checkInAt: Date; // data que o bookerId vai entrar no quarto
  checkOutAt: Date; // data que o bookerId vai sair
}
```

## Como usar a API
Você pode usar a API do Hotel Booker de duas formas:

1. Como dono da hotelaria, em que você pode:

   1.1 Criar uma conta de usuário,

   1.2 Cadastrar quartos de hotel; ou

2. Como cliente da hotelaria, em você pode:

   2.1 Criar uma conta de usuário,

   2.2 Reservar quartos de hotel,

   2.3 Informar comprovante de pagamento,

   2.4 Gerar comprovante da reserva;

   2.5 Fazer checkin ou checkout,

A seguir estão documentados os dois fluxos de chamadas de API que você pode seguir.

### Dono do Hotel

1. [Crie uma conta](http://localhost:3000/api#/User/UserController_create)

2. [Cadastre os quartos disponíveis no Hotel](http://localhost:3000/api#/Room/RoomController_create)

### Cliente
1. [Crie uma conta de usuário](http://localhost:3000/api#/User/UserController_create)

2. [Encontre quartos de hotéis](http://localhost:3000/api#/Room/RoomController_list)

3. [Reserve um quarto de hotel](http://localhost:3000/api#/Room/RoomController_book)

4. [Envie o comprovante de pagamento](http://localhost:3000/api#/Room/RoomController_payment)

5. [Baixe o comprovante da reserva](http://localhost:3000/api#/Room/RoomController_download)

5. [Faça checkin no quarto](http://localhost:3000/api#/Room/RoomController_checkin)

6. [Faça checkout no quarto](http://localhost:3000/api#/Room/RoomController_checkout)

## Por fazer
* Autenticação e autorização (interessante pra não ter que passar o id do usuário toda vez);
* Criar um módulo para armazenar as informações das reservas de quartos (booking). Estava seguindo por esse caminho mas quis manter a modelagem de dados simples e [acabei removendo](https://github.com/arufonsekun/hotel-booker/commit/026fad3558275575eaa3dd67475f9c333d94ee9c), no fim conclui que era uma boa ideia e deveria ter mantido;
* Testes unitários e de integração;
