
import { BrowserRouter, Route, Switch } from 'react-router-dom/cjs/react-router-dom';
import './App.css';
import Company from './component/company';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Company} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
