echo "Iniciando docker ..."
docker start getterOsheet
echo "Coletando dados da Lista Mestra ..."
docker exec getterOsheet node scripts/getTeste.js
echo "Colocando dados no Sheets do Google ..."
docker exec getterOsheet node scripts/readFromNAS.js

mv ../downloads/* .
mv *.png ../downloads

#mv ../downloads/'LM-03_Lista de equipamentos.xlsx' .

chmod 766 *.xlsx

mv *.xlsx ../../../Site/