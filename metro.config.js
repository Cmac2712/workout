const path = require('node:path')

const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const ALIASES = {
    'react-dom': path.resolve(__dirname, "stubs/react-dom.js")  
};

const config = getDefaultConfig(__dirname);

config.resolver.resolveRequest = (context, moduleName, platform) => {
  return context.resolveRequest(
    context,
    ALIASES[moduleName] ?? moduleName,
    platform
  )
}

module.exports = withNativeWind(config, { input: './global.css' });
