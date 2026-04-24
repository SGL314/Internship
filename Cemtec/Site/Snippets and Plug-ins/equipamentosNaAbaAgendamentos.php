add_action('wp_footer', function () {
    ?>
    <script type="text/javascript">
    (function() {
        const formId = 205;       // ID do formulário
        const fieldId = 13;       // ID do dropdown visível
        const hiddenFieldId = 99; // ID do campo oculto para envio
        const apiURL = 'https://script.google.com/macros/s/AKfycbwQFOpCHt0xupiYB3-jQHe9qiaC53735PPceNCzBWXmU9HVcxrME4K3kwG7zC8aLI0Kng/exec?sheet=From NAS-equipments';

        // Função para buscar dados da planilha
        async function fetchSheetItems() {
            try {
                const res = await fetch(apiURL);
                if(!res.ok) throw new Error('Erro na requisição');
                const data = await res.json();
                return data.map(item => Object.values(item)[0]).filter(v => v);
            } catch (err) {
                console.error('Erro ao buscar dados da planilha:', err);
                return [];
            }
        }

        // Função para popular dropdown e campo oculto
        async function populateDropdown(select) {
			console.log("populate");
            const items = await fetchSheetItems();
			console.log("items:",items);
            if(items.length === 0) return;

            // Limpa opções
            select.innerHTML = '';

            // Adiciona opções
            
			var itemsFormulados = []
            items.forEach(item => {
                
// 				<option value="1" class="choice-0 depth-1">Sem categoria</option>
// 				// process
				var pass = false;
				var removeNames = ["Equipamento","Energia","Termometria"];
				for (var name of removeNames){
					if (item == name){
						pass = true;
						break;
					}
				}
				if (!pass){
// 					console.log(item);
					itemsFormulados.push(item);
				}
            });
			var num = 1;
			for (var item of itemsFormulados.sort()){
				const opt = document.createElement('option');
				// adding=in
	            opt.value = item;
				opt.className = "choice-"+(num-1)+" depth-1"
	            opt.textContent = item;
	            select.appendChild(opt);
				num++;
			}

            // Inicializa campo oculto com o primeiro valor
//             hidden.value = select.value || items[0];

            // Atualiza campo oculto quando usuário muda o dropdown
//             select.addEventListener('change', function() {
//                 hidden.value = select.value;
//             });

            console.log('Dropdown populado e campo oculto pronto');
        }

        // Checa se o form já está no DOM
        function checkForm() {
			var select = false;
            var select = document.querySelector(`#wpforms-${formId}-field_${fieldId}`);
            if(select && select != false) {
				select.className = "wpforms-field-medium wpforms-valid";
// 				select.setAttribute("aria-invalid",false);
                populateDropdown(select);
            } else {
                // Se o form ainda não carregou (AJAX), tenta de novo em 200ms
                setTimeout(checkForm, 16);
            }
        }

        // Inicia a checagem
        checkForm();
    })();
    </script>
    <?php
});