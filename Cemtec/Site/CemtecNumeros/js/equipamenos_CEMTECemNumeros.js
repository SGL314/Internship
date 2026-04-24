(function () {
            const formId = 205;       // ID do formulário
            const fieldId = 13;       // ID do dropdown visível
            const hiddenFieldId = 99; // ID do campo oculto para envio
            const apiURL = 'https://script.google.com/macros/s/AKfycbwQFOpCHt0xupiYB3-jQHe9qiaC53735PPceNCzBWXmU9HVcxrME4K3kwG7zC8aLI0Kng/exec?sheet=From NAS-equipments';

            // Função para buscar dados da planilha
            async function fetchSheetItems() {
                try {
                    const res = await fetch(apiURL);
                    if (!res.ok) throw new Error('Erro na requisição');
                    const data = await res.json();
                    return data.map(item => Object.values(item)[0]).filter(v => v);
                } catch (err) {
                    console.error('Erro ao buscar dados da planilha:', err);
                    return [];
                }
            }

            // Função para popular dropdown e campo oculto
            async function populateDropdown() {
                console.log("populate");
                const items = await fetchSheetItems();
                console.log("items:", items);
                if (items.length === 0) return;

                // Adiciona opções

                var itemsFormulados = []
                items.forEach(item => {
                    var pass = false;
                    var removeNames = ["Equipamento", "Energia", "Termometria"];
                    for (var name of removeNames) {
                        if (item == name) {
                            pass = true;
                            break;
                        }
                    }
                    if (!pass) {
                        itemsFormulados.push(item);
                    }
                });
                var num = 1;
                for (var item of itemsFormulados.sort()) {
                    const local = document.querySelector("#equipments-list");
                    const itemElement = document.createElement('li');
                    const bolding = document.createElement('b');
                    bolding.textContent = item;
                    itemElement.appendChild(bolding);
                    local.appendChild(itemElement);
                    num++;
                }

                console.log('Dropdown populado e campo oculto pronto');
            }

            // Checa se o form já está no DOM
            function checkForm() {
                console.log("checkForm");
                populateDropdown();
            }

            // Inicia a checagem
            checkForm();
        })();