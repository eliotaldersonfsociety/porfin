// next.config.js
module.exports = {
  // Remove swcMinify if present; enabled by default
  webpack: (config) => {
    // Only customize if necessary
    config.optimization.splitChunks = {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          enforce: true,
        },
      },
    };
    return config;
  },
};
