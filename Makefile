all:
	./node_modules/.bin/gulp default

clean:
	./node_modules/.bin/gulp clean

dist-clean:
	./node_modules/.bin/gulp dist-clean

lint: lint
	./node_modules/.bin/gulp jshint
	./node_modules/.bin/gulp csslint

less: clean
	./node_modules/.bin/gulp less
	./node_modules/.bin/gulp minify-css

test:
	npm test

.PHONY: all clean dist-clean lint less test
