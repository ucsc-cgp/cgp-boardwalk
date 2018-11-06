STAGING_BUCKET := s3://dev.bw.commons.ucsc-cgp-dev.org/
INTEGRATION_BUCKET := s3://dev.bw.commons.ucsc-cgp-dev.org/
DEV_BUCKET := s3://dev.bw.commons.ucsc-cgp-dev.org/

.EXPORT_ALL_VARIABLES:

build:
	./spa/npm run build-develop

deploy-staging-travis:
	aws s3 sync --acl public-read dist/ $(STAGING_BUCKET) --delete
	aws cloudfront create-invalidation --distribution-id EB0RHFRVO3AA0 --paths "/*"

deploy-integration-travis:
	aws s3 sync --acl public-read dist/ $(INTEGRATION_BUCKET) --delete
	aws cloudfront create-invalidation --distribution-id EB0RHFRVO3AA0 --paths "/*"

deploy-dev-travis:
	aws s3 sync --acl public-read dist/ $(DEV_BUCKET) --delete
	aws cloudfront create-invalidation --distribution-id EB0RHFRVO3AA0 --paths "/*"
