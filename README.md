# PROJETO FRONT END PARA CÁLCULO DE REDE BAYESIANA ATRAVÉS DE ORDENS DE COMPRA

Este repositório comporta o projeto frontend do sistema de recomendação de forma de pagamento para ordens de compra através de um cálculo de rede bayesiana. Este projeto se complementa com uma projeto backend que disponibiliza APIs, acessível no link: <https://github.com/vssCOSTA/TrabalhoClaudio>

### COMO INSTALAR E EXECUTAR O PROJETO

Requisitos: 

- Node v20 ou superior

> **Faça um clone ou baixe o conteúdo do repositório**:

`git clone https://github.com/Erick-Pereira/oc-recomendacao-frontend `

> **Abra o projeto em uma IDE e execute os comando necessários**:

Instala as dependências necessárias:

`npm install`

Após, siga os passos descritos no README do projeto backend: <https://github.com/vssCOSTA/TrabalhoClaudio>

Após, inicie o servidor de desenvolvimento Next.js

`npm run dev`

Isso irá criar um servidor local para a execução da interface gráfica web em <http://localhost:3000> e estará pronto para o uso.

### COMO UTILIZAR O PROJETO

A interface gráfica conta com campos para preenchimento de um ordem de compra. Ao preencher todos os campos na ordem, ao inserir o valor do frete, é realizada uma requisição para um endpoint que irá realizar o cálculo da rede bayesiana e retornar a forma de pagamento recomendada abaixo da seleção da mesma. O usuário então poderá vizualisar e decidir com qual forma de pagamento seguir. Ao clicar para registrar a ordem de compra, ela será enviada ao banco de dados para ser integrada aos novos cálculos