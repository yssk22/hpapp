# Production Environment

hpapp production environment is served at Google Cloud Platform with extended customizations of open source version. This document tries to describe how production environment is customized and operated as much as possible while still keeps some secrets to protect users.

## run in production

### run app in your devcontainer

If you are the admin of GCP project, you can run an app in your devcontaier with some limitations

```
$ gcloud auth login
$ gcloud config set project {project}
$ cloud_sql_proxy -instances={CloudSQLinstance}=tcp:3306

## (open in another terminal)
$ export HPAPP_GCP_PROJECT_ID={project}
$ export HPAPP_GCP_DATASTORE_SETTINGS_KIND={kindname}
$ go run ./cmd/ --prod httpserver
```
