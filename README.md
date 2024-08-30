### Modelo de Arquivo `.env`

Crie um arquivo `.env` na raiz do projeto e adicione as seguintes variáveis. Certifique-se de substituir os valores de exemplo pelos valores reais apropriados para sua configuração.

```dotenv
# Configuração do Google para autenticação com Google usando NextAuth
[Verifique a explicação na documentação](https://next-auth.js.org/providers/google)
GOOGLE_CLIENT_ID=seu_client_id_aqui
GOOGLE_CLIENT_SECRET=seu_client_secret_aqui

# URL para NextAuth
NEXTAUTH_URL=http://localhost:3000/ (mude para sua url)

# Chave Secreta para JWT
JWT_SECRET=sua_jwt_secret_aqui


# Configuração do Firebase
[Verifique a explicação na documentação](https://firebase.google.com/docs/web/setup?hl=pt)
NEXT_PUBLIC_FIREBASE_API_KEY=sua_firebase_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu_firebase_auth_domain_aqui
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu_firebase_project_id_aqui
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu_firebase_storage_bucket_aqui
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=seu_firebase_messaging_sender_id_aqui
NEXT_PUBLIC_FIREBASE_APP_ID=seu_firebase_app_id_aqui

# URL Pública
NEXT_PUBLIC_URL=http://localhost:3000 (mude para sua url)
```