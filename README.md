# weather-tweaker
Weather variables tweaker for S.T.A.L.K.E.R weather files


# Usage:

## Simplest 
1. Install NodeJS on your machine (at least 8.12)
2. `npm install -g stalker-weather-tweaker`
3. `stalker-weather-tweaker --help`

## If you have node and this source, do:
1. `npm install`
2. `npm run tweak -- --help` to find out how to use the tool
3. `npm run tweak -- ...args` to run the tool as desired

## Building stand-alone versions using `pkg`
```
npm run build-tweak
```
The output files are rather large since they embed node, but it means you don't
need node at the computer where you want to use these tools.
