build: less
	./node_modules/.bin/gulp default

dist-clean:
	rm -rf node_modules

lint: less
	./node_modules/.bin/gulp jshint
	./node_modules/.bin/gulp csslint

less:
	./node_modules/.bin/gulp less

run: build
	node .

test:
	npm test

.PHONY: build dist-clean lint less run test
