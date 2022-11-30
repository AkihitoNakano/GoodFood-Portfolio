push:
	docker buildx build --platform linux/amd64 -t app .
	docker tag app gcr.io/good-food-365002/backend-app
	docker push gcr.io/good-food-365002/backend-app

.PHONY: push