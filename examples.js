// Examples

//development 
const apiClient = new ApiClient('dev', '1.0');

//production
const apiClient = new ApiClient('app', '1.0');

//set token
apiClient.setToken('YOURTOKENHERE');

//check token 
apiClient.validToken().then(function (response) {
  console.log(response);
});

//obter tipos de documento
apiClient.getDocumentAllTypes().then(function (response) {
  console.log(response);
});

//ler unidades de medida 
apiClient.getMeasurementUnits().then(function (response) {
  console.log(response);
});

//ler metodos de pagamento
apiClient.getMeasurementUnits().then(function (response) {
  console.log(response);
});

//criar unidade de medida 
apiClient.createMeasurementUnit({ 'nome': 'Kelvin', 'simbolo': 'K' })
.then(function (response) {
   console.log(response);
});

//ler series
apiClient.getDocumentSets().then(function (response) {
  console.log(response);
});

//ler series
apiClient.getDocumentSets().then(function (response) {
  console.log(response);
});

//ler impostos
apiClient.getTaxs().then(function (response) {
  console.log(response);
});

//ler motivos de isencao
apiClient.getTaxExemptions().then(function (response) {
  console.log(response);
});

//criar um contato
apiClient.createContact({
  'nome': 'John Doe',
  'nif' : '12345789',
  'country': 'PT'
}).then(function (response) {
  console.log(response);
});

//criar um artigo
apiClient.createItem({
  'descricao': 'Porta de Madeira',
  'codigo' : 'AAA1234',
  'unidade_medida_id': 2938, //unit of measure ID
  'imposto_id': 399, //VAT id 
  'iva_compra': 399, //VAT id 
}).then(function (response) {
  console.log(response);
});

//criar um documento consumidor final
apiClient.createDocument({
  'tipificacao': 'FT', 
  'produtos': [
  {
    'item_id': 13017, 
    'nome': 'Porta de Madeira',
    'quantidade' : 1,
    'imposto' : 23, //igual a 23% <- também pode usar imposto_id
    'preco_unitario' : 12
  }
  ],
  'terminado' : 1 // 0 <- rascunho
}).then(function (response) {
  console.log(response);
});

//criar uma fatura novo contato
let contato = {
  'nome' : 'Raul Borges',
  'pais' : 'PT',
  'nif' : '123456789'
}

apiClient.createDocument({
  'contato': contato,
  'tipificacao': 'FT', 
  'produtos': [
  {
    'item_id': 13017, 
    'nome': 'Porta de Madeira',
    'quantidade' : 1,
    'imposto' : 23, //igual a 23% <- também pode usar imposto_id
    'preco_unitario' : 12
  }
  ],
  'terminado' : 1 // 0 <- rascunho
}).then(function (response) {
  console.log(response);
});

//criar um orcamento contato antigo
apiClient.createDocument({
  'contato_id': 12983, //trocar id para id do contato
  'tipificacao': 'ORC', 
  'produtos': [
  {
    'item_id': 13017, 
    'nome': 'Porta de Madeira',
    'quantidade' : 1,
    'imposto' : 23, //igual a 23% <- também pode usar imposto_id
    'preco_unitario' : 12
  }
  ],
  'terminado' : 1 // 0 <- rascunho
}).then(function (response) {
  console.log(response);
});

//criar um documento em que os produtos não existem 
apiClient.createDocument({
  'contato_id': 12983, //trocar id para id do contato
  'tipificacao': 'FR', 
  'produtos': [
  {
    'codigo': 'AAA39922', //novo artigo 
    'nome' : 'Janela XPTO',
    'unidade_medida_id' : 82, //colocar id correcto
    'ProductCategory' : 'P',
    'movimenta_stock' : 1,
    'quantidade' : 1,
    'imposto' : 23, //igual a 23% <- também pode usar imposto_id
    'preco_unitario' : 12
  }
  ],
  'terminado' : 1 // 0 <- rascunho
}).then(function (response) {
  console.log(response);
});

//criar um recibo para a fatura usando ID da fatura
apiClient.createReceiptToDocumentWithID(2939).then(function (response) {
  console.log(response);
});

//criar um recibo manual (parcial ou multiplos documentos )
apiClient.createReceipt({
  'contato_id' : 12983, //trocar para id do contato
  'tipo_documento_id' : 28, //recibo , 29 recibo de fornecedor 
  'documentos' : [{
    'documento_id' : 939,
    'total' : 100, /** Float (valor total do pagamento) este valor não deve conter o valor o do desconto. O total abatido no documento será:
total + total_desconto = total_pago
Exemplo: um documento de 50.00€ poderá ser pago na totalidade da seguinte forma:
total = 30.00, total_desconto = 20.00 
valor inclui IVA visto ser o total pago pelo cliente **/
    'total_desconto' : 0
  },{
    'documento_id' : 944,
    'total' : 89,
    'total_desconto' : 10
  }];
}).then(function (response) {
  console.log(response);
});

//anular um documento 
apiClient.voidDocument({
  'documento_id': 10039, 
  'motivo_anular': 'Erro no preço.'
}).then(function (response) {
  console.log(response);
});

//criar uma nota de credito PARCIAL para uma fatura 
apiClient.createDocument({
  'contato_id': 12983, //trocar id para id do contato
  'tipificacao': 'NC', 
  'produtos': [
  {
    'codigo': 'AAA39922', //novo artigo 
    'nome' : 'Janela XPTO',
    'unidade_medida_id' : 82, //colocar id correcto
    'ProductCategory' : 'P',
    'movimenta_stock' : 1,
    'quantidade' : 1, //quantidade nunca poderá ser maior que o original
    'imposto' : 23,
    'preco_unitario' : 12 // preco nunca poderá ser maior que o original
    
    //tem duas opções para fazer referência ao documento original 
    //opcao 1  (escolha uma das opções)
    'referencia_manual': 'FR BILL/3', // colocar o nome do documento original
    //opcao 2 (escolha uma das opções)
    'lancamento_pai_id': 399, //colocar o ID do lançamento pai 
    //para obter a listagem e id dos lancamentos utilize o route getDocumentWithID
  }
  ],
  'terminado' : 1 // 0 <- rascunho
}).then(function (response) {
  console.log(response);
});

//Como criar nota de crédito total de uma fatura
apiClient.convertDocumentWithID({
  'documento_id': 10309, //trocar id
  'convert_to': 'NC'
}).then(function (response) {
  console.log(response);
});
