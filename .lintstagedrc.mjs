const configuration = {
  "*.{ts,tsx}": [() => "tsc --noEmit", "eslint --fix", "prettier --write"],
  "*.{js,jsx,json,css,scss,md,yaml}": ["eslint --fix", "prettier --write"],
}

export default configuration
