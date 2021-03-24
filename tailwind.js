process.env.NODE_ENV = 'production';

module.exports = {
    // ...
    purge: {
      enabled: true,
      content: ['./src/**/*.js'],
    },
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ]
  }