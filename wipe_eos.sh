#!/bin/bash
docker ps -a | tail -n 2 | awk '{print $1}' | xargs docker rm -f
docker volume ls | tail -n 3 | awk '{print $2}' | xargs docker volume rm
sudo rm -rf eosio_docker/data/*
