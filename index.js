const shell = require('shelljs');
const parser = require('solidity-parser-diligence');
const fs = require('fs');
const path = require('path');
const log = console.log;

const targets = [
 {
   repo: "https://github.com/OpenZeppelin/openzeppelin-contracts.git",
   folder: "openzeppelin-contracts",
   branch: "dev-v3.0",
   contracts: "contracts"
 },
 {
   repo: "https://github.com/omisego/plasma-contracts.git",
   folder: "plasma-contracts",
   branch: "master",
   contracts: "plasma_framework/contracts"
 },
 {
   repo: "https://github.com/Synthetixio/synthetix.git",
   folder: "synthetix",
   branch: "alpha",
   contracts: "contracts"
 },
];

function parseAll(){

  for (target of targets){
    log();
    log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    log(`Parsing ${target.folder}                       `);
    log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    log();

    shell.exec(`git clone ${target.repo}`);
    shell.cd(`${target.folder}`);
    shell.exec(`git checkout ${target.branch}`);

    const contracts = shell.ls(path.join(target.contracts, `**/*.sol`));

    for (contract of contracts){
      log(`> ${contract}`);
      const file = fs.readFileSync(contract, 'utf-8');
      parser.parse(file, {range: true});
    }

    shell.cd('..');
    shell.rm('-rf', target.folder);
  }
}

parseAll()
