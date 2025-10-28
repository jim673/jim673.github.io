module.exports = {
  content: ['./index.html', './script.js'],
  theme: {
    extend: {
      colors: {
        blue: {
          600: '#0071e3', // 苹果风格蓝色
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}