<?php

header("Content-Type: application/json");

// Leitura de dados recebidos do fetch
$rawData = file_get_contents("php://input");

// Transformando JSON recebido e objeto PHP
$data = json_decode($rawData, true);

// Definindo caminho de salvamento
$arquivo = __DIR__ . "/../data/ceps.json";

// Lendo o conteúdo existente no ceps.json
$conteudoAtual = json_decode(file_get_contents($arquivo), true);
// Verificando duplicidade
foreach($conteudoAtual as $item) {
    if(!isset($item["cep"])) {
        $item["cep"] = "";
    }

    if($item["cep"] === $data["cep"]) {

        echo json_encode([
            "status" => "erro",
            "mensagem" => "Esse endereço já foi cadastrado anteriormente."
        ]);
        exit;

    }

}

// Se não houver duplicidade, adiciona novo registro
$conteudoAtual[] = $data;

// Reescrevendo o ceps.json com os novos dados
file_put_contents($arquivo, json_encode($conteudoAtual, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

// Retorno para o front via AJAX
echo json_encode([
    "status" => "sucesso",
    "mensagem" => "Endereço salvo com sucesso!"
]);