Follow the steps below to run the apllication locally with Docker using PostgreSQL and YugabyteDB as a database:

1. (Optional) Modify the `.env.local.example` with your real Stripe test keys if you want checkout to work and then execute this command:
    ```bash
    cp .env.local.example .env
    ```

2. Start the application using YugabyteDB or PostgreSQL as a database:

    For on-prem *PostgreSQL* deployment:
    ```bash
    docker-compose -f docker-compose-postgres.yaml up
    ```

    For on-prem *YugabyteDB* deployment:
    ```bash
    docker-compose -f docker-compose-yugabyte.yaml up
    ```
 
3. Navigate to the `hasura` directory:
    ```bash
    cd hasura
    ```

4. Create the `config.yaml` file from the template for local deployments:
    ```bash
    cp local.config.yaml config.yaml
    ```

5. Create the `databases.yaml` file from the template for local deployments:
    ```bash
    cp metadata/databases/local.databases.yaml metadata/databases/databases.yaml
    ```

6. Apply metadata and load sample data:
    ```sh-session
    hasura metadata apply
    hasura migrate apply
    hasura metadata reload
    hasura seeds apply
    ```

7. Visit the following endpoints:

```sh-session
Visit http://localhost:3000 for Next.js frontend
  Login at /account/login has default credentials "user@site.com:password"
  Login at /admin/account/login has default credentials "admin@site.com:password"
Visit http://localhost:8060 for Hasura console (admin secret = "my-secret")
Visit http://localhost:9000 for Minio dashboard (login = "minio:minio123")
Visit http://localhost:7001 for Yugabyte Master UI
Visit http://localhost:9001 for Yugabyte TServer UI
```