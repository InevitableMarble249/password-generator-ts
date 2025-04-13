# WordNet RESTful API Docker Image

A Docker image providing a RESTful API for accessing WordNet linguistic data.

## Building the Docker Image

```bash
docker build -t wordnet-api .
```

## Running the Container

```bash
docker run -p 5001:5001 wordnet-api
```

This will expose the API on port 5001.

## API Endpoints

### Home
- `GET /` - Returns information about available endpoints

### WordNet Data
- `GET /api/random/noun` - Get a random single-word noun
- `GET /api/random/adjective` - Get a random single-word adjective

## Example Usage

```bash
# Get a random noun
curl "http://localhost:5001/api/random/noun"

# Get a random adjective
curl "http://localhost:5001/api/random/adjective"
```

## Response Format

All responses are in JSON format.

### Random Word Response Example

```json
{
  "word": "cat",
  "definition": "a domesticated cat"
}
``` 