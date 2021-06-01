module.exports = {
    webpack: (config, options, webpack) => {
      config.entry.main = [
        './dist/src/main.js'
      ]
  
      return config
    }
  }