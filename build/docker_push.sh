#!/bin/bash
branch=$1
if [ $branch = "develop" ]
then
  docker push qiansy/ecloud-frontend:dev-latest
elif [ $branch = "master" ]
then
  docker push qiansy/ecloud-frontend:latest
fi
