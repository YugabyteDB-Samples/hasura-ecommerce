# On-Prem E-Commerce Application

This example is a dockerized project with the following services: Postgres or YugabyteDB, GraphQL Engine, Minio, and Next.js. The project has one external service dependency for payment handling, which we've chosen to implement with Stripe. User authentication and authorization, cart management, order management and product information management is stored in Postgres or YugabyteDB and architected through Hasura GraphQL Engine. Minio is utilized for asset storage as it implements a common S3 interface.

<!-- vscode-markdown-toc -->

- [On-Prem E-Commerce Application](#on-prem-e-commerce-application)
- [Application Architectural Overview](#application-architectural-overview)
- [Local Deployment](#local-deployment)  

<!-- vscode-markdown-toc-config
    numbering=false
    autoSave=true
    /vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

## Application Architectural Overview

See the [Architecture Documentation.](Architecture.md)

![app_architecture_diagram](https://user-images.githubusercontent.com/26604994/125822010-95b16d9a-2c0e-49ce-ad99-f7c6cca6e588.png)

| Service                | Functionality                                                                | Licensing |
| -----------------------| ---------------------------------------------------------------------------- | --------- |
| Postgres or YugabyteDB | PIM, Cart Management, User Management, User Authentication, Order Management | OSS       |
| Hasura                 | Business Logic Routing, Unified API, Access Control Management               | OSS       |
| NextJS                 | Serverless business logic handlers, web application framework                | OSS       |
| Minio                  | S3-compatible object storage (file and image upload)                         | OSS       |
| Stripe                 | Payment handling                                                             | Freemium  |

## Local Deployment

Follow the steps below to run the apllication locally with Docker using PostgreSQL and YugabyteDB as a database:

1. (Optional) Modify the `.env.local.example` with your real Stripe test keys if you want checkout to work and then execute this command:
    ```bash
    cp .env.local.example .env
    ```

2. Start the application using YugabyteDB or PostgreSQL as a database:

If you already have a Postgres or YugabyteDB instance running locally, then:

* Double check the following two variables in the `docker-compose-local.yaml` file:
    ```yaml
    HASURA_GRAPHQL_DATABASE_URL
    PG_DATABASE_URL
    ```
* Start the app:
    ```bash
    docker-compose -f docker-compose-local.yaml up
    ```

Alternatively, you can start the app with a database instance running alongside in the container:

* For on-prem *PostgreSQL* deployment:
    ```bash
    docker-compose -f docker-compose-postgres.yaml up
    ```
* For on-prem *YugabyteDB* deployment:
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