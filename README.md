# Hasura E-commerce Application

This is a comprehensive (real-world) e-commerce application that was [originially developed](https://github.com/hasura/hasura-ecommerce) by the Hasura team. The original version of the app that uses PostgreSQL as a database and supports only the on-prem deployment option of Hasura. This repository adds instructions explaining how to start the app with YugabyteDB, with no code changes!

<!-- vscode-markdown-toc -->

- [Hasura and Yugabyte E-Commerce Application](#hasura-and-yugabyte-e-commerce-application)
  - [Prerequisite](#prerequisite)
  - [Setup Project](#setup-project)
  - [Run Application Locally](#run-application-locally)
  - [Run Application in Cloud](#run-application-in-cloud)
  - [Application Architectural Overview](#application-architectural-overview)
    - [Authentication Flow](#authentication-flow)
    - [Checkout Flow](#checkout-flow)
    - [Product Management Flow](#product-management-flow)
    - [GraphQL SDK](#graphql-sdk)
    - [Hasura Migration Flow](#hasura-migration-flow)
    - [3 Factor Applications](#3-factor-applications)
  - [Clear Demo Resources](#clear-demo-resources) 

<!-- vscode-markdown-toc-config
    numbering=false
    autoSave=true
    /vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->

## Prerequisite
1. Hasura CLI installed. [Instructions here.](https://hasura.io/docs/latest/graphql/core/hasura-cli/install-hasura-cli.html)
2. (Optional) Stripe Secret and Publishable keys. _The account doesn't need to be verified as no transactions will be happening._ [Instructions here.](https://stripe.com/docs/keys)
3. Local Deployments:
    * Docker and Docker Compose installed. [Install instructions.](https://docs.docker.com/get-docker/)
4. Cloud Deploymets:
    * Hasura Cloud Instance/Project. [Insturctions here](https://hasura.io/docs/latest/graphql/cloud/getting-started/index.html)
    * Yugabyte Cloud Instance. [Instructions here](https://docs.yugabyte.com/latest/yugabyte-cloud/cloud-quickstart/qs-add/)

## Setup Project

1. Clone the project:
    ```bash
    git clone https://github.com/dmagda/hasura-ecommerce
    ```

## Run Application Locally

Follow [these steps](RUN_LOCAL.md) to start the application in a local environment.

## Run Application in Cloud

Follow [these steps](RUN_CLOUD.md) to start the application in the cloud.

## Application Architectural Overview

* An architecure of [the on-prem/local deployment](RUN_LOCAL.md).
* An architecture of [the cloud native deployment](RUN_CLOUD.md).

### Authentication Flow

The Authentication leverages Hasura Actions and NextJs serverless routes to handle JWT based authentication. The client sends a login mutation, the mutation is forwarded via action to a serverless function where a unique JWT is created, the token is passed back to Hasura where it is stored with client credentials, and the JWT along with helpful client information is forwarded back to the client and set as a sever-set cookie.

The login flow is similar but instead of creating a user in the action, the user is verified.

[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVERcbiAgICB3ZWJzaXRlW1dlYnNpdGVdXG4gICAgaGFzdXJhWyhQb3N0Z3JlcyldXG4gICAgc2VydmVyW1NlcnZlcl1cbiAgICBhY3Rpb25bW0hhc3VyYSBBY3Rpb25dXVxuICAgIFxuICAgIHdlYnNpdGUgLS0-fFNpZ251cHwgYWN0aW9uXG4gICAgYWN0aW9uIC0uLT58SGFuZGxlcnwgc2VydmVyXG4gICAgc2VydmVyIC0uLT4gfFNhdmUgVXNlcnwgaGFzdXJhXG4gICAgc2VydmVyIC0uLT4gfHJldHVybiB0b2tlbnwgYWN0aW9uXG4gICAgYWN0aW9uIC0uLT4gd2Vic2l0ZSIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2V9)](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVERcbiAgICB3ZWJzaXRlW1dlYnNpdGVdXG4gICAgaGFzdXJhWyhQb3N0Z3JlcyldXG4gICAgc2VydmVyW1NlcnZlcl1cbiAgICBhY3Rpb25bW0hhc3VyYSBBY3Rpb25dXVxuICAgIFxuICAgIHdlYnNpdGUgLS0-fFNpZ251cHwgYWN0aW9uXG4gICAgYWN0aW9uIC0uLT58SGFuZGxlcnwgc2VydmVyXG4gICAgc2VydmVyIC0uLT4gfFNhdmUgVXNlcnwgaGFzdXJhXG4gICAgc2VydmVyIC0uLT4gfHJldHVybiB0b2tlbnwgYWN0aW9uXG4gICAgYWN0aW9uIC0uLT4gd2Vic2l0ZSIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2V9)
```mermaid
graph TD
    website[Website]
    hasura[(Postgres)]
    server[Server]
    action[[Hasura Action]]
    
    website -->|Signup| action
    action -.->|Handler| server
    server -.-> |Save User| hasura
    server -.-> |return token| action
    action -.-> website
```

### Checkout Flow

- User visits the Checkout page, presses payment button
- GraphQL request is sent to Hasura to invoke custom Hasura Action
- Hasura forwards the request parameters to the Action REST API handler on the Next.js Server
- The API handler calls the Stripe API and invokes `stripe.paymentIntents.create()`, then returns the `client_secret` for the tokenized PaymentIntent
- Hasura forwards the response from the Action REST API handler to the client, as GraphQL

[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVERcbiAgICB3ZWJzaXRlW1dlYnNpdGVdXG4gICAgc2VydmVyW1NlcnZlciAtIFJFU1QgQVBJXVxuICAgIGhhc3VyYVtIYXN1cmFdXG4gICAgc3RyaXBlW1N0cmlwZV1cblxuICAgIFxuICAgIHdlYnNpdGUgLS0-fENoZWNrb3V0fCBoYXN1cmFcbiAgICBoYXN1cmEgLS0-IHxIYXN1cmEgQWN0aW9ufCBzZXJ2ZXJcbiAgICBzZXJ2ZXIgLS0-IHxSRVNUIEFQSSBDYWxsfCBzdHJpcGVcbiAgICBzdHJpcGUgLi0-IHxQYXltZW50SW50ZW50IENsaWVudCBTZWNyZXR8IHNlcnZlclxuICAgIHNlcnZlciAuLT4gfEZvcndhcmR8IGhhc3VyYVxuICAgIGhhc3VyYSAuLT4gfEZvcndhcmR8IHdlYnNpdGUiLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVERcbiAgICB3ZWJzaXRlW1dlYnNpdGVdXG4gICAgc2VydmVyW1NlcnZlciAtIFJFU1QgQVBJXVxuICAgIGhhc3VyYVtIYXN1cmFdXG4gICAgc3RyaXBlW1N0cmlwZV1cblxuICAgIFxuICAgIHdlYnNpdGUgLS0-fENoZWNrb3V0fCBoYXN1cmFcbiAgICBoYXN1cmEgLS0-IHxIYXN1cmEgQWN0aW9ufCBzZXJ2ZXJcbiAgICBzZXJ2ZXIgLS0-IHxSRVNUIEFQSSBDYWxsfCBzdHJpcGVcbiAgICBzdHJpcGUgLi0-IHxQYXltZW50SW50ZW50IENsaWVudCBTZWNyZXR8IHNlcnZlclxuICAgIHNlcnZlciAuLT4gfEZvcndhcmR8IGhhc3VyYVxuICAgIGhhc3VyYSAuLT4gfEZvcndhcmR8IHdlYnNpdGUiLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)
```mermaid
graph TD
    website[Website]
    server[Server - REST API]
    hasura[Hasura]
    stripe[Stripe]

    
    website -->|Checkout| hasura
    hasura --> |Hasura Action| server
    server --> |REST API Call| stripe
    stripe .-> |PaymentIntent Client Secret| server
    server .-> |Forward| hasura
    hasura .-> |Forward| website
```


### Product Management Flow
Product management occurs through the `/admin` paths of the client application. New product images are uploaded to the Minio instance and the resource url is saved along with the product details. Again, as a client wrapper to a single GraphQL endpoint, it becomes very easy to expose additional functionality like PIM management without the need for incorporating excessive additional tooling.

### GraphQL SDK
This project uses an innovative, generated, GraphQl Client SDK. For more information, [see the SDK documentation.](www/utils/FluidGraphQL.md)

### Hasura Migration Flow
Hasura is a powerful backend provider that has offline development primitives baked in. You can define, iterate on, and deploy your migrations through the helpful CLI. For more information see the [migration guide.](hasura/README.md)

### 3 Factor Applications

This application follows the 3 Factor App principles which are composed of robust client-side state management and a centralized API layer that manages the business logic, architecture and service routing. For more information on 3 factor apps, [visit the website.](https://3factor.app/)

## Clear Demo Resources

Use the script below to clear the demo resources such as created containers and volumes:

```bash
    ./clear-demo-resources.sh
```
