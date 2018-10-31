#!/usr/bin/env bash
set -e


cd spa
npm run build-develop
cd ..

export BUCKET=s3://dev.bw.commons.ucsc-cgp-dev.org/
aws s3 sync --acl public-read dist/ $BUCKET --delete --profile ucsc-dev
aws cloudfront create-invalidation --distribution-id EB0RHFRVO3AA0 --paths "/*" --profile ucsc-dev