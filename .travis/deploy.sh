#!/usr/bin/env bash

# Check if it is a pull request
# If it is not a pull request, generate the deploy key
if [ "${TRAVIS_PULL_REQUEST}" != "false" ]; then
    echo -e "Pull Request, not pushing a build"
    exit 0;
else
    openssl aes-256-cbc -K $encrypted_5d746cffa216_key -iv $encrypted_5d746cffa216_iv -in service-portal.enc -out service-portal -d
    chmod 600 service-portal
    eval `ssh-agent -s`
    ssh-add service-portal
fi

# If current dev branch is master, push to build repo ci-beta
if [ "${TRAVIS_BRANCH}" = "master" ]; then
    .travis/release.sh "ci-stable"
fi

# If current dev branch is deployment branch, push to build repo
if [[ "${TRAVIS_BRANCH}" = "ci-beta"  || "${TRAVIS_BRANCH}" = "qa-beta" || "${TRAVIS_BRANCH}" = "qa-stable" || "${TRAVIS_BRANCH}" = "prod-beta" || "${TRAVIS_BRANCH}" = "prod-stable" ]]; then
    .travis/release.sh "${TRAVIS_BRANCH}"
fi
