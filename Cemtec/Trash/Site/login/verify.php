<?php
/*
Plugin Name: Login Simples
Description: Plugin simples de verificação de usuário e senha via REST API
Version: 1.1.0
Author: Lobato
*/

// 1) Registrar rota na REST API
add_action('rest_api_init', function () {
    register_rest_route('login/v1', '/verifica', array(
        'methods'  => 'POST',
        'callback' => 'verifica_senha_callback',
        'permission_callback' => '__return_true' // público (atenção: segurança!)
    ));
});

// 2) Função que trata a requisição
function verifica_senha_callback(WP_REST_Request $request) {
    $username = sanitize_text_field($request->get_param('user'));
    $senhaDigitada = $request->get_param('pass');

    // Usuário e hash salvos no servidor (exemplo)
    $userSalvo = "cemtec";
    $hash = '$2y$10$ui8tdVw7ocmNo2EWQJVrpeU5w9vOFjjQKSK7IOPkM.X11rD9X6rBa'; // cemtec1234

    if ($username === $userSalvo && password_verify($senhaDigitada, $hash)) {
        return [ "success" => true, "message" => "Login realizado com sucesso!" ];
    } else {
        return [ "success" => false, "message" => "Usuário ou senha incorretos." ];
    }
}
