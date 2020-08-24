'use strict';

const fs = require('fs');
const path = require('path');
const argument = process.argv[2];

const readConfig = (configPath, strictMode) => {
  fs.readFile(path.join(__dirname, configPath), (err, data) => {
    if (err) {
      return console.log(err);
    }

    const parsedData = {};
    const isNumericValue = (element) => !isNaN(Number(element));
    const booleanLikeTrue = (element) =>
      element === 'true' || element === 'on' || element === 'yes';
    const booleanLikeFalse = (element) =>
      element === 'false' || element === 'off' || element === 'no';

    const configData = data
      .toString()
      .split(`\n`)
      .filter((line) => line !== '')
      .filter((line) => line[0] !== '#')
      .map((line) => line.split('=').map((line) => line.trim()))
      .filter((line) => {
        if (line.length !== 2 && strictMode) {
          throw 'Invalid config file.';
        }

        if (line.length === 2) {
          return line;
        }
      })
      .map((line) => {
        if (isNumericValue(line[1])) {
          line[1] = Number(line[1]);
        }

        if (booleanLikeTrue(line[1])) {
          line[1] = true;
        }

        if (booleanLikeFalse(line[1])) {
          line[1] = false;
        }

        return line;
      });

    configData.forEach((line) => (parsedData[line[0]] = line[1]));

    try {
      parsedData[argument] === undefined
        ? console.log('Argument is invalid, please try again.')
        : console.log(parsedData[argument]);
    } catch (e) {
      console.log(e);
    }
  });
};

readConfig('../config/config.env', true);
