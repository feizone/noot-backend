test:
		git reset --hard && git fetch && git checkout origin/test && npm install && npm run stop:test && npm run tsc && npm run start:test
dev:
		git reset --hard && git fetch && git checkout origin/dev && npm install && npm run stop:dev && npm run tsc && npm run start:dev
pre:
		git reset --hard && git fetch && git checkout origin/master && npm install && npm run stop:pre && npm run tsc && npm run start:pre
online:
		git reset --hard && git fetch && git checkout origin/master && npm install && npm run stop:prod && npm run tsc && npm run start:prod