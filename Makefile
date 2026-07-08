deploy:
	@set -a && . ~/ferre-precios-backend/.env && set +a && \
	docker stack deploy -c stack.yml ferreprecios
