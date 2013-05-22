bundle:
	node_modules/.bin/browserify -r ./slider -o example/bundle.js

test:
	node_modules/.bin/browserify -d ./test/test.js -o test/bundle.js

.PHONY: bundle test
