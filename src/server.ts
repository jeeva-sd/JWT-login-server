import application from './app';

const port = process?.env?.PORT || 8000;
const app = application.instance;

app.listen(port, () => console.log(`Server from ${port}`));