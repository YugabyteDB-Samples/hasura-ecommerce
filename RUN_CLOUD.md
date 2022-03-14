Follow the steps below to run the apllication in the cloud using Hasura Cloud, Yugabyte Cloud and Vercel.

## Prepare Hasura and Yugabyte Cloud

1. [Interconnect](https://docs.yugabyte.com/latest/yugabyte-cloud/cloud-examples/hasura-cloud/) your Hasura Cloud and Yugabyte Cloud instances.

2. Navigate to the `hasura` directory:
    ```bash
    cd hasura
    ```

3. Create the `config.yaml` file from the template for cloud deployments:
    ```bash
    cp cloud.config.yaml config.yaml
    ```

4. Open the `config.yaml` file and initialize two parameters: 
    * `endpoint` - use the value of the `GraphQL API` property of your Hasura Cloud project (without `/v1/graphql` in the end)
    * `admin_secret` - use the value of the `Admin Secret` property.

    ![hasura endpoint configuration](images/hasura_endpoint.png)

5. Create the `metadata/databases/databases.yaml` file from the template for cloud deployments:
    ```bash
    cp metadata/databases/cloud.databases.yaml metadata/databases/databases.yaml
    ```

6. Open the `metadata/databases/databases.yaml` file and update one parameter: 
    * `database_url` - use the value of the `Connection String` property. Put in quotes in the config file.

    ![hasura endpoint configuration](images/yugabyte_cloud_connection_string.png)

7. Apply metadata and load sample data:
    ```sh-session
    hasura metadata apply
    hasura migrate apply
    hasura metadata reload
    hasura seeds apply
    ```

## Start Next.js Application

1. Go to the root directory of the project.

2. Create the `.env` file:
    ```bash
    cp .env.cloud.example .env
    ```

3. Open the `.env` file and initialize parameters:
    * `HASURA_CLOUD_URL` - your Hasura Cloud GraphQL API URL (without `/v1/graphql` in the end)
    * `HASURA_CLOUD_ADMIN_SECRET` - your Hasura Cloud admin secret.
    * `STRIPE_*` - stripe related parameters if you want checkout to work.

4. Start the application locally with Docker:
    ```bash
    docker-compose -f docker-compose-cloud.yaml up
    ```

5. Open the application in your browser:
    ```bash
    http://localhost:3000
    ```