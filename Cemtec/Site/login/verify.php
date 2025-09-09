<?php
    /*
    Plugin Name: Login Simples
    Description: Plugin simples de verificação de usuário e senha via AJAX
    Version: 1.0.5
    Author: Lobato
    */
    // AJAX para quem não está logado
    add_action('wp_ajax_nopriv_verifica_senha', 'verifica_senha_callback');
    // AJAX para quem já está logado
    add_action('wp_ajax_verifica_senha', 'verifica_senha_callback');

    function verifica_senha_callback() {
        $data = json_decode(file_get_contents("php://input"), true);
        $username = sanitize_text_field($data["user"]);
        $senhaDigitada = $data["pass"];

        // Usuário e hash salvos no servidor (exemplo)
        $userSalvo = "cemtec";
        $hash = '$2y$10$ui8tdVw7ocmNo2EWQJVrpeU5w9vOFjjQKSK7IOPkM.X11rD9X6rBa'; // cemtec1234

        if ($username === $userSalvo && password_verify($senhaDigitada, $hash)) {
            wp_send_json([ "success" => true, "message" => "Login realizado com sucesso!" ]);
        } else {
            wp_send_json([ "success" => false, "message" => "Usuário ou senha incorretos.\n".$userSalvo.": ".$username."\n".$hash."\n".(password_verify($senhaDigitada, $hash)?"true":"false") ]);
        }
    }