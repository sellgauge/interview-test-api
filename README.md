# Test API for Interviews

This is a testing API for a very basic TODO application.

Please use Docker to run this API. 

```bash
$ docker build . -t test-api
$ docker run -p 8080:8080 test-api
```

If the container is successfully running, the documentation will be available under the `/doc` path (e.g. http://localhost:8080/doc)

## Workflow

1. Use `POST /auth` method (with empty body) in order to create an authorization token that will be needed in order to use other endpoints
2. Add `Authorization: api_key_here` header to all the requests 