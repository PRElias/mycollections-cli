Access this link to get your key http://steamcommunity.com/dev/apikey

Execute ```npm install -g```
Depois é só usar o comando ```getGames``` para gerar o arquivo json
Executar o comando ```downloadImages``` para baixar as imagens localmente


Gerar o csv para facilitar a manipulação
```npm run-script generateCSV```

O Excel está salvando o JSON trocando vírgulas por ponto-e-vírgulas. Até automatizar a troca, lembrar de fazer manualmente antes de gerar o json

Gerar o JSON a partir do CSV
```npm run-script generateJSON```

Converter arquivo Excel para JSON online
https://codebeautify.org/excel-to-json

Para server localmente:
```npx serve```