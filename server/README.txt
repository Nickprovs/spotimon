# Deployment

Google Cloud: To deploy this app to the google cloud, you must include an app.yaml file in the same directory.
However, if you include the secrets as env variables in the yaml... don't include it in version control. 
It's format should look like this:
runtime: nodejs10
handlers:
  - url: /.*
    secure: always
    redirect_http_response_code: 301
    script: auto
env_variables:
  CLIENTID: YOURID
  CLIENTSECRET: YOURKEY

