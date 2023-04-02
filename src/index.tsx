import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { AppComponent } from "./presentational/modules/app/app.component";
import "reflect-metadata"; 

// import { app } from "./DI/di-container";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);


root.render(
    <AppComponent />
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();