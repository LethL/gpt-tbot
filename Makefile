build:
	docker build -t gpt-tbot .

run:
	docker run -d -p 3000:3000 --name gpt-tbot --rm gpt-tbot