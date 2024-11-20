# Environment Variables

| Variable                            | Github Environment | Description                                                                           |
| ----------------------------------- | ------------------ | ------------------------------------------------------------------------------------- |
| `HPAPP_TEST_APIFY_TOKEN`            | ci-go              | APIFY access token for CI tests                                                       |
| `HPAPP_GCP_PROJECT_ID`              | gcp-go             | GCP Project ID. This is used by several GCP clients such as Datastore client          |
| `HPAPP_GCP_DATASTORE_SETTINGS_KIND` | gcp-go             | GCP Datastore Kind for Settings. This is used for Datastore client to store settings. |
| `ENABLE_LOGGING`                    | N/A                | Enable logging in go test.                                                            |
