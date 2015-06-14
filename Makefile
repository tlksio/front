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

uitest:
	./node_modules/.bin/casperjs test test/ui/suite.js

test:
	./node_modules/.bin/mocha test/unit

cover:
	./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha test/unit -- -R spec
	./node_modules/.bin/gulp coveralls

.PHONY: all clean dist-clean lint less test
