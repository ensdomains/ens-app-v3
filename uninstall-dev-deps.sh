#!/bin/bash

devDeps=(
    "@ensdomains/ens-test-env"
    "@ensdomains/buffer"
    "@next/bundle-analyzer"
    "@nomiclabs/hardhat-ethers"
    "@openzeppelin/contracts"
    "@testing-library/jest-dom"
    "@testing-library/react"
    "ens-contracts"
    "ganache"
    "hardhat"
    "hardhat-dependency-compiler"
    "hardhat-deploy"
)

function join_by { local IFS="$1"; shift; echo "$*"; }

FORMATTED=$(join_by " " "${devDeps[@]}")

rm -rf ./e2e ./deploy ./contracts ./jest.setup.ts ./hardhat.config.ts
yarn remove $FORMATTED
