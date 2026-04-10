docker exec getteOsheet node scripts/transformOsheetSheet.js


# pm2:
## Roda um script
pm2 start /volume1/site_admin/libreoffice/scripts/seuScript.js --name meu-script
pm2 start /volume1/site_admin/libreoffice/scripts/runScriptDocker.sh --name loop_APISite
## Lista tds os processos rodando:
pm2 list
## Remove processo do pm2
pm2 delete {name or id}
pm2 delete 0
## Vê a qnt tempo o NAS está ligado
uptime



docker run -d --name getterOsheet -v /volume1/site_admin/libreoffice:/app -w /app mcr.microsoft.com/playwright:v1.58.2-jammy sleep infinity

# Debugging
## Rodar docker do python
python3 -m http.server 8090
### Coloque em:
root@CEMTEC:/volume1/site_admin/libreoffice# 
### Acesse em:
192.168.1.144:8090

# VIM:
remove td do arquivo: ':%d'