build:
	./node_modules/.bin/gulp default

dist-clean:
	rm -rf node_modules

lint:
	./node_modules/.bin/gulp jshint

less:
	./node_modules/.bin/gulp less

run: build
	node .

test:
	phantomjs test/

.PHONY: build dist-clean lint less run test
